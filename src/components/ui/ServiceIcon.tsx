"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { ServiceIconName } from "@/lib/data";

const T = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Animated line icons for each service. They respond to the parent card's
 * "hover" variant (set via whileHover/animate on the card).
 */
export default function ServiceIcon({ name }: { name: ServiceIconName }) {
  const gid = `svc-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const g = `url(#${gid})`;
  const common = { viewBox: "0 0 64 64", className: "h-14 w-14", fill: "none", "aria-hidden": true } as const;
  const stroke = { stroke: g, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#18b4ff" />
        <stop offset="0.5" stopColor="#1e6bff" />
        <stop offset="1" stopColor="#a35cff" />
      </linearGradient>
    </defs>
  );

  switch (name) {
    case "frontend":
      return (
        <svg {...common}>
          {defs}
          <rect x="6" y="10" width="52" height="40" rx="6" {...stroke} />
          <path d="M6 19h52" {...stroke} />
          <circle cx="12" cy="14.5" r="1.4" fill="#18b4ff" />
          <circle cx="17" cy="14.5" r="1.4" fill="#1e6bff" />
          <motion.path d="m26 28-6 6 6 6" {...stroke} variants={{ rest: { x: 0 }, hover: { x: -4 } }} transition={T} />
          <motion.path d="m38 28 6 6-6 6" {...stroke} variants={{ rest: { x: 0 }, hover: { x: 4 } }} transition={T} />
          <motion.path d="m34 26-4 16" {...stroke} variants={{ rest: { rotate: 0 }, hover: { rotate: 15 } }} transition={T} style={{ originX: "32px", originY: "34px" }} />
        </svg>
      );
    case "fullstack":
      return (
        <svg {...common}>
          {defs}
          <motion.path d="M20 22a10 10 0 0 1 19.5-3A8 8 0 0 1 46 34H19a7 7 0 0 1 1-12Z" {...stroke} variants={{ rest: { y: 0 }, hover: { y: -4 } }} transition={T} />
          {[40, 48, 56].map((y, i) => (
            <motion.g key={y} variants={{ rest: { x: 0 }, hover: { x: i % 2 ? 3 : -3 } }} transition={{ ...T, delay: i * 0.05 }}>
              <rect x="18" y={y - 5} width="28" height="6" rx="2" {...stroke} />
              <circle cx="23" cy={y - 2} r="1.2" fill="#8b2cf5" />
            </motion.g>
          ))}
        </svg>
      );
    case "custom":
      return (
        <svg {...common}>
          {defs}
          <motion.rect x="8" y="8" width="20" height="20" rx="4" {...stroke} variants={{ rest: { x: 0, y: 0 }, hover: { x: -3, y: -3 } }} transition={T} />
          <motion.rect x="36" y="8" width="20" height="20" rx="10" {...stroke} variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: 3, y: -3, rotate: 90 } }} transition={T} />
          <motion.rect x="8" y="36" width="20" height="20" rx="4" {...stroke} variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: -3, y: 3, rotate: 45 } }} transition={T} />
          <motion.rect x="36" y="36" width="20" height="20" rx="4" fill={g} variants={{ rest: { x: 0, y: 0, scale: 1 }, hover: { x: 3, y: 3, scale: 0.8 } }} transition={T} />
        </svg>
      );
    case "uiux":
      return (
        <svg {...common}>
          {defs}
          <rect x="8" y="10" width="40" height="44" rx="6" {...stroke} />
          <path d="M16 20h16M16 27h24M16 34h10" {...stroke} />
          <motion.g variants={{ rest: { x: 0, y: 0 }, hover: { x: -10, y: -8 } }} transition={T}>
            <path d="m40 36 16 6-7 2.5-2.5 7L40 36Z" fill={g} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </motion.g>
        </svg>
      );
    case "optimize":
      return (
        <svg {...common}>
          {defs}
          <path d="M10 44a22 22 0 1 1 44 0" {...stroke} />
          <path d="M14 44h4M46 44h4M32 22v4M18 30l3 2M46 30l-3 2" {...stroke} />
          <motion.g variants={{ rest: { rotate: -50 }, hover: { rotate: 55 } }} transition={{ type: "spring", stiffness: 120, damping: 10 }} style={{ originX: "32px", originY: "44px" }}>
            <path d="M32 44 32 28" stroke="#8b2cf5" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
          <circle cx="32" cy="44" r="3.5" fill={g} />
        </svg>
      );
  }
}
