"use client";

import { motion, type Variants } from "framer-motion";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

/**
 * Character-by-character cinematic reveal: each glyph rises, sharpens from blur
 * and fades in with a fine stagger. Words stay unbreakable so wrapping is clean.
 *
 * Two trigger modes:
 *  - `trigger="inView"` (default) animates when scrolled into view.
 *  - `trigger="mount"` + `play` lets a parent orchestrate timing (e.g. the hero
 *    revealing after the loader finishes).
 */
export function CharReveal({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  once = true,
  trigger = "inView",
  play = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  trigger?: "inView" | "mount";
  play?: boolean;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const char: Variants = {
    hidden: { y: "0.55em", opacity: 0, filter: "blur(8px)" },
    visible: {
      y: "0em",
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  };

  const animateProps =
    trigger === "inView"
      ? { whileInView: "visible" as const, viewport: { once, margin: "-10% 0px" } }
      : { animate: play ? ("visible" as const) : ("hidden" as const) };

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      {...animateProps}
      aria-label={text}
      role="text"
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(word).map((c, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block will-change-[transform,opacity,filter]"
              variants={char}
            >
              {c}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
