"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import TechLogo from "@/components/ui/TechLogo";

const ORBIT = "M 22 330 A 262 92 -14 1 1 538 200 A 262 92 -14 1 1 22 330 Z";
const ORBIT_FRONT = "M 22 330 A 262 92 -14 0 0 538 200";

const logs = [
  { m: "GET", p: "/api/projects", s: "200", t: "18ms" },
  { m: "POST", p: "/api/contact", s: "201", t: "42ms" },
  { m: "GET", p: "/api/services", s: "200", t: "9ms" },
  { m: "PUT", p: "/api/profile", s: "200", t: "27ms" },
];

function useDepth(mx: MotionValue<number>, my: MotionValue<number>, depth: number) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return { x, y };
}

/** Frontend (browser) and backend (server) joined by a data link, circled by the logo's orbit. */
export default function HeroVisual() {
  const reduce = useReducedMotion();
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mxRaw.set((e.clientX / window.innerWidth - 0.5) * 2);
      myRaw.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const t = setInterval(() => setLogIndex((i) => i + 1), 1800);
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(t);
    };
  }, [reduce, mxRaw, myRaw]);

  const back = useDepth(mx, my, -10);
  const mid = useDepth(mx, my, 14);
  const front = useDepth(mx, my, 26);
  const chips = useDepth(mx, my, 38);

  const visibleLogs = [0, 1, 2].map((k) => logs[(logIndex + k) % logs.length]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] select-none" aria-hidden>
      {/* glow */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.35),rgba(139,44,245,0.18)_45%,transparent_70%)] blur-2xl" />

      {/* back orbit */}
      <motion.svg viewBox="0 0 560 560" className="absolute inset-0 h-full w-full" style={back}>
        <defs>
          <linearGradient id="orbit-back" x1="0" x2="1">
            <stop offset="0" stopColor="#18b4ff" stopOpacity="0.15" />
            <stop offset="1" stopColor="#8b2cf5" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path d={ORBIT} fill="none" stroke="url(#orbit-back)" strokeWidth="1.5" strokeDasharray="2 7" />
      </motion.svg>

      {/* Frontend: browser window */}
      <motion.div
        style={mid}
        initial={{ opacity: 0, y: 40, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 1.1, delay: 0.9 }}
        className="glass-dark absolute left-[3%] top-[14%] w-[62%] overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(24,180,255,0.6)]"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 h-4 flex-1 rounded-md bg-white/[0.07] px-2 text-[8px] leading-4 text-white/45 sm:text-[9px]">your-business.com</span>
        </div>
        <div className="space-y-2.5 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="h-2 w-10 rounded bg-white/40" />
            <span className="flex gap-1.5">
              <span className="h-1.5 w-5 rounded bg-white/20" />
              <span className="h-1.5 w-5 rounded bg-white/20" />
              <span className="h-1.5 w-5 rounded bg-white/20" />
            </span>
          </div>
          <div className="relative h-[72px] overflow-hidden rounded-lg sm:h-[92px]" style={{ background: "linear-gradient(120deg,#18b4ff,#1e6bff 45%,#8b2cf5)" }}>
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={reduce ? undefined : { x: ["-120%", "320%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
            />
            <div className="absolute bottom-2.5 left-3 space-y-1.5">
              <motion.span
                className="block h-2 w-[120px] max-w-[90%] origin-left rounded bg-white/90"
                animate={reduce ? undefined : { scaleX: [0.3, 1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="block h-1.5 w-16 rounded bg-white/60" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-9 rounded-md bg-white/[0.08] sm:h-11"
                animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-16 rounded-full" style={{ background: "linear-gradient(90deg,#1e6bff,#8b2cf5)" }} />
            <span className="h-5 w-12 rounded-full border border-white/20" />
          </div>
        </div>
        <span className="absolute right-3 top-11 rounded-md bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-sky">&lt;/&gt; frontend</span>
      </motion.div>

      {/* data link between the two */}
      <motion.svg viewBox="0 0 560 560" className="pointer-events-none absolute inset-0 h-full w-full" style={mid}>
        <defs>
          <linearGradient id="link" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#18b4ff" />
            <stop offset="1" stopColor="#8b2cf5" />
          </linearGradient>
        </defs>
        <path id="hero-link" d="M 150 330 C 150 420, 230 430, 268 420" fill="none" stroke="url(#link)" strokeWidth="1.6" strokeDasharray="4 6" opacity="0.8">
          {!reduce && <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.4s" repeatCount="indefinite" />}
        </path>
        {!reduce && (
          <circle r="3.5" fill="#fff">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 150 330 C 150 420, 230 430, 268 420" />
          </circle>
        )}
      </motion.svg>

      {/* Backend: server stack + live log */}
      <motion.div
        style={front}
        initial={{ opacity: 0, y: 50, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 1.1, delay: 1.1 }}
        className="glass-dark absolute bottom-[12%] right-[2%] w-[54%] rounded-2xl p-3 shadow-[0_30px_80px_-30px_rgba(139,44,245,0.7)] sm:p-4"
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-[9px] text-violet-300 sm:text-[10px]">{"{ } backend"}</span>
          <span className="flex items-center gap-1 text-[9px] text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            online
          </span>
        </div>
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-[1px] bg-sky"
                animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9 + i * 0.35, repeat: Infinity }}
              />
              <motion.span
                className="h-1.5 w-1.5 rounded-[1px] bg-violet"
                animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.3 + i * 0.25, repeat: Infinity }}
              />
              <span className="ml-auto h-1 w-1/2 rounded bg-white/15" />
            </div>
          ))}
        </div>
        <div className="mt-2.5 space-y-1 font-mono text-[8.5px] leading-tight sm:text-[10px]">
          {visibleLogs.map((l, i) => (
            <motion.div
              key={`${logIndex}-${i}`}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1 - i * 0.28, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-1.5 whitespace-nowrap text-white/80"
            >
              <span className="text-sky">{l.m}</span>
              <span className="truncate">{l.p}</span>
              <span className="ml-auto text-emerald-300">{l.s}</span>
              <span className="text-white/40">{l.t}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* front orbit arc passes over the cards, like the swoosh in the logo */}
      <motion.svg viewBox="0 0 560 560" className="pointer-events-none absolute inset-0 h-full w-full" style={front}>
        <defs>
          <linearGradient id="orbit-front" x1="0" x2="1">
            <stop offset="0" stopColor="#0a1033" />
            <stop offset="0.35" stopColor="#5b33f0" />
            <stop offset="0.75" stopColor="#1e6bff" />
            <stop offset="1" stopColor="#18b4ff" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={ORBIT_FRONT}
          fill="none"
          stroke="url(#orbit-front)"
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 1.2, ease: [0.65, 0, 0.35, 1] }}
        />
        {!reduce && (
          <circle r="4" fill="#9fe1ff" filter="url(#glow)">
            <animateMotion dur="7s" repeatCount="indefinite" path={ORBIT} />
          </circle>
        )}
      </motion.svg>

      {/* logo pixel cluster */}
      <motion.div style={chips} className="absolute right-[6%] top-[4%] grid grid-cols-3 gap-1.5">
        {["#18b4ff", "", "#18b4ff", "#1e6bff", "#5b33f0", "", "", "#8b2cf5", ""].map((c, i) =>
          c ? (
            <motion.span
              key={i}
              className="h-3.5 w-3.5 rounded-[3px]"
              style={{ background: c }}
              initial={{ opacity: 0, scale: 0 }}
              animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 1, 1, 0.5, 1], scale: 1 }}
              transition={{ delay: 1.4 + i * 0.07, duration: reduce ? 0.3 : 4, repeat: reduce ? 0 : Infinity, repeatDelay: 1 }}
            />
          ) : (
            <span key={i} />
          ),
        )}
      </motion.div>

      {/* floating technology chips */}
      {[
        { icon: "siReact", name: "React", cls: "left-[56%] top-[2%]", d: 0 },
        { icon: "siNextdotjs", name: "Next.js", cls: "left-[-2%] top-[56%]", d: 0.6 },
        { icon: "siNodedotjs", name: "Node.js", cls: "right-[-3%] top-[36%]", d: 1.2 },
        { icon: "siPostgresql", name: "PostgreSQL", cls: "left-[16%] bottom-[4%]", d: 1.8 },
      ].map((c) => (
        <motion.div key={c.name} style={chips} className={`absolute ${c.cls}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: 1.5 + c.d * 0.2, duration: 0.6 },
              scale: { delay: 1.5 + c.d * 0.2, duration: 0.6 },
              y: { duration: 5, delay: c.d, repeat: Infinity, ease: "easeInOut" },
            }}
            className="glass-dark flex items-center gap-2 rounded-xl px-2.5 py-2 shadow-lg"
          >
            <TechLogo icon={c.icon} name={c.name} size={18} onDark />
            <span className="hidden text-[11px] font-medium text-white/80 sm:inline">{c.name}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
