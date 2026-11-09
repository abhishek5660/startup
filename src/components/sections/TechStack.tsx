"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { techStack, type TechCategory } from "@/lib/data";
import { Reveal, SplitWords } from "@/components/ui/motion";
import TechLogo from "@/components/ui/TechLogo";

const CATEGORIES: ("All" | TechCategory)[] = ["All", "Frontend", "Backend", "Database", "Tools"];

const RINGS: { cats: TechCategory[]; r: number; dur: number; reverse?: boolean }[] = [
  { cats: ["Frontend"], r: 21, dur: 46 },
  { cats: ["Backend", "Database"], r: 34, dur: 70, reverse: true },
  { cats: ["Tools"], r: 46, dur: 90 },
];

export default function TechStack() {
  const [cat, setCat] = useState<"All" | TechCategory>("All");
  const [paused, setPaused] = useState(false);
  const isOn = (c: TechCategory) => cat === "All" || cat === c;
  const selected = techStack.filter((t) => isOn(t.category));

  return (
    <section id="technologies" className="section-mist overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SplitWords text="Our technology stack" className="display-lg max-w-[12ch] text-navy" />
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-[50ch] text-slate">
                Proven, widely supported tools — so your website is fast today and easy for any developer to maintain tomorrow.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div role="tablist" aria-label="Filter technologies by category" className="mt-9 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={cat === c}
                    onClick={() => setCat(c)}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      cat === c ? "text-white" : "bg-white text-navy/70 hover:text-navy"
                    }`}
                  >
                    {cat === c && (
                      <motion.span layoutId="tech-tab" className="absolute inset-0 -z-0 rounded-full" style={{ background: "var(--brand-gradient)" }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                    )}
                    <span className="relative">{c}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Tile grid: the main view on small screens, a compact index on large ones */}
            <motion.ul layout className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {selected.map((t) => (
                  <motion.li
                    layout
                    key={t.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.35 }}
                    className="group flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-2 py-4 text-center shadow-[0_10px_30px_-22px_rgba(10,16,51,0.4)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(30,107,255,0.45)]"
                  >
                    <TechLogo icon={t.icon} name={t.name} size={30} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-[0.78rem] font-medium leading-tight text-navy">{t.name}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>

          {/* Orbit ecosystem (large screens) */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div
              className="orbit-3d relative mx-auto aspect-square w-full max-w-[600px]"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              {/* soft shadow pooled under the tilted orbit */}
              <div aria-hidden className="absolute left-1/2 top-[58%] h-[30%] w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(30,107,255,0.22),transparent)] blur-xl" />

              <div className="orbit-plane absolute inset-0">
                {RINGS.map((ring) => (
                  <div
                    key={ring.r}
                    className="absolute left-1/2 top-1/2 rounded-full border-2 border-dashed border-navy/15"
                    style={{ width: `${ring.r * 2}%`, height: `${ring.r * 2}%`, transform: "translate(-50%, -50%)" }}
                  />
                ))}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-[26%] w-[26%] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.25),transparent_70%)]"
                  style={{ transform: "translate(-50%, -50%)" }}
                />

                {/* centre: the brand mark standing upright on the orbit plane */}
                <div className="absolute left-1/2 top-1/2 h-[20%] w-[20%]" style={{ transform: "translate(-50%, -50%)" }}>
                  <div className="face-camera relative h-full w-full" style={{ transformOrigin: "50% 100%" }}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-20px_rgba(30,107,255,0.6)]" style={{ transform: "translateY(-45%)" }}>
                      <div aria-hidden className="absolute inset-0 animate-ping rounded-full bg-electric/10 [animation-duration:3s]" />
                      <div className="relative h-[52%] w-[70%]">
                        <Image src="/brand/nabhindu-mark.png" alt="Nabhindu Technologies" fill sizes="100px" className="object-contain" />
                      </div>
                    </div>
                  </div>
                </div>

                {RINGS.map((ring) => {
                  const items = techStack.filter((t) => ring.cats.includes(t.category));
                  return (
                    <div
                      key={`ring-${ring.r}`}
                      className="absolute inset-0 animate-[orbit-spin_var(--d)_linear_infinite]"
                      style={
                        {
                          "--d": `${ring.dur}s`,
                          animationDirection: ring.reverse ? "reverse" : "normal",
                          animationPlayState: paused ? "paused" : "running",
                        } as React.CSSProperties
                      }
                    >
                      {items.map((t, i) => {
                        const angle = (i / items.length) * Math.PI * 2 + ring.r / 7;
                        const x = 50 + Math.cos(angle) * ring.r;
                        const y = 50 + Math.sin(angle) * ring.r;
                        const on = isOn(t.category);
                        return (
                          <div key={t.name} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                            <div
                              className="animate-[orbit-spin_var(--d)_linear_infinite]"
                              style={{
                                animationDirection: ring.reverse ? "normal" : "reverse",
                                animationPlayState: paused ? "paused" : "running",
                              }}
                            >
                              {/* counter-tilt so every logo tile stands up and faces the viewer */}
                              <div className="face-camera" style={{ transformOrigin: "50% 100%" }}>
                                <div
                                  data-cursor="hover"
                                  title={t.name}
                                  className={`group relative flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl border bg-white shadow-[0_18px_30px_-14px_rgba(10,16,51,0.5)] transition-all duration-500 hover:scale-115 ${
                                    on ? "border-line opacity-100" : "scale-75 border-transparent opacity-25 grayscale"
                                  }`}
                                >
                                  <TechLogo icon={t.icon} name={t.name} size={26} />
                                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    {t.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
