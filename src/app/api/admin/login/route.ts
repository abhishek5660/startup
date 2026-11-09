import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, checkPassword, cookieOptions, createSession, isAdminConfigured } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple brute-force protection: 5 wrong attempts per IP per 15 minutes (per server instance).
const attempts = new Map<string, number[]>();
const WINDOW = 15 * 60_000;

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin login is not set up. Add ADMIN_PASSWORD (at least 8 characters) to your environment and restart the server." },
      { status: 503 },
    );
  }

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < WINDOW);
  if (recent.length >= 5) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  if (!checkPassword(password)) {
    recent.push(now);
    attempts.set(ip, recent);
    if (attempts.size > 2000) attempts.clear();
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  attempts.delete(ip);
  const s = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, s.value, cookieOptions(s.maxAge));
  return res;
}
