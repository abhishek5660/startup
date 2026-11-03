"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LOADER_KEY } from "@/lib/loader-script";

/**
 * Brand intro, shown once per browser session.
 * Animated purely with CSS (see globals.css) so it plays from the very first paint,
 * before JavaScript loads, and lifts away on its own. A pre-paint script hides it on
 * repeat visits and for reduced-motion users; React just removes it afterwards.
 */
export default function Loader() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let skip = false;
    try {
      skip = Boolean((window as Window & { __ntSkipLoader?: number }).__ntSkipLoader);
      sessionStorage.setItem(LOADER_KEY, "1");
    } catch {}
    const t = setTimeout(() => setMounted(false), skip ? 0 : 2600);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div id="nt-loader" role="status" aria-label="Loading Nabhindu Technologies" className="fixed inset-0 z-[400] flex items-center justify-center bg-ink">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 blur-[90px]" />
      <div className="relative flex flex-col items-center">
        <div className="nt-loader-mark relative h-[120px] w-[248px]">
          <Image src="/brand/nabhindu-mark.png" alt="" fill sizes="248px" priority className="object-contain" />
        </div>
        <p className="nt-loader-text mt-6 font-display text-sm font-semibold tracking-[0.32em] text-white/85">NABHINDU TECHNOLOGIES</p>
        <div className="mt-6 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
          <div className="nt-loader-bar h-full origin-left rounded-full" style={{ background: "var(--brand-gradient)" }} />
        </div>
      </div>
    </div>
  );
}
