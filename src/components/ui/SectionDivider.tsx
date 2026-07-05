"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated hairline divider that draws itself in as it scrolls into view. A
 * gradient line expands from center, a glowing node pulses at the middle, and a
 * soft light bar sweeps along it — a cinematic "scene break" between sections.
 */
export function SectionDivider({
  className,
  variant = "line",
}: {
  className?: string;
  /** "line" = expanding hairline · "diamond" = node-centered break */
  variant?: "line" | "diamond";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto flex h-24 w-full max-w-7xl items-center justify-center px-6",
        className,
      )}
    >
      {/* base expanding line */}
      <motion.div
        className="relative h-px w-full overflow-hidden"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.14) 35%, rgba(108,99,255,0.5) 50%, rgba(255,255,255,0.14) 65%, transparent)",
        }}
      >
        {/* traveling light sweep */}
        <motion.span
          className="absolute inset-y-0 w-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.9), transparent)",
          }}
          initial={{ x: "-30%" }}
          whileInView={{ x: "1200%" }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />
      </motion.div>

      {variant === "diamond" && (
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 45, opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="block h-2 w-2 border border-secondary/70 bg-void"
            animate={{ boxShadow: ["0 0 0px rgba(0,229,255,0)", "0 0 12px rgba(0,229,255,0.8)", "0 0 0px rgba(0,229,255,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      )}
    </div>
  );
}
