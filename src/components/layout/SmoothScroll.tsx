"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToHash, setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling synced with GSAP ScrollTrigger, plus smooth in-page anchor links. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      let href = a?.getAttribute("href");
      if (!href) return;
      // "/#section" links scroll smoothly when we're already on the homepage.
      if (href.startsWith("/#") && location.pathname === "/") href = href.slice(1);
      if (!href.startsWith("#") || href.length < 2) return;
      if (scrollToHash(href)) e.preventDefault();
    };
    document.addEventListener("click", onClick);

    // Honour a hash in the URL on first load.
    if (location.hash) setTimeout(() => scrollToHash(location.hash), 300);

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
