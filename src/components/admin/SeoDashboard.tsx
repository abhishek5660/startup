"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Gsc = { daily: Row[]; queries: Row[]; pages: Row[] };
type Audit = { url: string; status: number; title: string; description: string; h1: number; issues: string[] };
type Speed = {
  strategy: string;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: string;
  cls: string;
  tbt: string;
  fcp: string;
};

async function load<T>(type: string, days = 28): Promise<T> {
  const res = await fetch(`/api/admin/seo?type=${type}&days=${days}`, { cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (res.status === 401) window.location.href = "/admin/login";
  if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't load data.");
  return data as T;
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const path = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};
const scoreCls = (s: number) => (s >= 90 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-[#b42318]");

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-navy">{value}</div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{children}</div>;
}

function Trend({ rows, metric, color, label }: { rows: Row[]; metric: "clicks" | "impressions"; color: string; label: string }) {
  if (!rows.length) return <p className="text-sm text-slate">No data for this period.</p>;
  const W = 600, H = 160, P = 16;
  const vals = rows.map((r) => r[metric]);
  const max = Math.max(1, ...vals);
  const pts = vals.map((v, i) => [P + (i * (W - 2 * P)) / Math.max(1, vals.length - 1), H - P - (v / max) * (H - 2 * P)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-sm text-slate">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {label} · peak {fmt(max)} in a day
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none">
        <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="#e6e9f6" />
        <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={color}>
            <title>{`${rows[i].keys[0]}: ${fmt(vals[i])}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-slate">
        <span>{rows[0].keys[0]}</span>
        <span>{rows[rows.length - 1].keys[0]}</span>
      </div>
    </div>
  );
}

function GscTable({ rows, first, isUrl }: { rows: Row[]; first: string; isUrl?: boolean }) {
  if (!rows.length) return <p className="text-sm text-slate">No data yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate">
            <th className="py-2 pr-3">{first}</th>
            <th className="py-2 pr-3 text-right">Clicks</th>
            <th className="py-2 pr-3 text-right">Impressions</th>
            <th className="py-2 pr-3 text-right">CTR</th>
            <th className="py-2 text-right">Position</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.keys[0]} className="border-b border-line/60 last:border-0">
              <td className="max-w-[280px] truncate py-2 pr-3 text-navy" title={r.keys[0]}>
                {isUrl ? path(r.keys[0]) : r.keys[0]}
              </td>
              <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.clicks)}</td>
              <td className="py-2 pr-3 text-right tabular-nums">{fmt(r.impressions)}</td>
              <td className="py-2 pr-3 text-right tabular-nums">{pct(r.ctr)}</td>
              <td className="py-2 text-right tabular-nums">{r.position.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SeoDashboard() {
  const [days, setDays] = useState(28);
  const [gsc, setGsc] = useState<Gsc | null>(null);
  const [gscErr, setGscErr] = useState("");
  const [audit, setAudit] = useState<Audit[] | null>(null);
  const [auditErr, setAuditErr] = useState("");
  const [speed, setSpeed] = useState<Speed[] | null>(null);
  const [speedErr, setSpeedErr] = useState("");
  const [speedBusy, setSpeedBusy] = useState(false);

  useEffect(() => {
    setGsc(null);
    setGscErr("");
    load<Gsc>("gsc", days).then(setGsc).catch((e: Error) => setGscErr(e.message));
  }, [days]);

  const runAudit = () => {
    setAudit(null);
    setAuditErr("");
    load<{ results: Audit[] }>("audit").then((d) => setAudit(d.results)).catch((e: Error) => setAuditErr(e.message));
  };
  useEffect(runAudit, []);

  const runSpeed = async () => {
    setSpeedBusy(true);
    setSpeedErr("");
    try {
      setSpeed((await load<{ results: Speed[] }>("speed")).results);
    } catch (e) {
      setSpeedErr((e as Error).message);
    } finally {
      setSpeedBusy(false);
    }
  };

  const totals = gsc
    ? (() => {
        const clicks = gsc.daily.reduce((s, r) => s + r.clicks, 0);
        const impressions = gsc.daily.reduce((s, r) => s + r.impressions, 0);
        const posSum = gsc.daily.reduce((s, r) => s + r.position * r.impressions, 0);
        return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? posSum / impressions : 0 };
      })()
    : null;
  const pagesWithIssues = audit?.filter((a) => a.issues.length).length ?? 0;

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <span className="min-w-0 truncate font-display font-bold text-navy">SEO<span className="hidden sm:inline"> Dashboard</span></span>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-xl border border-line bg-white px-2 py-1.5 text-xs text-navy sm:px-3 sm:py-2 sm:text-sm"
              aria-label="Time period"
            >
              <option value={7}>Last 7 days</option>
              <option value={28}>Last 28 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Link href="/admin" className="btn btn-ghost-light shrink-0 whitespace-nowrap !px-2.5 !py-1.5 !text-xs sm:!px-3 sm:!py-2 sm:!text-sm">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container-x mt-8 space-y-6">
        {/* 1. Search Console */}
        <Card title="Google Search performance">
          {gscErr ? (
            <Notice>{gscErr}</Notice>
          ) : !gsc || !totals ? (
            <p className="text-sm text-slate">Loading Search Console data…</p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile label="Clicks" value={fmt(totals.clicks)} />
                <Tile label="Impressions" value={fmt(totals.impressions)} />
                <Tile label="Avg CTR" value={pct(totals.ctr)} />
                <Tile label="Avg position" value={totals.position ? totals.position.toFixed(1) : "–"} />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Trend rows={gsc.daily} metric="clicks" color="#1e6bff" label="Clicks per day" />
                <Trend rows={gsc.daily} metric="impressions" color="#eb6834" label="Impressions per day" />
              </div>
            </div>
          )}
        </Card>

        {gsc && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Top keywords">
              <GscTable rows={gsc.queries} first="Keyword" />
            </Card>
            <Card title="Top pages">
              <GscTable rows={gsc.pages} first="Page" isUrl />
            </Card>
          </div>
        )}

        {/* 2. On-page audit */}
        <Card
          title="On-page SEO check"
          action={
            <button type="button" onClick={runAudit} className="btn btn-ghost-light !px-3 !py-2 text-sm">
              Run again
            </button>
          }
        >
          {auditErr ? (
            <Notice>{auditErr}</Notice>
          ) : !audit ? (
            <p className="text-sm text-slate">Checking every page in the sitemap…</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate">
                {audit.length} pages checked · <b className="text-navy">{pagesWithIssues}</b> need attention
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate">
                      <th className="py-2 pr-3">Page</th>
                      <th className="py-2 pr-3">Title</th>
                      <th className="py-2">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a) => (
                      <tr key={a.url} className="border-b border-line/60 align-top last:border-0">
                        <td className="py-2 pr-3">
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline">
                            {path(a.url)}
                          </a>
                        </td>
                        <td className="max-w-[260px] py-2 pr-3 text-navy">{a.title || "—"}</td>
                        <td className="py-2">
                          {a.issues.length ? (
                            <ul className="list-disc space-y-0.5 pl-4 text-amber-800">
                              {a.issues.map((i) => (
                                <li key={i}>{i}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-emerald-600">✓ No issues</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>

        {/* 3. PageSpeed */}
        <Card
          title="Page speed (homepage)"
          action={
            <button type="button" onClick={runSpeed} disabled={speedBusy} className="btn !px-3 !py-2 bg-navy text-sm text-white disabled:opacity-60">
              {speedBusy ? "Running test (~30s)…" : speed ? "Run again" : "Run speed test"}
            </button>
          }
        >
          {speedErr && <Notice>{speedErr}</Notice>}
          {!speed && !speedErr && <p className="text-sm text-slate">Run the test to get mobile and desktop scores from Google PageSpeed Insights.</p>}
          {speed && (
            <div className="grid gap-4 md:grid-cols-2">
              {speed.map((s) => (
                <div key={s.strategy} className="rounded-2xl border border-line p-4">
                  <div className="mb-3 font-display font-bold capitalize text-navy">{s.strategy}</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(
                      [
                        ["Performance", s.performance],
                        ["SEO", s.seo],
                        ["Accessibility", s.accessibility],
                        ["Best practices", s.bestPractices],
                      ] as const
                    ).map(([label, v]) => (
                      <div key={label}>
                        <div className={`font-display text-2xl font-bold ${scoreCls(v)}`}>{v}</div>
                        <div className="text-[11px] text-slate">{label}</div>
                      </div>
                    ))}
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <dt className="text-slate">LCP</dt>
                    <dd className="text-right text-navy">{s.lcp}</dd>
                    <dt className="text-slate">FCP</dt>
                    <dd className="text-right text-navy">{s.fcp}</dd>
                    <dt className="text-slate">TBT</dt>
                    <dd className="text-right text-navy">{s.tbt}</dd>
                    <dt className="text-slate">CLS</dt>
                    <dd className="text-right text-navy">{s.cls}</dd>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
