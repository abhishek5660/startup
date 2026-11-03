"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { Reveal, SplitWords, TiltCard } from "@/components/ui/motion";
import ProjectPreview from "@/components/ui/ProjectPreview";
import { getLenis } from "@/lib/scroll";

function BrowserFrame({ project, tall = false }: { project: Project; tall?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-2">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
      </div>
      <div className={`relative overflow-hidden ${tall ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
        <div className="absolute inset-0 transition-transform duration-[2.2s] ease-[cubic-bezier(.45,0,.2,1)] group-hover:-translate-y-[38%]">
          <ProjectPreview kind={project.preview} />
        </div>
      </div>
    </div>
  );
}

function LiveDemoButton({ project, className = "" }: { project: Project; className?: string }) {
  if (project.liveUrl) {
    return (
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost-dark !py-2.5 text-sm ${className}`}>
        Live demo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    );
  }
  return (
    <span
      aria-disabled="true"
      title="This is a sample concept — there is no live demo yet."
      className={`btn !cursor-not-allowed border border-white/10 !py-2.5 text-sm text-white/40 ${className}`}
    >
      Live demo soon
    </span>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = document.querySelectorAll<HTMLElement>("#project-dialog a[href], #project-dialog button");
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        id="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-navy p-6 text-white shadow-2xl sm:rounded-[2rem] sm:p-8"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="group">
          <BrowserFrame project={project} tall />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.isSample && <span className="chip bg-amber-300/15 text-amber-200">Sample concept</span>}
          <span className="chip bg-white/10 text-white/70">{project.kind}</span>
        </div>
        <h3 id="project-dialog-title" className="mt-3 text-3xl font-bold">
          {project.title}
        </h3>
        <p className="mt-3 leading-relaxed text-haze">{project.description}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-white/60">Key features</h4>
            <ul className="mt-3 space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[0.95rem]">
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-[2px] bg-gradient-to-br from-sky to-violet" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/60">Technologies</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="chip border border-white/10 bg-white/5 text-white/85">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {project.isSample && (
          <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-haze">
            This is a sample concept showing the kind of project we build. It is not client work.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" onClick={onClose} className="btn btn-primary !py-2.5 text-sm">
            Build something like this
          </a>
          <LiveDemoButton project={project} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<Project | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="portfolio" className="section-dark overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-violet/15 blur-[140px]" />
      </div>
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SplitWords text="Our work" className="display-lg" />
          <Reveal delay={0.1}>
            <p className="lede max-w-[52ch] text-haze lg:ml-auto">
              Nabhindu Technologies is a new studio. Until our first client projects launch, these sample concepts show the kind
              of websites and applications we build.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} amount={0.15}>
              <TiltCard max={5} className="gradient-border spotlight group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white/[0.03] p-4">
                <div className="relative z-[2]">
                  <BrowserFrame project={p} />
                  {p.isSample && (
                    <span className="chip absolute left-3 top-12 bg-amber-300 font-semibold text-navy shadow-lg">Sample concept</span>
                  )}
                </div>
                <div className="relative z-[2] flex flex-1 flex-col px-2 pb-2 pt-5">
                  <p className="text-sm text-white/50">{p.kind}</p>
                  <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-haze">{p.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                    {p.tech.map((t) => (
                      <li key={t} className="chip border border-white/10 bg-white/[0.05] text-white/75">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
                    <button type="button" onClick={() => setActive(p)} className="btn btn-primary !py-2.5 text-sm">
                      View details
                    </button>
                    <LiveDemoButton project={p} />
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <ProjectModal project={active} onClose={close} />}</AnimatePresence>
    </section>
  );
}
