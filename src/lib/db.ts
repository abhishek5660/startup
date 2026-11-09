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
