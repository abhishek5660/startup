import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured, listConsultations, listInquiries } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quotes a CSV cell and neutralises spreadsheet formula injection. */
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  // Phone numbers like +91 98… are left alone; anything else starting with a formula character is escaped.
  if (/^[=@\t\r]/.test(s) || /^[+-](?![\d\s()-]+$)/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!isDatabaseConfigured()) return new NextResponse("Database is not configured", { status: 503 });
  const kind = req.nextUrl.searchParams.get("kind") === "calls" ? "calls" : "inquiries";
  const rows: Record<string, unknown>[] = kind === "calls" ? await listConsultations(10000) : await listInquiries(10000);
  const cols = rows[0] ? Object.keys(rows[0]) : ["reference"];
  const csv = "﻿" + [cols.map(cell).join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nabhindu-${kind}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
