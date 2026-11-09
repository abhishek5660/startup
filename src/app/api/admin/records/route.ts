import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { CONSULTATION_STATUSES, INQUIRY_STATUSES, isDatabaseConfigured, updateRecord } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("inquiry"), id: z.string().regex(/^\d+$/), status: z.enum(INQUIRY_STATUSES).optional(), notes: z.string().max(5000).optional() }),
  z.object({ kind: z.literal("consultation"), id: z.string().regex(/^\d+$/), status: z.enum(CONSULTATION_STATUSES).optional(), notes: z.string().max(5000).optional() }),
]);

export async function PATCH(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Your session has expired. Log in again." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid update." }, { status: 422 });
  const { kind, id, status, notes } = parsed.data;
  try {
    const ok = await updateRecord(kind, id, { status, notes });
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "Record not found." }, { status: 404 });
  } catch (err) {
    console.error("[admin] update failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Couldn't save. Try again." }, { status: 500 });
  }
}
