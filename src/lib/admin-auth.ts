import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-owner admin auth.
 * Set ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET) in .env.local.
 * Sessions are signed, http-only cookies that expire after 7 days.
 */
export const ADMIN_COOKIE = "nt_admin";
const MAX_AGE = 7 * 24 * 60 * 60;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || createHash("sha256").update(`nt-admin:${process.env.ADMIN_PASSWORD}`).digest("hex");
}

const sha = (s: string) => createHash("sha256").update(s).digest();

export function checkPassword(input: string) {
  if (!isAdminConfigured()) return false;
  return timingSafeEqual(sha(input), sha(process.env.ADMIN_PASSWORD!));
}

function sign(exp: number) {
  return createHmac("sha256", secret()).update(`admin:${exp}`).digest("hex");
}

export function createSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return { value: `${exp}.${sign(exp)}`, maxAge: MAX_AGE };
}

export function verifySession(value: string | undefined) {
  if (!value || !isAdminConfigured()) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin() {
  return verifySession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
