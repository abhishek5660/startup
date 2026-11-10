import "server-only";
import { createSign } from "node:crypto";

/* ── Google Search Console ───────────────────────────────────────── */

export function isGscConfigured() {
  return Boolean(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && process.env.GSC_SITE_URL);
}

let cachedToken: { token: string; exp: number } | null = null;

/** Service-account login (signed JWT → access token). No extra npm package needed. */
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;

  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: process.env.GSC_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const key = process.env.GSC_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(`Google login failed: ${data.error_description || data.error || res.status}`);
  cachedToken = { token: data.access_token, exp: now + (data.expires_in ?? 3600) };
  return cachedToken.token;
}

export type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function searchAnalytics(dimension: "date" | "query" | "page", days: number, rowLimit = 25): Promise<GscRow[]> {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2); // Search Console data ~2 din late aata hai
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const site = encodeURIComponent(process.env.GSC_SITE_URL!);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await getAccessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: ymd(start),
      endDate: ymd(end),
      dimensions: [dimension],
      rowLimit: dimension === "date" ? days : rowLimit,
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as { rows?: GscRow[]; error?: { message?: string } };
  if (!res.ok) throw new Error(`Search Console: ${data.error?.message || res.status}`);
  const rows = data.rows ?? [];
  return dimension === "date" ? rows.sort((a, b) => a.keys[0].localeCompare(b.keys[0])) : rows;
}

/* ── On-page SEO audit ───────────────────────────────────────────── */

export type PageAudit = {
  url: string;
  status: number;
  title: string;
  description: string;
  h1: number;
  issues: string[];
};

const pick = (html: string, re: RegExp) => (html.match(re)?.[1] ?? "").trim();
const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export async function auditPage(url: string): Promise<PageAudit> {
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "follow" });
    const html = await res.text();
    const title = decode(pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
    const description = decode(pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i));
    const h1 = (html.match(/<h1[\s>]/gi) || []).length;
    const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html);
    const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

    const issues: string[] = [];
    if (res.status !== 200) issues.push(`Status ${res.status} (200 hona chahiye)`);
    if (!title) issues.push("Title missing hai");
    else if (title.length > 60) issues.push(`Title lamba hai (${title.length}/60)`);
    else if (title.length < 30) issues.push(`Title chhota hai (${title.length}, 30–60 rakhein)`);
    if (!description) issues.push("Meta description missing hai");
    else if (description.length > 160) issues.push(`Description lambi hai (${description.length}/160)`);
    else if (description.length < 70) issues.push(`Description chhoti hai (${description.length}, 70–160 rakhein)`);
    if (h1 === 0) issues.push("H1 heading nahi hai");
    if (h1 > 1) issues.push(`${h1} H1 headings hain (1 rakhein)`);
    if (!canonical) issues.push("Canonical link nahi hai");
    if (!ogImage) issues.push("OG image nahi hai");
    if (noindex) issues.push("Page noindex hai — Google index nahi karega");

    return { url, status: res.status, title, description, h1, issues };
  } catch (err) {
    return { url, status: 0, title: "", description: "", h1: 0, issues: [`Page open nahi hua: ${err instanceof Error ? err.message : "error"}`] };
  }
}

/* ── PageSpeed Insights ──────────────────────────────────────────── */

export type SpeedResult = {
  strategy: "mobile" | "desktop";
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: string;
  cls: string;
  tbt: string;
  fcp: string;
};

type Lighthouse = {
  lighthouseResult?: {
    categories: Record<string, { score: number | null }>;
    audits: Record<string, { displayValue?: string }>;
  };
  error?: { message?: string };
};

export async function pageSpeed(url: string, strategy: "mobile" | "desktop"): Promise<SpeedResult> {
  const p = new URLSearchParams({ url, strategy });
  for (const c of ["performance", "seo", "accessibility", "best-practices"]) p.append("category", c);
  if (process.env.PAGESPEED_API_KEY) p.set("key", process.env.PAGESPEED_API_KEY);

  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${p}`, { cache: "no-store" });
  const data = (await res.json()) as Lighthouse;
  if (!res.ok || !data.lighthouseResult) throw new Error(`PageSpeed: ${data.error?.message || res.status}`);

  const { categories: cat, audits: a } = data.lighthouseResult;
  const score = (k: string) => Math.round((cat[k]?.score ?? 0) * 100);
  const val = (k: string) => a[k]?.displayValue ?? "–";
  return {
    strategy,
    performance: score("performance"),
    seo: score("seo"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    lcp: val("largest-contentful-paint"),
    cls: val("cumulative-layout-shift"),
    tbt: val("total-blocking-time"),
    fcp: val("first-contentful-paint"),
  };
}
