import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { antiSpamSchema, contactSchema, fieldErrors } from "@/lib/validation";
import { countRecentByIp, insertInquiry, isDatabaseConfigured, markEmailResult } from "@/lib/db";
import { isEmailConfigured, sendInquiryNotification } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 3_000; // humans take longer than 3s to fill the form
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24; // 24h
const BURST_LIMIT = 3; // per IP per 10 minutes (in-memory, per server instance)
const HOURLY_LIMIT = 5; // per IP per 60 minutes (database-backed, works across instances)

const burst = new Map<string, number[]>();

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "nabhindu-default-salt-change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function burstLimited(key: string) {
  const now = Date.now();
  const recent = (burst.get(key) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= BURST_LIMIT) {
    burst.set(key, recent);
    return true;
  }
  recent.push(now);
  burst.set(key, recent);
  if (burst.size > 5000) burst.clear();
  return false;
}

function looksLikeSpam(message: string) {
  const links = (message.match(/https?:\/\/|www\./gi) || []).length;
  return links > 3 || /<a\s+href|\[url=/i.test(message);
}

function makeReference() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `NT-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  // 1. Only same-site JSON submissions.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json(403, { ok: false, error: "This form can only be submitted from the Nabhindu Technologies website." });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json(415, { ok: false, error: "Send the form as JSON." });
  }

  // 2. Bounded body.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "Your message is too long. Shorten the project details and try again." });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "The form data could not be read. Refresh the page and try again." });
  }

  // 3. Spam traps: honeypot + fill time. Bots get a quiet success so they don't retry.
  const trap = antiSpamSchema.safeParse(body);
  const startedAt = trap.success ? trap.data.startedAt : undefined;
  const elapsed = startedAt ? Date.now() - startedAt : 0;
  if (!trap.success || trap.data.website || !startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
    return json(200, { ok: true, reference: null });
  }

  // 4. Server-side validation (same schema as the browser).
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(422, {
      ok: false,
      error: "Some fields need attention. Check the highlighted fields and try again.",
      fields: fieldErrors(parsed.error),
    });
  }
  const data = parsed.data;
  if (looksLikeSpam(data.message)) {
    return json(422, {
      ok: false,
      error: "Your message contains too many links. Remove some links and try again.",
      fields: { message: "Use 3 links or fewer." },
    });
  }

  if (!isDatabaseConfigured()) {
    console.error("[contact] DATABASE_URL is not set — inquiry could not be stored.");
    return json(503, {
      ok: false,
      error: "The contact form is temporarily unavailable. Email nabhindutechnologies@gmail.com or call +91 8219472136.",
    });
  }

  // 5. Rate limits.
  const ipHash = hashIp(clientIp(req));
  if (burstLimited(ipHash)) {
    return json(429, { ok: false, error: "You've sent several inquiries in a short time. Wait 10 minutes and try again." });
  }

  try {
    if ((await countRecentByIp(ipHash, 60)) >= HOURLY_LIMIT) {
      return json(429, { ok: false, error: "You've reached the hourly limit for inquiries. Try again in an hour." });
    }

    // 6. Store first so no inquiry is ever lost.
    const reference = makeReference();
    const saved = await insertInquiry(data, {
      reference,
      ipHash,
      userAgent: req.headers.get("user-agent") || "",
    });

    // 7. Notify by email. A mail failure is recorded but doesn't fail the request.
    let emailed = false;
    if (isEmailConfigured()) {
      try {
        await sendInquiryNotification(data, reference, saved.createdAt);
        emailed = true;
        await markEmailResult(saved.id, true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[contact] Email notification failed:", msg);
        await markEmailResult(saved.id, false, msg).catch(() => {});
      }
    } else {
      console.warn("[contact] SMTP is not configured — inquiry saved without email notification.");
      await markEmailResult(saved.id, false, "SMTP not configured").catch(() => {});
    }

    return json(201, { ok: true, reference, emailed });
  } catch (err) {
    console.error("[contact] Failed to store inquiry:", err instanceof Error ? err.message : err);
    return json(500, {
      ok: false,
      error: "We couldn't save your inquiry right now. Try again in a minute, or email nabhindutechnologies@gmail.com.",
    });
  }
}

export function GET() {
  return json(405, { ok: false, error: "Use POST to submit an inquiry." });
}
