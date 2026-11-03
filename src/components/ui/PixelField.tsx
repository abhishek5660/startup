"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; s: number; c: string; a: number; tw: number };

const COLORS = ["#18b4ff", "#1e6bff", "#5b33f0", "#8b2cf5"];

/**
 * Canvas particle field of small squares — the logo's pixel cluster, dispersed.
 * Particles drift, link with faint lines, and are gently pushed away by the pointer.
 * Pauses off-screen and when the tab is hidden; static with reduced motion.
 */
export default function PixelField({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 768;
      const count = Math.round(((w * h) / (mobile ? 16000 : 11000)) * density);
      parts = Array.from({ length: Math.min(count, mobile ? 36 : 120) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22 - 0.05,
        s: Math.random() < 0.15 ? 3.2 : 1.2 + Math.random() * 1.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: 0.35 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const linkDist = w < 768 ? 80 : 110;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reduce) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 140) * 0.9;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.tw += 0.02;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            ctx.globalAlpha = (1 - Math.sqrt(d2) / linkDist) * 0.14;
            ctx.strokeStyle = "#5d8bff";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = p.a * (0.7 + Math.sin(p.tw) * 0.3);
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      if (running && !reduce) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !started) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    // Start after the page has settled so the first paint isn't competing with the canvas.
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      loop();
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) idle(begin, { timeout: 2000 });
    else setTimeout(begin, 800);

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
