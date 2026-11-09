"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { TiltCard } from "@/components/ui/motion";
import type { ConsultationRow, InquiryRow } from "@/lib/db";

/* Colour follows the entity: inquiries are always blue, calls always orange (validated pair). */
const C_INQ = "#1e6bff";
const C_CALL = "#eb6834";
const GRID = "#e6e9f6";
const TEXT_2 = "#5b6390";

const istDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
const dayLabel = (ymd: string, opts: Intl.DateTimeFormatOptions) => new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });
function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function niceMax(v: number) {
  if (v <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  const n = Math.ceil(v / step);
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * step;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Bar path: 4px rounded data-end, square at the baseline. */
function colPath(x: number, y: number, w: number, h: number) {
  if (h <= 0) return "";
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
function barPath(x: number, y: number, w: number, h: number) {
  if (w <= 0) return "";
  const r = Math.min(4, h / 2, w);
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}

function Tooltip({ x, y, children, width }: { x: number; y: number; children: React.ReactNode; width: number }) {
  const left = Math.min(Math.max(x, 70), width - 70);
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-navy px-3 py-2 text-xs text-white shadow-xl"
      style={{ left, top: y - 8 }}
    >
      {children}
    </div>
  );
}

/* ── Card shell with a 3D entrance ─────────────────────────────── */
function ChartCard({ title, sub, children, className = "", delay = 0 }: { title: string; sub?: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, rotateX: 22, y: 30 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
      className={`chart-card relative rounded-[1.5rem] bg-white p-5 sm:p-6 ${className}`}
    >
      <h2 className="font-display text-base font-bold text-navy">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-slate">{sub}</p>}
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}

/* ── Grouped column chart: daily activity ──────────────────────── */
type Day = { day: string; inq: number; calls: number };

function ActivityChart({ days }: { days: Day[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = 220;
  const pad = { l: 28, r: 8, t: 10, b: 26 };
  const max = niceMax(Math.max(1, ...days.map((d) => Math.max(d.inq, d.calls))));
  const innerW = Math.max(0, width - pad.l - pad.r);
  const innerH = H - pad.t - pad.b;
  const band = days.length ? innerW / days.length : 0;
  const bw = Math.max(2, Math.min(12, (band - 6) / 2)); // two bars + 2px gap, capped thin
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(days.length / Math.max(1, Math.floor(innerW / 56)));

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-sm text-slate" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: C_INQ }} /> Inquiries
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: C_CALL }} /> Calls booked
        </span>
      </div>
      <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}>
        {width > 0 && (
          <svg width={width} height={H} role="img" aria-label="Daily inquiries and call bookings">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
                <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={TEXT_2}>
                  {t}
                </text>
              </g>
            ))}
            {days.map((d, i) => {
              const cx = pad.l + band * i + band / 2;
              const on = hover === i;
              return (
                <g key={d.day} onPointerEnter={() => setHover(i)}>
                  <rect x={pad.l + band * i} y={pad.t} width={band} height={innerH} fill={on ? "#f3f5ff" : "transparent"} />
                  <motion.path
                    d={colPath(cx - bw - 1, y(d.inq), bw, pad.t + innerH - y(d.inq))}
                    fill={C_INQ}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.015, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: `0px ${pad.t + innerH}px`, transformBox: "view-box" }}
                  />
                  <motion.path
                    d={colPath(cx + 1, y(d.calls), bw, pad.t + innerH - y(d.calls))}
                    fill={C_CALL}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.7, delay: 0.35 + i * 0.015, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: `0px ${pad.t + innerH}px`, transformBox: "view-box" }}
                  />
                  {i % labelEvery === 0 && (
                    <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fill={TEXT_2}>
                      {dayLabel(d.day, { day: "numeric", month: "short" })}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={pad.l} x2={width - pad.r} y1={pad.t + innerH} y2={pad.t + innerH} stroke="#cfd4ea" strokeWidth={1} />
          </svg>
        )}
        {hover !== null && days[hover] && (
          <Tooltip x={pad.l + band * hover + band / 2} y={y(Math.max(days[hover].inq, days[hover].calls))} width={width}>
            <p className="font-semibold">{dayLabel(days[hover].day, { weekday: "short", day: "numeric", month: "short" })}</p>
            <p className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: C_INQ }} /> {days[hover].inq} inquiries
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: C_CALL }} /> {days[hover].calls} calls booked
            </p>
          </Tooltip>
        )}
      </div>
      <table className="sr-only">
        <caption>Daily activity</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Inquiries</th>
            <th>Calls booked</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.day}>
              <td>{d.day}</td>
              <td>{d.inq}</td>
              <td>{d.calls}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Horizontal bars: one series, value at the tip ─────────────── */
function HBars({ rows, color, unit, empty }: { rows: { label: string; value: number }[]; color: string; unit: string; empty: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const total = rows.reduce((a, r) => a + r.value, 0);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const rowH = 44;
  const barH = 14;
  const valueW = 34;
  if (!total) return <p className="py-8 text-center text-sm text-slate">{empty}</p>;
  return (
    <div ref={ref} className="relative" onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={rows.length * rowH} role="img" aria-label={`${unit} breakdown`}>
          {rows.map((r, i) => {
            const w = ((width - valueW) * r.value) / max;
            const top = i * rowH;
            return (
              <g key={r.label} onPointerEnter={() => setHover(i)}>
                <rect x={0} y={top} width={width} height={rowH} fill={hover === i ? "#f6f7fd" : "transparent"} rx={8} />
                <text x={0} y={top + 14} fontSize={12.5} fill="#0a1033">
                  {r.label}
                </text>
                <rect x={0} y={top + 22} width={width - valueW} height={barH} rx={4} fill="#f0f2fa" />
                <motion.path
                  d={barPath(0, top + 22, Math.max(w, r.value ? 3 : 0), barH)}
                  fill={color}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: `0px 0px`, transformBox: "view-box" }}
                />
                <text x={width} y={top + 22 + barH / 2} dy="0.32em" textAnchor="end" fontSize={12.5} fontWeight={600} fill="#0a1033">
                  {r.value}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && rows[hover] && (
        <Tooltip x={Math.min(width / 2, 160)} y={hover * rowH + 18} width={width}>
          <p className="font-semibold">{rows[hover].label}</p>
          <p className="mt-0.5">
            {rows[hover].value} {unit} · {Math.round((rows[hover].value / total) * 100)}%
          </p>
        </Tooltip>
      )}
      <table className="sr-only">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th>{r.label}</th>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Stat tile with count-up and change vs previous period ─────── */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

function StatTile({ label, value, suffix, delta, hint, dark = false, i }: { label: string; value: number; suffix?: string; delta?: number | null; hint: string; dark?: boolean; i: number }) {
  const up = (delta ?? 0) > 0;
  const flat = !delta;
  return (
    <motion.div initial={{ opacity: 0, rotateY: -25, y: 20 }} animate={{ opacity: 1, rotateY: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }} style={{ transformPerspective: 900 }}>
      <TiltCard
        max={12}
        className={`group relative h-full overflow-hidden rounded-[1.5rem] p-5 ${dark ? "bg-ink text-white shadow-[0_30px_60px_-30px_rgba(30,107,255,0.9)]" : "stat-3d bg-white text-navy"}`}
      >
        {dark && <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric/50 blur-[50px]" />}
        <div className="relative z-[2]">
          <p className={`text-sm ${dark ? "text-white/65" : "text-slate"}`}>{label}</p>
          <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">
            <CountUp value={value} suffix={suffix} />
          </p>
          <p className={`mt-2 flex flex-wrap items-center gap-1.5 text-xs ${dark ? "text-white/60" : "text-slate"}`}>
            {delta !== undefined && delta !== null && (
              <span
                className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5 font-semibold ${
                  flat ? (dark ? "bg-white/10" : "bg-mist") : up ? "bg-emerald-100 text-emerald-800" : "bg-[#fde8e8] text-[#b42318]"
                }`}
              >
                {flat ? "–" : up ? "▲" : "▼"} {Math.abs(delta)}
                {suffix === "%" ? " pts" : ""}
              </span>
            )}
            {hint}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
const RANGES = [7, 30, 90] as const;

export default function AdminCharts({ inquiries, calls }: { inquiries: InquiryRow[]; calls: ConsultationRow[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const today = istDay(new Date());

  const m = useMemo(() => {
    const start = addDays(today, -(range - 1));
    const prevStart = addDays(start, -range);
    const inqDay = (r: InquiryRow) => istDay(new Date(r.created_at));
    const callBookedDay = (r: ConsultationRow) => istDay(new Date(r.created_at));
    const realInq = inquiries.filter((r) => r.status !== "spam");
    const realCalls = calls.filter((r) => r.status !== "spam");

    const inRange = realInq.filter((r) => inqDay(r) >= start);
    const inPrev = realInq.filter((r) => inqDay(r) >= prevStart && inqDay(r) < start);
    const callsRange = realCalls.filter((r) => callBookedDay(r) >= start);
    const callsPrev = realCalls.filter((r) => callBookedDay(r) >= prevStart && callBookedDay(r) < start);

    const days: Day[] = Array.from({ length: range }, (_, i) => {
      const day = addDays(start, i);
      return { day, inq: inRange.filter((r) => inqDay(r) === day).length, calls: callsRange.filter((r) => callBookedDay(r) === day).length };
    });

    const conv = (rows: InquiryRow[]) => (rows.length ? Math.round((rows.filter((r) => r.status === "closed").length / rows.length) * 100) : 0);

    const count = <T,>(rows: T[], key: (r: T) => string | null, order?: string[]) => {
      const map = new Map<string, number>();
      order?.forEach((o) => map.set(o, 0));
      rows.forEach((r) => {
        const k = key(r) || "Not specified";
        map.set(k, (map.get(k) || 0) + 1);
      });
      const out = [...map].map(([label, value]) => ({ label, value }));
      return order ? out : out.sort((a, b) => b.value - a.value);
    };

    const upcoming = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(today, i);
      return { label: i === 0 ? "Today" : dayLabel(day, { weekday: "short", day: "numeric" }), value: realCalls.filter((c) => c.call_date === day && c.status !== "cancelled").length };
    });

    return {
      days,
      inq: inRange.length,
      inqDelta: inRange.length - inPrev.length,
      calls: callsRange.length,
      callsDelta: callsRange.length - callsPrev.length,
      conv: conv(inRange),
      convDelta: inPrev.length ? conv(inRange) - conv(inPrev) : null,
      upcomingTotal: upcoming.reduce((a, u) => a + u.value, 0),
      pipeline: [
        { label: "New", value: inRange.filter((r) => r.status === "new").length },
        { label: "Contacted", value: inRange.filter((r) => r.status === "contacted").length },
        { label: "Deal in progress", value: inRange.filter((r) => r.status === "in_progress").length },
        { label: "Closed", value: inRange.filter((r) => r.status === "closed").length },
      ],
      services: count(inRange, (r) => r.service).slice(0, 6),
      budgets: count(inRange, (r) => r.budget),
      upcoming,
    };
  }, [inquiries, calls, range, today]);

  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* 3D header band */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-white sm:px-9 sm:py-10">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-electric/40 blur-[90px]" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-violet/40 blur-[90px]" />
          <div className="floor-grid absolute inset-x-0 bottom-0 h-full opacity-70" />
          <div className="absolute right-[6%] top-0 hidden h-full w-[38%] md:block">
            {[
              { c: "#18b4ff", x: "18%", y: "30%", s: "46px", d: "0s" },
              { c: "#1e6bff", x: "48%", y: "52%", s: "62px", d: "-2s" },
              { c: "#8b2cf5", x: "76%", y: "24%", s: "38px", d: "-4s" },
            ].map((q) => (
              <span key={q.c} className="post-cube" style={{ "--c": q.c, "--x": q.x, "--y": q.y, "--s": q.s, "--d": q.d } as React.CSSProperties}>
                <i />
                <i />
                <i />
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-white/60">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{greet} 👋</h1>
        <p className="mt-2 max-w-[44ch] text-haze">
          {m.upcoming[0].value ? `You have ${m.upcoming[0].value} call${m.upcoming[0].value > 1 ? "s" : ""} today. ` : ""}
          Here&apos;s how your website is performing.
        </p>
        <div role="group" aria-label="Date range" className="mt-6 inline-flex rounded-full bg-white/10 p-1 backdrop-blur">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${range === r ? "text-navy" : "text-white/75 hover:text-white"}`}
            >
              {range === r && <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative whitespace-nowrap"><span className="hidden sm:inline">Last </span>{r} days</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile i={0} dark label="Inquiries" value={m.inq} delta={m.inqDelta} hint={`vs previous ${range} days`} />
        <StatTile i={1} label="Calls booked" value={m.calls} delta={m.callsDelta} hint={`vs previous ${range} days`} />
        <StatTile i={2} label="Conversion rate" value={m.conv} suffix="%" delta={m.convDelta} hint="inquiries marked Closed" />
        <StatTile i={3} label="Calls next 7 days" value={m.upcomingTotal} hint="requested + confirmed" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Daily activity" sub={`Inquiries and calls booked, last ${range} days`} className="lg:col-span-2" delay={0.15}>
          <ActivityChart days={m.days} />
        </ChartCard>
        <ChartCard title="Sales pipeline" sub="Where this period's inquiries stand" delay={0.25}>
          <HBars rows={m.pipeline} color={C_INQ} unit="inquiries" empty="No inquiries in this period yet." />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Popular services" sub="Inquiries by service" delay={0.3}>
          <HBars rows={m.services} color={C_INQ} unit="inquiries" empty="No inquiries in this period yet." />
        </ChartCard>
        <ChartCard title="Budgets" sub="What clients plan to spend" delay={0.35}>
          <HBars rows={m.budgets} color={C_INQ} unit="inquiries" empty="No inquiries in this period yet." />
        </ChartCard>
        <ChartCard title="Upcoming calls" sub="Bookings for the next 7 days" className="md:col-span-2 lg:col-span-1" delay={0.4}>
          <HBars rows={m.upcoming} color={C_CALL} unit="calls" empty="No calls booked for the next 7 days." />
        </ChartCard>
      </div>
    </div>
  );
}
