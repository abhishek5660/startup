import "server-only";
import { Pool } from "pg";
import type { ContactData } from "./validation";
import type { BookingData } from "./booking";

declare global {
  // eslint-disable-next-line no-var
  var __nabhinduPool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!global.__nabhinduPool) {
    const url = process.env.DATABASE_URL;
    const local = /localhost|127\.0\.0\.1/.test(url) || /sslmode=disable/.test(url);
    global.__nabhinduPool = new Pool({
      connectionString: url,
      ssl: local ? undefined : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return global.__nabhinduPool;
}

export async function countRecentByIp(ipHash: string, minutes: number): Promise<number> {
  const { rows } = await getPool().query<{ n: number }>(
    `SELECT count(*)::int AS n FROM inquiries WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
    [ipHash, minutes],
  );
  return rows[0]?.n ?? 0;
}

export async function insertInquiry(
  data: ContactData,
  meta: { reference: string; ipHash: string; userAgent: string },
): Promise<{ id: string; createdAt: Date }> {
  const { rows } = await getPool().query<{ id: string; created_at: Date }>(
    `INSERT INTO inquiries (reference, full_name, email, phone, company, service, budget, message, ip_hash, user_agent)
     VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6, NULLIF($7, ''), $8, $9, $10)
     RETURNING id, created_at`,
    [
      meta.reference,
      data.fullName,
      data.email,
      data.phone,
      data.company,
      data.service,
      data.budget,
      data.message,
      meta.ipHash,
      meta.userAgent.slice(0, 300),
    ],
  );
  return { id: rows[0].id, createdAt: rows[0].created_at };
}

export async function markEmailResult(id: string, sent: boolean, error?: string) {
  await getPool().query(`UPDATE inquiries SET email_sent = $2, email_error = $3 WHERE id = $1`, [
    id,
    sent,
    error ? error.slice(0, 500) : null,
  ]);
}

/* ── Consultation bookings ───────────────────────────────────────── */

export async function bookedSlots(dates: string[]): Promise<{ date: string; slot: string }[]> {
  if (!dates.length) return [];
  const { rows } = await getPool().query<{ date: string; slot: string }>(
    `SELECT to_char(call_date, 'YYYY-MM-DD') AS date, call_slot AS slot
       FROM consultations
      WHERE call_date = ANY($1::date[]) AND status IN ('requested', 'confirmed')`,
    [dates],
  );
  return rows;
}

export async function countRecentConsultationsByIp(ipHash: string, minutes: number): Promise<number> {
  const { rows } = await getPool().query<{ n: number }>(
    `SELECT count(*)::int AS n FROM consultations WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
    [ipHash, minutes],
  );
  return rows[0]?.n ?? 0;
}

/** Returns null when the slot was taken in the meantime. */
export async function insertConsultation(
  data: BookingData,
  meta: { reference: string; ipHash: string; userAgent: string },
): Promise<{ id: string; createdAt: Date } | null> {
  try {
    const { rows } = await getPool().query<{ id: string; created_at: Date }>(
      `INSERT INTO consultations (reference, full_name, phone, email, call_date, call_slot, mode, topic, ip_hash, user_agent)
       VALUES ($1, $2, $3, NULLIF($4, ''), $5::date, $6, $7, NULLIF($8, ''), $9, $10)
       RETURNING id, created_at`,
      [meta.reference, data.fullName, data.phone, data.email, data.date, data.slot, data.mode, data.topic, meta.ipHash, meta.userAgent.slice(0, 300)],
    );
    return { id: rows[0].id, createdAt: rows[0].created_at };
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return null; // unique slot violation
    throw err;
  }
}

export async function markConsultationEmail(id: string, sent: boolean, error?: string) {
  await getPool().query(`UPDATE consultations SET email_sent = $2, email_error = $3 WHERE id = $1`, [id, sent, error ? error.slice(0, 500) : null]);
}

/* ── Admin dashboard ─────────────────────────────────────────────── */

export const INQUIRY_STATUSES = ["new", "contacted", "in_progress", "closed", "spam"] as const;
export const CONSULTATION_STATUSES = ["requested", "confirmed", "done", "cancelled", "spam"] as const;

export type InquiryRow = {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  budget: string | null;
  message: string;
  status: (typeof INQUIRY_STATUSES)[number];
  notes: string | null;
  email_sent: boolean;
  created_at: string;
};

export type ConsultationRow = {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string | null;
  call_date: string;
  call_slot: string;
  mode: string;
  topic: string | null;
  status: (typeof CONSULTATION_STATUSES)[number];
  notes: string | null;
  email_sent: boolean;
  created_at: string;
};

export async function listInquiries(limit = 1000): Promise<InquiryRow[]> {
  const { rows } = await getPool().query<InquiryRow>(
    `SELECT id::text, reference, full_name, email, phone, company, service, budget, message, status, notes, email_sent,
            to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at
       FROM inquiries ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function listConsultations(limit = 1000): Promise<ConsultationRow[]> {
  const { rows } = await getPool().query<ConsultationRow>(
    `SELECT id::text, reference, full_name, phone, email, to_char(call_date, 'YYYY-MM-DD') AS call_date, call_slot, mode, topic,
            status, notes, email_sent, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at
       FROM consultations ORDER BY call_date DESC, created_at DESC LIMIT $1`,
    [limit],
  );
  return rows;
}

/** Updates status and/or notes. Returns false if the row doesn't exist. */
export async function updateRecord(kind: "inquiry" | "consultation", id: string, patch: { status?: string; notes?: string }) {
  const table = kind === "inquiry" ? "inquiries" : "consultations";
  const sets: string[] = [];
  const vals: unknown[] = [id];
  if (patch.status !== undefined) {
    vals.push(patch.status);
    sets.push(`status = $${vals.length}`);
  }
  if (patch.notes !== undefined) {
    vals.push(patch.notes || null);
    sets.push(`notes = $${vals.length}`);
  }
  if (!sets.length) return true;
  const { rowCount } = await getPool().query(`UPDATE ${table} SET ${sets.join(", ")} WHERE id = $1::bigint`, vals);
  return (rowCount ?? 0) > 0;
}
