"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { getLenis } from "@/lib/scroll";
import { Magnetic } from "@/components/ui/motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    if (!onHome) {
      setActive(pathname.startsWith("/blog") ? "blog" : pathname.startsWith("/services") ? "services" : "");
      return;
    }
    // Observe every section so the pill clears in sections that aren't in the menu (e.g. Process).
    const els = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome, pathname]);

  // Lock scrolling and close on Escape while the mobile menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = !scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Main"
        className={`intro-drop mx-auto flex h-[60px] max-w-[1240px] items-center justify-between rounded-full pl-3 pr-2 transition-[background-color,box-shadow,border-color] duration-500 sm:pl-4 ${
          scrolled || open
            ? "glass-light shadow-[0_10px_40px_-18px_rgba(10,16,51,0.45)]"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href={onHome ? "#home" : "/"} className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/brand/nabhindu-mark.png" alt="" width={62} height={30} priority className="h-[30px] w-auto" />
          <span className="flex flex-col leading-none">
            <span className={`font-display text-[1.02rem] font-extrabold tracking-[0.04em] transition-colors duration-500 ${dark ? "text-white" : "text-navy"}`}>
              NABHINDU
            </span>
            <span className={`mt-1 font-display text-[0.56rem] font-semibold tracking-[0.42em] transition-colors duration-500 ${dark ? "text-white/60" : "text-slate"}`}>
              TECHNOLOGIES
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const isActive = active === (item.href.split("#")[1] ?? item.href.slice(1));
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    dark ? "text-white/75 hover:text-white" : "text-navy/70 hover:text-navy"
                  } ${isActive ? (dark ? "!text-white" : "!text-navy") : ""}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-white/10" : "bg-navy/[0.06]"}`}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:inline-flex">
            <a href="/#contact" className="btn btn-primary !px-5 !py-2.5 text-sm">
              Start a project
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
              dark ? "bg-white/10 text-white" : "bg-navy text-white"
            }`}
          >
            <span className="relative block h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 h-[2px] w-full rounded bg-current"
                animate={open ? { top: "6px", rotate: 45 } : { top: "0px", rotate: 0 }}
              />
              <motion.span
                className="absolute left-0 top-[6px] h-[2px] w-full rounded bg-current"
                animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
              />
              <motion.span
                className="absolute left-0 top-[12px] h-[2px] w-full rounded bg-current"
                animate={open ? { top: "6px", rotate: -45 } : { top: "12px", rotate: 0 }}
              />
            </span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 overflow-y-auto bg-ink px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 42px) 46px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 42px) 46px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 42px) 46px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-violet/30 blur-[100px]" />
              <div className="absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-electric/30 blur-[100px]" />
            </div>
            <ul className="relative flex flex-col gap-1">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between border-b border-white/10 py-4 font-display text-[2rem] font-bold uppercase tracking-tight text-white"
                  >
                    <span className="transition-transform duration-300 group-active:translate-x-2">{item.label}</span>
                    <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-sky to-violet opacity-60 transition-opacity group-hover:opacity-100" />
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="relative mt-10 space-y-2 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55 }}
            >
              <a href={`mailto:${site.email}`} className="block break-all text-white">
                {site.email}
              </a>
              <a href={site.phoneHref} className="block text-white">
                {site.phone}
              </a>
              <p className="text-sm">{site.address.full}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
