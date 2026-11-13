import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { antiSpamSchema, fieldErrors } from "@/lib/validation";
import { applicationSchema } from "@/lib/careers";
import { countRecentApplicationsByIp, insertApplication, isDatabaseConfigured, markApplicationEmail } from "@/lib/db";
import { isEmailConfigured, sendApplicationNotification } from "@/lib/mailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3_000;
const HOURLY_LIMIT = 3;
const UNAVAILABLE = `Applications are temporarily unavailable online. Email your resume to ${site.email}.`;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function hashIp(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  const salt = process.env.IP_HASH_SALT || "nabhindu-default-salt-change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function makeReference() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `NJ-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, { ok: false, error: "Applications can only be sent from our website." });
  if (!req.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false, error: "Send the application as JSON." });

  const raw = await req.text();
  if (raw.length > 8_000) return json(413, { ok: false, error: "Your application is too long." });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "The application could not be read. Refresh the page and try again." });
  }

  // Bots: pretend success, store nothing.
  const trap = antiSpamSchema.safeParse(body);
  const startedAt = trap.success ? trap.data.startedAt : undefined;
  if (!trap.success || trap.data.website || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(200, { ok: true, reference: null });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return json(422, { ok: false, error: "Some details need attention.", fields: fieldErrors(parsed.error) });
  }
  const data = parsed.data;

  if (!isDatabaseConfigured()) {
    console.error("[careers] DATABASE_URL is not set — application could not be stored.");
    return json(503, { ok: false, error: UNAVAILABLE });
  }

  const ipHash = hashIp(req);
  try {
    if ((await countRecentApplicationsByIp(ipHash, 60)) >= HOURLY_LIMIT) {
      return json(429, { ok: false, error: "You've sent several applications in the last hour. Try again later." });
    }
    const reference = makeReference();
    const saved = await insertApplication(data, { reference, ipHash, userAgent: req.headers.get("user-agent") || "" });

    if (isEmailConfigured()) {
      try {
        await sendApplicationNotification(data, reference, saved.createdAt);
        await markApplicationEmail(saved.id, true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[careers] Email notification failed:", msg);
        await markApplicationEmail(saved.id, false, msg).catch(() => {});
      }
    } else {
      await markApplicationEmail(saved.id, false, "SMTP not configured").catch(() => {});
    }
    return json(201, { ok: true, reference });
  } catch (err) {
    console.error("[careers] Failed to store application:", err instanceof Error ? err.message : err);
    return json(500, { ok: false, error: UNAVAILABLE });
  }
}
