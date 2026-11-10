// Usage: node scripts/gsc-env.mjs            (finds the key in your Downloads folder)
//    or: node scripts/gsc-env.mjs "C:\path\to\key.json"
// Writes the GSC_* values from a service-account JSON key into .env.local. The key is never printed.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** Without a path argument, picks the newest service-account key in Downloads. */
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
    console.error(`Downloads (${dir}) contains no service-account JSON key. Pass the path instead: node scripts/gsc-env.mjs "C:\\...\\key.json"`);
    process.exit(1);
  }
  console.log(`Found key file: ${hits[0]}`);
  return hits[0];
}

const file = process.argv[2] || findKey();
if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}
const key = JSON.parse(readFileSync(file, "utf8"));
if (!key.client_email || !key.private_key) {
  console.error("This does not look like a service-account JSON key (client_email / private_key missing).");
  process.exit(1);
}

const values = {
  GSC_CLIENT_EMAIL: key.client_email,
  GSC_PRIVATE_KEY: JSON.stringify(key.private_key), // "...\n..." on a single line
  GSC_SITE_URL: "https://nabhindu.vercel.app/",
};

let env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
for (const [name, value] of Object.entries(values)) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  env = re.test(env) ? env.replace(re, () => line) : `${env.replace(/\s*$/, "\n")}${line}\n`;
}
writeFileSync(".env.local", env);
console.log(`Done. GSC values written to .env.local (service account: ${key.client_email}).`);
