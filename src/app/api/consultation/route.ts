import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { antiSpamSchema, fieldErrors } from "@/lib/validation";
import { bookableDates, bookingSchema } from "@/lib/booking";
import { bookedSlots, countRecentConsultationsByIp, insertConsultation, isDatabaseConfigured, markConsultationEmail } from "@/lib/db";
import { isEmailConfigured, sendConsultationNotification } from "@/lib/mailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2_000;
const HOURLY_LIMIT = 3;
const UNAVAILABLE = `Online booking is temporarily unavailable. Call or WhatsApp us on ${site.phone}.`;

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
  return `NC-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

/** Available days and already-taken slots. */
export async function GET() {
  const dates = bookableDates();
  if (!isDatabaseConfigured()) return json(200, { ok: true, dates, booked: [], online: false });
  try {
    return json(200, { ok: true, dates, booked: await bookedSlots(dates), online: true });
  } catch (err) {
    console.error("[consultation] Failed to load slots:", err instanceof Error ? err.message : err);
    return json(200, { ok: true, dates, booked: [], online: false });
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, { ok: false, error: "Bookings can only be made from our website." });
  if (!req.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false, error: "Send the booking as JSON." });

  const raw = await req.text();
  if (raw.length > 6_000) return json(413, { ok: false, error: "Your booking details are too long." });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "The booking could not be read. Refresh the page and try again." });
  }

  const trap = antiSpamSchema.safeParse(body);
  const startedAt = trap.success ? trap.data.startedAt : undefined;
  if (!trap.success || trap.data.website || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(200, { ok: true, reference: null });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return json(422, { ok: false, error: "Some details need attention.", fields: fieldErrors(parsed.error) });
  }
  const data = parsed.data;

  if (!isDatabaseConfigured()) {
    console.error("[consultation] DATABASE_URL is not set — booking could not be stored.");
    return json(503, { ok: false, error: UNAVAILABLE });
  }

  const ipHash = hashIp(req);
  try {
    if ((await countRecentConsultationsByIp(ipHash, 60)) >= HOURLY_LIMIT) {
      return json(429, { ok: false, error: "You've made several bookings in the last hour. Try again later or WhatsApp us." });
    }
    const reference = makeReference();
    const saved = await insertConsultation(data, { reference, ipHash, userAgent: req.headers.get("user-agent") || "" });
    if (!saved) {
      return json(409, { ok: false, error: "Someone just booked that slot. Pick another time.", fields: { slot: "This slot was just taken." } });
    }

    if (isEmailConfigured()) {
      try {
        await sendConsultationNotification(data, reference, saved.createdAt);
        await markConsultationEmail(saved.id, true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[consultation] Email notification failed:", msg);
        await markConsultationEmail(saved.id, false, msg).catch(() => {});
      }
    } else {
      await markConsultationEmail(saved.id, false, "SMTP not configured").catch(() => {});
    }
    return json(201, { ok: true, reference });
  } catch (err) {
    console.error("[consultation] Failed to store booking:", err instanceof Error ? err.message : err);
    return json(500, { ok: false, error: UNAVAILABLE });
  }
}
