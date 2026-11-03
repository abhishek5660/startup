import "server-only";
import { Pool } from "pg";
import type { ContactData } from "./validation";

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
