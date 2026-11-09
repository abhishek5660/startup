"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { budgetOptions, estimator, formatINR } from "@/lib/data";
import { Reveal, SplitWords, TiltCard } from "@/components/ui/motion";
import { openBooking, scrollToHash, SELECT_PLAN_EVENT } from "@/lib/scroll";
import { whatsappLink } from "@/lib/site";

/** Maps a rupee total onto the contact form's budget ranges. */
function budgetFor(total: number) {
  if (total <= 15000) return budgetOptions[0];
  if (total <= 35000) return budgetOptions[1];
  if (total <= 75000) return budgetOptions[2];
  if (total <= 150000) return budgetOptions[3];
  return budgetOptions[4];
}

function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatINR(Math.round(v / 100) * 100));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-bold text-navy">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: "var(--brand-gradient)" }}>
        {n}
      </span>
      {children}
    </h3>
  );
}

export default function Estimator() {
  const [typeId, setTypeId] = useState(estimator.types[0].id);
  const type = estimator.types.find((t) => t.id === typeId)!;
  const [pages, setPages] = useState(type.pagesIncluded);
  const [features, setFeatures] = useState<string[]>([]);
  const [speedId, setSpeedId] = useState(estimator.speeds[0].id);

  const chooseType = (id: string) => {
    const t = estimator.types.find((x) => x.id === id)!;
    setTypeId(id);
    setPages((p) => Math.max(p, t.pagesIncluded));
  };
  const toggle = (id: string) => setFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const calc = useMemo(() => {
    const speed = estimator.speeds.find((s) => s.id === speedId)!;
    const extraPages = Math.max(0, pages - type.pagesIncluded);
    const chosen = estimator.features.filter((f) => features.includes(f.id));
    const lines = [
      { label: `${type.label} (${type.pagesIncluded} page${type.pagesIncluded > 1 ? "s" : ""} included)`, amount: type.base },
      ...(extraPages ? [{ label: `${extraPages} extra page${extraPages > 1 ? "s" : ""}`, amount: extraPages * estimator.extraPage }] : []),
      ...chosen.map((f) => ({ label: f.label, amount: f.price })),
    ];
    const subtotal = lines.reduce((a, l) => a + l.amount, 0);
    const rush = Math.round((subtotal * (speed.multiplier - 1)) / 100) * 100;
    if (rush) lines.push({ label: speed.label, amount: rush });
    return { lines, total: subtotal + rush, speed, chosen };
  }, [type, pages, features, speedId]);

  const summary = [
    `Project estimate: ${formatINR(calc.total)}`,
    `• ${type.label}, ${pages} page${pages > 1 ? "s" : ""}`,
    calc.chosen.length ? `• Features: ${calc.chosen.map((f) => f.label).join(", ")}` : "",
    `• Delivery: ${calc.speed.label}`,
  ]
    .filter(Boolean)
    .join("\n");

  const sendToForm = () => {
    window.dispatchEvent(
      new CustomEvent(SELECT_PLAN_EVENT, {
        detail: { service: type.service, budget: budgetFor(calc.total), message: `${summary}\n\nMore about my project: ` },
      }),
    );
    scrollToHash("#contact");
  };

  return (
    <section id="estimate" className="section-mist overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_60%)]" />
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SplitWords text="Estimate your project" className="display-lg max-w-[12ch] text-navy" />
          <Reveal delay={0.1}>
            <p className="lede max-w-[50ch] text-slate lg:ml-auto">
              Choose what you need and see a starting price instantly. Send it to us and we&apos;ll confirm a fixed quote.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          <Reveal amount={0.1} className="space-y-10 rounded-[2rem] bg-white p-6 shadow-[0_40px_100px_-60px_rgba(10,16,51,0.5)] sm:p-9">
            <div>
              <StepLabel n={1}>What do you need?</StepLabel>
              <div role="radiogroup" aria-label="Project type" className="mt-5 grid gap-3 sm:grid-cols-3">
                {estimator.types.map((t) => {
                  const on = t.id === typeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => chooseType(t.id)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                        on ? "border-electric bg-electric/[0.06] shadow-[0_14px_30px_-18px_rgba(30,107,255,0.8)]" : "border-line hover:border-electric/40"
                      }`}
                    >
                      <span className="block font-semibold text-navy">{t.label}</span>
                      <span className="mt-1 block text-sm text-slate">from {formatINR(t.base)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <StepLabel n={2}>How many pages?</StepLabel>
              <div className="mt-5 flex items-center gap-5">
                <input
                  type="range"
                  min={1}
                  max={estimator.maxPages}
                  value={pages}
                  onChange={(e) => setPages(Math.max(Number(e.target.value), 1))}
                  aria-label="Number of pages"
                  className="estimator-range h-2 flex-1 cursor-pointer appearance-none rounded-full bg-line"
                  style={{ "--fill": `${((pages - 1) / (estimator.maxPages - 1)) * 100}%` } as React.CSSProperties}
                />
                <span className="w-16 rounded-xl bg-mist py-2 text-center font-display text-lg font-bold text-navy">{pages}</span>
              </div>
              <p className="mt-2 text-sm text-slate">
                {type.pagesIncluded} included · {formatINR(estimator.extraPage)} per extra page
              </p>
            </div>

            <div>
              <StepLabel n={3}>Extra features</StepLabel>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {estimator.features.map((f) => {
                  const on = features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(f.id)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition-all duration-200 ${
                        on ? "border-electric bg-electric/[0.06] text-navy" : "border-line text-navy/80 hover:border-electric/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${on ? "border-transparent text-white" : "border-line"}`}
                          style={on ? { background: "var(--brand-gradient)" } : undefined}
                        >
                          {on && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" aria-hidden>
                              <path d="m5 12 5 5L20 7" />
                            </svg>
                          )}
                        </span>
                        {f.label}
                      </span>
                      <span className="shrink-0 text-sm text-slate">+{formatINR(f.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <StepLabel n={4}>Delivery speed</StepLabel>
              <div role="radiogroup" aria-label="Delivery speed" className="mt-5 flex flex-wrap gap-2">
                {estimator.speeds.map((s) => {
                  const on = s.id === speedId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSpeedId(s.id)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${on ? "text-white" : "bg-mist text-navy/75 hover:text-navy"}`}
                      style={on ? { background: "var(--brand-gradient)" } : undefined}
                    >
                      {s.label}
                      {s.multiplier > 1 && <span className="ml-1 font-normal opacity-80">+{Math.round((s.multiplier - 1) * 100)}%</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1} amount={0.1}>
              <TiltCard max={6} className="group relative overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-[0_50px_100px_-40px_rgba(30,107,255,0.6)] sm:p-9">
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-electric/40 blur-[80px]" />
                <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet/40 blur-[80px]" />
                <div className="relative z-[2]">
                  <p className="text-sm text-white/60">Estimated starting price</p>
                  <p className="mt-2 font-display text-5xl font-extrabold tracking-tight sm:text-6xl" aria-live="polite">
                    <AnimatedPrice value={calc.total} />
                  </p>
                  <ul className="mt-7 space-y-2.5 border-t border-white/10 pt-6 text-[0.95rem]">
                    {calc.lines.map((l) => (
                      <li key={l.label} className="flex justify-between gap-4">
                        <span className="text-white/75">{l.label}</span>
                        <span className="shrink-0 font-medium">{formatINR(l.amount)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 space-y-3">
                    <button type="button" onClick={sendToForm} className="btn btn-primary w-full">
                      Send this estimate
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={whatsappLink(`Hi! ${summary}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn !px-3 bg-[#25d366] text-sm text-white hover:brightness-110"
                      >
                        WhatsApp
                      </a>
                      <button type="button" onClick={openBooking} className="btn btn-ghost-dark !px-3 text-sm">
                        Book free call
                      </button>
                    </div>
                  </div>
                  <p className="mt-5 text-xs leading-relaxed text-white/45">
                    This is an estimate, not a final quote — we confirm the exact price after a short call.
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
