// Usage: node scripts/gsc-env.mjs            (Downloads me key khud dhundhta hai)
//    or: node scripts/gsc-env.mjs "C:\path\to\key.json"
// Service-account JSON se GSC_* values .env.local me likhta hai. Key screen par print nahi hoti.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** Bina path ke chalane par Downloads me sabse nayi service-account key dhundhta hai. */
function findKey() {
  const dir = join(homedir(), "Downloads");
  const hits = readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".json"))
    .map((f) => join(dir, f))
    .filter((f) => {
      try {
        const j = JSON.parse(readFileSync(f, "utf8"));
        return j.type === "service_account" && j.client_email && j.private_key;
      } catch {
        return false;
      }
    })
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (!hits.length) {
    console.error(`Downloads (${dir}) me koi service account JSON key nahi mili. Path dekar chalayein: node scripts/gsc-env.mjs "C:\\...\\key.json"`);
    process.exit(1);
  }
  console.log(`Key file mili: ${hits[0]}`);
  return hits[0];
}

const file = process.argv[2] || findKey();
if (!existsSync(file)) {
  console.error(`File nahi mili: ${file}`);
  process.exit(1);
}
const key = JSON.parse(readFileSync(file, "utf8"));
if (!key.client_email || !key.private_key) {
  console.error("Ye service account ki JSON key file nahi lagti (client_email / private_key nahi mila).");
  process.exit(1);
}

const values = {
  GSC_CLIENT_EMAIL: key.client_email,
  GSC_PRIVATE_KEY: JSON.stringify(key.private_key), // "...\n..." ek line me
  GSC_SITE_URL: "https://nabhindu.vercel.app/",
};

let env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
for (const [name, value] of Object.entries(values)) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  env = re.test(env) ? env.replace(re, () => line) : `${env.replace(/\s*$/, "\n")}${line}\n`;
}
writeFileSync(".env.local", env);
console.log(`Done. .env.local me GSC values likh di gayi (service account: ${key.client_email}).`);
