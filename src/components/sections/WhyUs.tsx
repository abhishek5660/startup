"use client";

import { motion } from "framer-motion";
import { reasons } from "@/lib/data";
import { Magnetic, Reveal, SplitWords, TiltCard } from "@/components/ui/motion";

const icons = [
  // Modern technology – chip
  "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3 5h4v4h-4z",
  // Creative design – palette
  "M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2.5a1.5 1.5 0 0 0-1 2.6c.6.6.5 1.6-.2 2.2-.7.8-1.5 1.2-2.3 1.2ZM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01",
  // Responsive – devices
  "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M2 20h11M14 13h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1ZM4 13v4h9",
  // Performance – bolt
  "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  // Scalable – layers
  "m12 2 10 5-10 5L2 7l10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
  // Reliable – shield
  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4",
];

export default function WhyUs() {
  return (
    <section id="why-us" className="section-dark overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_left,black_10%,transparent_60%)]" />
        <div className="absolute -right-32 bottom-0 h-[34rem] w-[34rem] rounded-full bg-electric/20 blur-[140px]" />
      </div>
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SplitWords text="Why choose us" className="display-lg max-w-[10ch]" />
          <Reveal delay={0.1}>
            <p className="lede mt-6 max-w-[42ch] text-haze">
              A small, focused team that cares about the details — how your site looks, how fast it loads, and how well it
              holds up as your business grows.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Magnetic className="mt-8 inline-flex">
              <a href="#contact" className="btn btn-primary">
                Talk to us about your project
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={(i % 2) * 0.1} amount={0.2} className={i % 2 === 1 ? "sm:mt-10 sm:-mb-10" : ""}>
              <TiltCard
                initial="rest"
                whileHover="hover"
                className="gradient-border spotlight group relative h-full overflow-hidden rounded-3xl bg-white/[0.03] p-7"
              >
                <div className="relative z-[2]">
                  <motion.div
                    variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.08 } }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg, rgba(24,180,255,.18), rgba(139,44,245,.25))" }}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9fd6ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={icons[i]} />
                    </svg>
                  </motion.div>
                  <h3 className="mt-6 text-xl font-bold capitalize">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-haze">{r.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
