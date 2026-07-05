"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset = 44;

/**
 * Scroll-triggered reveal wrapper — fades, blurs, and slides content into view
 * once. Respects reduced motion automatically via Framer Motion.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  blur = true,
  once = true,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const from = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? "blur(12px)" : "blur(0px)",
      ...from,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, delay, ease: EASE_OUT_EXPO },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container — pair with <Reveal> children using the same viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}
