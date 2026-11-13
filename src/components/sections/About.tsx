"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, SplitWords, TiltCard } from "@/components/ui/motion";
import Counter from "@/components/ui/Counter";
import { processSteps, services, techStack, values } from "@/lib/data";
import { founder } from "@/lib/site";

function ValueIcon({ kind }: { kind: string }) {
  const reduce = useReducedMotion();
  const loop = reduce ? undefined : { repeat: Infinity, repeatType: "reverse" as const, duration: 1.8 };
  if (kind === "Innovation")
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden>
        <motion.path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4" stroke="#18b4ff" strokeWidth="2.4" strokeLinecap="round"
          animate={reduce ? undefined : { opacity: [0.3, 1] }} transition={loop} />
        <motion.rect x="17" y="17" width="14" height="14" rx="3" fill="url(#vg1)" animate={reduce ? undefined : { rotate: [0, 90] }} style={{ originX: "24px", originY: "24px" }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
        <defs><linearGradient id="vg1" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#1e6bff" /><stop offset="1" stopColor="#8b2cf5" /></linearGradient></defs>
      </svg>
    );
  if (kind === "Quality")
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden>
        <path d="M24 5 9 11v11c0 9.5 6.4 17.4 15 20 8.6-2.6 15-10.5 15-20V11L24 5Z" fill="url(#vg2)" opacity="0.15" stroke="url(#vg2)" strokeWidth="2.2" strokeLinejoin="round" />
        <motion.path d="m17 24 5 5 9-10" stroke="#1e6bff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />
        <defs><linearGradient id="vg2" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#18b4ff" /><stop offset="1" stopColor="#8b2cf5" /></linearGradient></defs>
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden>
      {[{ x: 8, h: 12 }, { x: 19, h: 20 }, { x: 30, h: 30 }].map((b, i) => (
        <motion.rect key={i} x={b.x} width="9" rx="2" fill={["#18b4ff", "#1e6bff", "#8b2cf5"][i]}
          initial={{ y: 42, height: 0 }} whileInView={{ y: 42 - b.h, height: b.h }} viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
      ))}
      <motion.path d="M8 18 20 10l8 5 12-10" stroke="#0a1033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8 }} />
    </svg>
  );
}

export default function About() {
  const stats = [
    { value: services.length, label: "Core services, from interface design to full-stack builds" },
    { value: techStack.length, label: "Technologies and tools in our working stack" },
    { value: processSteps.length, label: "Clear steps from first conversation to launch" },
  ];

  return (
    <section id="about" className="section-light overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SplitWords text="We are Nabhindu Technologies" className="display-lg max-w-[14ch] text-navy" />
            <Reveal delay={0.15}>
              <p className="lede mt-7 max-w-[60ch] text-slate">
                Nabhindu Technologies is a growing technology startup focused on building modern, scalable, and visually
                engaging digital experiences. We combine creativity, technology, and innovation to help businesses establish a
                powerful digital presence.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-5 max-w-[60ch] text-[0.98rem] leading-relaxed text-slate">
                Founded by <strong className="font-semibold text-navy">{founder.name}</strong>, a graduate of{" "}
                {founder.university}, in Sector 88, Faridabad, we work directly with business owners — you talk to the
                people who design and write your code.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <a
                href="/about"
                className="group mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-line bg-white p-3 pr-5 shadow-[0_20px_50px_-35px_rgba(10,16,51,0.45)] transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(30,107,255,0.45)]"
              >
                <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-xl bg-mist font-display text-lg font-bold text-navy">
                  AK
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-navy">{founder.name}</span>
                  <span className="block text-sm text-slate">
                    {founder.jobTitle} · {founder.university} graduate
                  </span>
                </span>
                <span aria-hidden className="text-electric transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative">
            <div className="relative mx-auto aspect-[1361/632] w-full max-w-[460px]">
              <div aria-hidden className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.16),rgba(139,44,245,0.08)_50%,transparent_70%)]" />
              <motion.div
                className="absolute inset-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/brand/nabhindu-lockup.png"
                  alt="Nabhindu Technologies logo"
                  fill
                  sizes="(max-width: 1024px) 90vw, 460px"
                  className="object-contain drop-shadow-[0_20px_40px_rgba(30,107,255,0.18)]"
                />
              </motion.div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <TiltCard className="gradient-border spotlight group relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-[0_20px_60px_-35px_rgba(10,16,51,0.35)]">
                <div className="relative z-[2]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mist">
                    <ValueIcon kind={v.title} />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-navy">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{v.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-navy p-8 text-white sm:p-10">
          <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet/40 blur-[90px]" />
          <div aria-hidden className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-electric/40 blur-[90px]" />
          <dl className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter to={s.value} className="font-display text-6xl font-extrabold tracking-tight text-gradient" />
                  <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-haze">{s.label}</p>
                </dd>
              </div>
            ))}
            <div>
              <dt className="sr-only">Location</dt>
              <dd>
                <p className="font-display text-2xl font-bold leading-tight sm:pt-3">Faridabad,<br />Haryana</p>
                <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-haze">Available for projects across India</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
