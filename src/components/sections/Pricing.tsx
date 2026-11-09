"use client";

import { motion } from "framer-motion";
import { formatINR, pricingPlans, startingPrice, type PricingPlan } from "@/lib/data";
import { Reveal, SplitWords, TiltCard } from "@/components/ui/motion";
import { scrollToHash, SELECT_PLAN_EVENT } from "@/lib/scroll";

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const choose = () => {
    window.dispatchEvent(new CustomEvent(SELECT_PLAN_EVENT, { detail: { service: plan.service, budget: plan.budget } }));
    scrollToHash("#contact");
  };
  // Side cards angle inward so the three read as a curved 3D row on large screens.
  const side = index === 0 ? "lg:[--turn:14deg]" : index === 2 ? "lg:[--turn:-14deg]" : "lg:[--turn:0deg] lg:[--lift:60px]";

  return (
    <div className={`plan-stage h-full ${side}`}>
      <div className="plan-turn h-full">
      <TiltCard
        max={9}
        initial="rest"
        whileHover="hover"
        className={`plan-card gradient-border spotlight group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-8 ${
          plan.popular ? "bg-[linear-gradient(160deg,rgba(30,107,255,0.22),rgba(139,44,245,0.14)_60%,rgba(255,255,255,0.03))]" : "bg-white/[0.03]"
        }`}
        data-active={plan.popular ? "true" : undefined}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet/30 blur-[70px]"
          variants={{ rest: { opacity: plan.popular ? 0.7 : 0.25 }, hover: { opacity: 0.9, scale: 1.15 } }}
          transition={{ duration: 0.6 }}
        />
        <div className="relative z-[2] flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            {plan.popular && (
              <span className="chip font-semibold text-white" style={{ background: "var(--brand-gradient)" }}>
                Most popular
              </span>
            )}
          </div>
          <p className="mt-6 text-sm text-white/55">Starting at</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-[2.8rem] font-extrabold leading-none tracking-tight text-white sm:text-5xl">{formatINR(plan.price)}</span>
            <span className="text-sm text-white/50">/ project</span>
          </p>
          <p className="mt-4 leading-relaxed text-haze">{plan.tagline}</p>

          <ul className="mt-7 space-y-3 border-t border-white/10 pt-7">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[0.95rem] text-white/85">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7cc8ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
                  <path d="m5 12 5 5L20 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <button type="button" onClick={choose} className={`btn w-full ${plan.popular ? "btn-primary" : "btn-ghost-dark"}`}>
              Start with {plan.name}
            </button>
          </div>
        </div>
      </TiltCard>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="section-dark overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="floor-grid absolute inset-x-0 bottom-0 h-[55%]" />
        <div className="absolute left-1/2 top-1/3 h-[36rem] w-[50rem] -translate-x-1/2 rounded-full bg-electric/15 blur-[140px]" />
      </div>
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SplitWords text="Simple pricing" className="display-lg" />
          <Reveal delay={0.1}>
            <p className="lede max-w-[52ch] text-haze lg:ml-auto">
              Website projects start at just <strong className="text-white">{formatINR(startingPrice)}</strong>. Pick a starting
              point — after a short call you get a fixed quote for exactly what you need, with no hidden costs.
            </p>
          </Reveal>
        </div>

        <div className="plan-row mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-5">
          {pricingPlans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} amount={0.15} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
              <PlanCard plan={p} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm text-white/50">
            Need something different? <a href="#contact" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Tell us about your project</a> and we&apos;ll
            suggest the right fit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
