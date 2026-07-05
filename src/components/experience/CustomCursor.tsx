"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useHasFinePointer } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CursorVariant = "default" | "hover" | "text";
type Ripple = { id: number; x: number; y: number };

/**
 * AAA custom cursor.
 *
 * Layers (all pointer-events-none, fixed, top-most):
 *  1. Spotlight — a large soft light that illuminates whatever is under the
 *     pointer (screen blend), giving nearby elements a lit feel.
 *  2. Outer ring — liquid, low-stiffness spring so it lags and "flows".
 *  3. Inner dot — fast spring, near-instant.
 *  4. Ripples — expanding rings spawned on click.
 *
 * Ring expands on hover, collapses to a caret on text, and shows an optional
 * label. Magnetic attraction is handled per-element by MagneticButton; the
 * cursor simply reacts to the resulting hover state.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // liquid outer ring — soft, laggy
  const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.9 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.9 });
  // spotlight — even softer
  const spotX = useSpring(x, { stiffness: 90, damping: 26, mass: 1 });
  const spotY = useSpring(y, { stiffness: 90, damping: 26, mass: 1 });
  // inner dot — snappy
  const dotX = useSpring(x, { stiffness: 1200, damping: 45, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 1200, damping: 45, mass: 0.3 });

  useEffect(() => {
    if (!hasFinePointer || reduced) return;
    document.documentElement.classList.add("cursor-none");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea, [role='button']",
      ) as HTMLElement | null;
      if (!el) {
        setVariant("default");
        setLabel("");
        return;
      }
      const custom = el.getAttribute("data-cursor");
      if (custom === "text" || el.matches("input, textarea")) {
        setVariant("text");
      } else {
        setVariant("hover");
      }
      setLabel(el.getAttribute("data-cursor-label") ?? "");
    };

    const down = (e: PointerEvent) => {
      setPressed(true);
      const id = rippleId.current++;
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(
        () => setRipples((r) => r.filter((rp) => rp.id !== id)),
        700,
      );
    };
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [hasFinePointer, reduced, visible, x, y]);

  if (!hasFinePointer || reduced) return null;

  const ringSize = variant === "hover" ? 68 : variant === "text" ? 3 : 32;
  const ringRadius = variant === "text" ? 2 : 999;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
    >
      {/* 1. Spotlight — illuminates nearby content */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: spotX,
          y: spotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 340,
          height: 340,
          mixBlendMode: "screen",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.16), rgba(0,229,255,0.06) 40%, transparent 62%)",
        }}
        animate={{ scale: variant === "hover" ? 1.35 : pressed ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
      />

      {/* 2. Liquid outer ring */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          width: ringSize,
          height: variant === "text" ? 26 : ringSize,
          borderRadius: ringRadius,
          scale: pressed ? 0.82 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div className="h-full w-full rounded-[inherit] border border-white/80" />
      </motion.div>

      {/* 3. Inner dot */}
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(108,99,255,0.9)]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: variant === "hover" ? 0 : pressed ? 1.6 : 1 }}
      />

      {/* label */}
      <AnimatePresence>
        {label && variant === "hover" && (
          <motion.span
            className="absolute top-0 left-0 font-mono text-[9px] font-medium tracking-[0.25em] text-white uppercase"
            style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* 4. Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute top-0 left-0 rounded-full border border-secondary/60"
            style={{ x: r.x, y: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 12, height: 12, opacity: 0.7 }}
            animate={{ width: 90, height: 90, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
