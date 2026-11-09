"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services, type Service } from "@/lib/data";
import { Reveal, SplitWords, TiltCard } from "@/components/ui/motion";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { scrollToHash, SELECT_SERVICE_EVENT } from "@/lib/scroll";
import { servicePageById } from "@/lib/service-pages";


function ServiceCard({ s, large }: { s: Service; large: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = `svc-panel-${s.id}`;

  const discuss = () => {
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: s.title }));
    scrollToHash("#contact");
  };

  return (
    <TiltCard
      max={large ? 4 : 6}
      initial="rest"
      animate={open ? "hover" : "rest"}
      whileHover="hover"
      data-active={open}
      className="gradient-border spotlight group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white/[0.03] p-7 sm:p-8"
    >
      {/* corner glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-electric/30 blur-[70px]"
        variants={{ rest: { opacity: 0.25, scale: 0.8 }, hover: { opacity: 0.8, scale: 1.1 } }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative z-[2] flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <ServiceIcon name={s.icon} />
          </div>
          <span className="font-display text-sm font-semibold text-white/35">Service {s.number}</span>
        </div>

        <h3 className={`mt-8 font-bold leading-tight text-white ${large ? "text-[1.7rem] sm:text-[2rem]" : "text-[1.45rem]"}`}>{s.title}</h3>
        <p className="mt-3 max-w-[46ch] leading-relaxed text-haze">{s.summary}</p>

        {s.tech && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title} technologies`}>
            {s.tech.map((t) => (
              <li key={t} className="chip border border-white/10 bg-white/[0.05] text-white/80">
                {t}
              </li>
            ))}
          </ul>
        )}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="leading-relaxed text-white/85">{s.details}</p>
                <ul className="mt-4 space-y-2.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-[0.95rem] text-haze">
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-[2px] bg-gradient-to-br from-sky to-violet" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={discuss} className="btn btn-primary !py-2.5 text-sm">
                    Discuss this service
                  </button>
                  {servicePageById(s.id) && (
                    <a href={`/services/${servicePageById(s.id)!.slug}`} className="btn btn-ghost-dark !py-2.5 text-sm">
                      Full details →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-7">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="group/btn inline-flex items-center gap-3 text-sm font-semibold text-white"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover/btn:border-transparent group-hover/btn:bg-electric">
              <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" animate={{ rotate: open ? 45 : 0 }} aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </motion.svg>
            </span>
            {open ? "Show less" : "Learn more"}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

export default function Services() {
  return (
    <section id="services" className="section-dark overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-[140px]" />
      </div>
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SplitWords text="Our services" className="display-lg" />
          <Reveal delay={0.1}>
            <p className="lede max-w-[52ch] text-haze lg:ml-auto">
              Five ways we help businesses get online and grow — whether you need a new website, a complete web application, or
              to make the site you already have faster.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08} className={`${i < 2 ? "lg:col-span-3" : "lg:col-span-2"} ${i === 4 ? "md:col-span-2 lg:col-span-2" : ""}`} amount={0.15}>
              <ServiceCard s={s} large={i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
