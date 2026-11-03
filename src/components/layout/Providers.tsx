"use client";

import { MotionConfig } from "framer-motion";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Loader from "./Loader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <Loader />
      <SmoothScroll />
      <Cursor />
      {children}
    </MotionConfig>
  );
}
