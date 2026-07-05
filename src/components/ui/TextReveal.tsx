"use client";

import { motion } from "framer-motion";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

/**
 * Line/word masked reveal. Each word rides up from behind a clip mask with a
 * per-word stagger — the classic cinematic title reveal.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  once = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once, margin: "-10% 0px" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE_OUT_EXPO,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
