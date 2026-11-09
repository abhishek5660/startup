"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TechLogo from "@/components/ui/TechLogo";
import HeroVisual from "./HeroVisual";
import type { HeroScene } from "@/components/three/heroScene";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const CHIPS = [
  { icon: "siReact", name: "React", cls: "left-[54%] top-[1%]", d: 0 },
  { icon: "siNextdotjs", name: "Next.js", cls: "left-[-2%] top-[58%]", d: 0.6 },
  { icon: "siNodedotjs", name: "Node.js", cls: "right-[-3%] top-[30%]", d: 1.2 },
  { icon: "siPostgresql", name: "PostgreSQL", cls: "left-[20%] bottom-[2%]", d: 1.8 },
];

/**
 * Real-time 3D hero: the logo's cubes and orbit ring rendered with WebGL.
 * Falls back to the layered 2.5D illustration when WebGL is unavailable.
 */
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");

  useEffect(() => {
    if (!hasWebGL()) {
      setMode("fallback");
      return;
    }
    let scene: HeroScene | null = null;
    let cancelled = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      scene?.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onScroll = () => scene?.setScroll(Math.min(window.scrollY / window.innerHeight, 1.2));

    import("@/components/three/heroScene")
      .then(({ createHeroScene }) => {
        if (cancelled || !canvasRef.current) return;
        const intro = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro")) || 0;
        scene = createHeroScene(canvasRef.current, { reduce: !!reduce, introDelay: intro * 0.6 });
        setMode("3d");
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
      })
      .catch(() => !cancelled && setMode("fallback"));

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      scene?.dispose();
    };
  }, [reduce]);

  if (mode === "fallback") return <HeroVisual />;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[600px] select-none" aria-hidden>
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.38),rgba(139,44,245,0.2)_45%,transparent_70%)] blur-2xl" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-[-8%] h-[116%] w-[116%] transition-opacity duration-1000 ${mode === "3d" ? "opacity-100" : "opacity-0"}`}
      />
      {mode === "3d" &&
        CHIPS.map((c) => (
          <div key={c.name} className={`absolute ${c.cls}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateY: -60 }}
              animate={reduce ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 1, scale: 1, rotateY: 0, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 1.6 + c.d * 0.2, duration: 0.6 },
                scale: { delay: 1.6 + c.d * 0.2, duration: 0.6 },
                rotateY: { delay: 1.6 + c.d * 0.2, duration: 0.9 },
                y: { duration: 5, delay: c.d, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ transformPerspective: 600 }}
              className="glass-dark flex items-center gap-2 rounded-xl px-2.5 py-2 shadow-lg"
            >
              <TechLogo icon={c.icon} name={c.name} size={18} onDark />
              <span className="hidden text-[11px] font-medium text-white/80 sm:inline">{c.name}</span>
            </motion.div>
          </div>
        ))}
    </div>
  );
}
