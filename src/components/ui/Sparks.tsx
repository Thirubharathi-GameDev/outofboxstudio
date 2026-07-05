"use client";

import { motion } from "framer-motion";

/**
 * A tiny cluster of drifting light "sparks" that fade in on hover. Purely
 * decorative — rendered inside a `group` element and revealed via group-hover.
 * Deterministic layout so SSR and client match.
 */
export function Sparks({
  count = 10,
  color = "#00e5ff",
}: {
  count?: number;
  color?: string;
}) {
  const sparks = Array.from({ length: count }, (_, i) => {
    const seed = (i + 1) * 12.9898;
    const rnd = (o: number) => {
      const v = Math.sin(seed + o) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      left: `${rnd(1) * 100}%`,
      top: `${rnd(2) * 100}%`,
      size: 1 + rnd(3) * 2,
      dur: 1.6 + rnd(4) * 2.2,
      delay: rnd(5) * 1.5,
      drift: (rnd(6) - 0.5) * 24,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, s.drift, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
