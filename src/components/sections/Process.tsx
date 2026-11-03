"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/data";
import { Reveal, SplitWords } from "@/components/ui/motion";

gsap.registerPlugin(ScrollTrigger);

const glyphs = [
  // Discover – magnifier
  <path key="d" d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" />,
  // Design – pen nib
  <path key="s" d="m12 19 7-7 3 3-7 7-3-3ZM18 13l-1.5-7.5L2 2l3.5 14.5L13 18M2 2l7.6 7.6M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  // Develop – code
  <path key="v" d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  // Test – check list
  <path key="t" d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  // Launch – rocket
  <path key="l" d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1ZM12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2ZM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />,
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    if (reduce) {
      steps.forEach((s) => s.setAttribute("data-active", "true"));
      gsap.set(el.querySelectorAll("[data-progress]"), { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const build = (axis: "x" | "y") => {
        const bar = el.querySelector<HTMLElement>(`[data-progress="${axis}"]`);
        if (!bar) return;
        gsap.set(bar, axis === "x" ? { scaleX: 0 } : { scaleY: 0 });
        ScrollTrigger.create({
          trigger: el.querySelector("[data-track]"),
          start: "top 75%",
          end: axis === "x" ? "bottom 45%" : "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(bar, axis === "x" ? { scaleX: p } : { scaleY: p });
            steps.forEach((s, i) => s.setAttribute("data-active", String(p >= (i / (steps.length - 1)) * 0.98 - 0.001)));
          },
        });
      };
      mm.add("(min-width: 1024px)", () => build("x"));
      mm.add("(max-width: 1023.98px)", () => build("y"));
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="process" className="section-light overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SplitWords text="Our development process" className="display-lg max-w-[14ch] text-navy" />
          <Reveal delay={0.1}>
            <p className="lede max-w-[50ch] text-slate lg:ml-auto">
              Five clear stages, so you always know what is happening with your project and what comes next.
            </p>
          </Reveal>
        </div>

        <div data-track className="relative mt-16 lg:mt-24">
          {/* track + progress: vertical on mobile, horizontal on desktop */}
          <div aria-hidden className="absolute bottom-8 left-[27px] top-8 w-[2px] bg-line lg:hidden" />
          <div aria-hidden data-progress="y" className="absolute bottom-8 left-[27px] top-8 w-[2px] origin-top lg:hidden" style={{ background: "linear-gradient(#18b4ff,#1e6bff,#8b2cf5)" }} />
          <div aria-hidden className="absolute left-[10%] right-[10%] top-[27px] hidden h-[2px] bg-line lg:block" />
          <div aria-hidden data-progress="x" className="absolute left-[10%] right-[10%] top-[27px] hidden h-[2px] origin-left lg:block" style={{ background: "var(--brand-gradient)" }} />

          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((s, i) => (
              <li key={s.number} data-step data-active="false" className="group relative flex gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                <div className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-line bg-white text-slate transition-all duration-500 group-data-[active=true]:border-transparent group-data-[active=true]:text-white group-data-[active=true]:shadow-[0_14px_34px_-12px_rgba(30,107,255,0.7)]">
                  <span aria-hidden className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100" style={{ background: "var(--brand-gradient)" }} />
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="relative" aria-hidden>
                    {glyphs[i]}
                  </svg>
                </div>
                <div className="pt-1 lg:mt-7 lg:pt-0">
                  <span className="font-display text-5xl font-extrabold tracking-tight text-[#8b93b8] transition-colors duration-500 step-num lg:text-6xl">
                    {s.number}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 max-w-[30ch] leading-relaxed text-slate lg:mx-auto">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
