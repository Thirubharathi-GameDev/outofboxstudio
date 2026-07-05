"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useHasFinePointer } from "@/hooks/useMediaQuery";

/**
 * 3D tilt card with a pointer-tracking glow. Children can opt into parallax by
 * using `transform-style: preserve-3d` and `translateZ` in their own styles.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const handleMove = (e: React.PointerEvent) => {
    if (!hasFinePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const glowBg = useMotionTemplate`radial-gradient(340px circle at ${glowX}% ${glowY}%, rgba(108,99,255,0.18), transparent 60%)`;
  // specular sheen that slides opposite the tilt
  const sheen = useMotionTemplate`linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) ${glowX}%, transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      whileHover={{
        boxShadow:
          "0 40px 80px -30px rgba(0,0,0,0.8), 0 0 40px -20px rgba(108,99,255,0.5)",
      }}
      className={cn(
        "group relative rounded-3xl [transform-style:preserve-3d]",
        className,
      )}
    >
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      {/* moving reflection sheen */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: sheen }}
      />
      {children}
    </motion.div>
  );
}
