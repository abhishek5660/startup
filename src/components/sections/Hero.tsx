"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import PixelField from "@/components/ui/PixelField";
import { Magnetic, SplitWords } from "@/components/ui/motion";
import Hero3D from "./Hero3D";
import { formatINR, startingPrice } from "@/lib/data";

const HEADLINE = "We build digital experiences that move businesses forward.";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const parallax = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, parallax ? 120 : 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -60 : 0]);
  const fadeRaw = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const fade = useTransform(fadeRaw, (v) => (parallax ? v : 1));

  return (
    <section ref={ref} id="home" className="section-dark relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28 sm:pt-32">
      {/* Background: grid, drifting light, trails and particles */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -left-[15%] top-[-10%] h-[60vmax] w-[60vmax] rounded-full md:animate-drift bg-electric/25 blur-[120px]" />
        <div className="absolute -right-[20%] bottom-[-25%] h-[55vmax] w-[55vmax] rounded-full md:animate-drift bg-violet/25 blur-[120px] [animation-delay:-6s]" />
        <div className="absolute left-[40%] top-[30%] h-[30vmax] w-[30vmax] rounded-full md:animate-drift bg-sky/10 blur-[100px] [animation-delay:-12s]" />
        <svg className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <defs>
            <linearGradient id="trail" x1="0" x2="1">
              <stop offset="0" stopColor="#18b4ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#1e6bff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8b2cf5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            "M -100 720 C 300 560, 700 820, 1540 380",
            "M -100 820 C 420 700, 900 900, 1540 560",
            "M -100 200 C 400 340, 1000 60, 1540 260",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="url(#trail)" strokeWidth={i === 0 ? 1.6 : 1} strokeDasharray="220 1400" opacity={i === 2 ? 0.45 : 0.9}>
              {!reduce && <animate attributeName="stroke-dashoffset" from="1620" to="0" dur={`${7 + i * 2.5}s`} repeatCount="indefinite" />}
            </path>
          ))}
        </svg>
        <PixelField className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <motion.div style={{ y: textY, opacity: fade }}>
          <p
            style={{ animationDelay: "calc(var(--intro) + 0.15s)" }}
            className="intro-fade mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-2 pr-4 text-sm text-white/75 backdrop-blur"
          >
            <span className="flex h-6 items-center gap-0.5 rounded-full bg-white/10 px-2">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-sky" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-electric" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-violet" />
            </span>
            Frontend &amp; full-stack web development, Faridabad
          </p>

          <SplitWords
            as="h1"
            text={HEADLINE}
            animateOnMount
            delay={0.25}
            stagger={0.06}
            className="display-xl max-w-[16ch]"
            wordClassName="text-sheen"
          />

          <p
            style={{ animationDelay: "calc(var(--intro) + 0.7s)" }}
            className="intro-fade lede mt-7 max-w-[54ch] text-haze"
          >
            From beautiful frontend experiences to powerful full-stack applications, Nabhindu Technologies transforms ideas
            into modern digital solutions.
          </p>

          <div
            style={{ animationDelay: "calc(var(--intro) + 0.85s)" }}
            className="intro-fade mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <a href="#services" className="btn btn-primary w-full sm:w-auto">
                Explore Our Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-ghost-dark w-full sm:w-auto">
                Let&apos;s Build Something
              </a>
            </Magnetic>
          </div>

          <a
            href="#pricing"
            style={{ animationDelay: "calc(var(--intro) + 1s)" }}
            className="intro-fade group mt-7 inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
          >
            <span className="price-cube" aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              Website projects starting at <strong className="font-display text-base font-bold text-white">{formatINR(startingPrice)}</strong>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>

        <motion.div style={{ y: visualY }} className="relative px-4 sm:px-10 lg:px-0">
          <Hero3D />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-0 hidden h-0 sm:block">
      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-white/50 transition-colors hover:text-white sm:flex"
      >
        <span className="relative flex h-11 w-[26px] justify-center rounded-full border border-white/25">
          <motion.span
            className="mt-2 h-2 w-2 rounded-[2px]"
            style={{ background: "var(--brand-gradient)" }}
            animate={reduce ? undefined : { y: [0, 16, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        SCROLL
      </motion.a>
      </motion.div>
    </section>
  );
}
