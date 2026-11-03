// Creates the `inquiries` table. Usage: npm run db:setup
// Reads DATABASE_URL from the environment or from .env.local / .env.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first (see .env.example).");
  process.exit(1);
}

const needsSsl = !/localhost|127\.0\.0\.1/.test(url) && !/sslmode=disable/.test(url);
const client = new pg.Client({ connectionString: url, ssl: needsSsl ? { rejectUnauthorized: false } : undefined });

try {
  await client.connect();
  await client.query(readFileSync(path.join(root, "db", "schema.sql"), "utf8"));
  const { rows } = await client.query("SELECT count(*)::int AS n FROM inquiries");
  console.log(`✔ inquiries table ready (${rows[0].n} rows).`);
} catch (err) {
  console.error("✖ Database setup failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
