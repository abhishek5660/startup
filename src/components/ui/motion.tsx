"use client";

import { useRef, type ReactNode, type CSSProperties, type ElementType } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts content into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
  amount?: number;
}) {
  const Comp = motion[as] as React.ComponentType<HTMLMotionProps<"div">>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Splits a headline into words that rise in with a stagger. Screen readers get the plain text. */
export function SplitWords({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  wordClassName,
  animateOnMount = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  wordClassName?: string;
  animateOnMount?: boolean;
}) {
  const words = text.split(" ");
  if (animateOnMount) {
    // Pure CSS so the headline is painted by the server HTML, not after hydration.
    return (
      <Tag className={className} aria-label={text}>
        <span aria-hidden className="block">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="intro-word" style={{ animationDelay: `calc(var(--intro) + ${(delay + i * stagger).toFixed(2)}s)` }}>
                <span className={wordClassName}>{w}</span>
              </span>
              {i < words.length - 1 && "\u00A0"}
            </span>
          ))}
        </span>
      </Tag>
    );
  }
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.4 } };
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName ?? ""}`}
              variants={{
                hidden: { y: "105%", rotate: 4, opacity: 0 },
                show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Wraps an element so it drifts toward the pointer. Desktop only; inert with reduced motion. */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className={className ?? "inline-flex"} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

/**
 * Card with a subtle 3D tilt and a cursor spotlight (via --mx/--my CSS vars).
 * Tilt is disabled for touch and reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  style,
  ...rest
}: { children: ReactNode; className?: string; max?: number; style?: CSSProperties } & Omit<
  HTMLMotionProps<"div">,
  "children" | "style"
>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 180, damping: 20 });
  const ry = useSpring(0, { stiffness: 180, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce || e.pointerType !== "mouse") return;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** The logo's pixel-square cluster, used as a motif. */
export function Pixels({ className, animate = true }: { className?: string; animate?: boolean }) {
  const squares = [
    { x: 20, y: 0, c: "#18b4ff", s: 10 },
    { x: 36, y: 12, c: "#18b4ff", s: 7 },
    { x: 4, y: 14, c: "#1e6bff", s: 10 },
    { x: 26, y: 24, c: "#6a2cf5", s: 8 },
    { x: 0, y: 30, c: "#5b33f0", s: 10 },
    { x: 13, y: 42, c: "#8b2cf5", s: 8 },
  ];
  return (
    <svg viewBox="0 0 48 52" className={className} aria-hidden>
      {squares.map((q, i) => (
        <motion.rect
          key={i}
          x={q.x}
          y={q.y}
          width={q.s}
          height={q.s}
          rx={1.2}
          fill={q.c}
          initial={animate ? { opacity: 0, scale: 0 } : false}
          whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.08 * i, duration: 0.5, ease: EASE }}
          style={{ transformOrigin: `${q.x + q.s / 2}px ${q.y + q.s / 2}px` }}
        />
      ))}
    </svg>
  );
}
