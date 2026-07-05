"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[90] h-0.5 w-full origin-left bg-gradient-to-r from-primary via-secondary to-primary"
      style={{ scaleX }}
    />
  );
}
