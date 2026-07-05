"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useHasFinePointer } from "@/hooks/useMediaQuery";
import { SoundManager } from "@/lib/sound";

type Variant = "primary" | "secondary" | "ghost";
type Ripple = { id: number; x: number; y: number };

/**
 * Premium magnetic CTA. Combines:
 *  - magnetic pull toward the pointer (springy)
 *  - a small hover scale + soft outer glow
 *  - a pointer-tracked inner light
 *  - a slowly rotating gradient border ("moving border") on hover
 *  - click ripples
 *  - sound cues (hover / click) via the SoundManager
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  strength = 0.4,
  cursorLabel,
  ...rest
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  strength?: number;
  cursorLabel?: string;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const hasFinePointer = useHasFinePointer();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rid = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  // pointer-tracked inner light
  const lx = useMotionValue(50);
  const ly = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(120px circle at ${lx}% ${ly}%, rgba(255,255,255,0.35), transparent 60%)`;

  const handleMove = (e: React.PointerEvent) => {
    if (!hasFinePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
    lx.set(((e.clientX - rect.left) / rect.width) * 100);
    ly.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    SoundManager.play("click");
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const id = rid.current++;
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    }
    onClick?.();
  };

  const styles = {
    primary:
      "bg-primary text-white shadow-[0_0_40px_-8px_rgba(108,99,255,0.6)] hover:shadow-[0_0_70px_-4px_rgba(108,99,255,0.9)]",
    secondary:
      "bg-white/[0.04] text-ink border border-line hover:border-secondary/50 hover:bg-white/[0.07]",
    ghost: "text-muted hover:text-ink",
  }[variant];

  const Comp = (href ? motion.a : motion.button) as typeof motion.button;

  return (
    <Comp
      // @ts-expect-error polymorphic ref across a/button
      ref={ref}
      href={href}
      onClick={handleClick}
      onPointerEnter={() => SoundManager.play("hover")}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      data-cursor="hover"
      data-cursor-label={cursorLabel}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-sans text-sm font-medium tracking-wide transition-colors duration-300",
        styles,
        className,
      )}
      {...rest}
    >
      {/* moving gradient border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background:
            "conic-gradient(from var(--angle), transparent, rgba(0,229,255,0.9), rgba(108,99,255,0.9), transparent 60%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "spin-border 3s linear infinite",
        }}
      />

      {/* pointer-tracked inner light */}
      {hasFinePointer && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: light, mixBlendMode: "soft-light" }}
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>

      {/* primary sweep fill */}
      {variant === "primary" && (
        <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-secondary to-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      )}

      {/* click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute z-20 rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 240, height: 240, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </Comp>
  );
}
