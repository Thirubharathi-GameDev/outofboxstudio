"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/utils";

/**
 * Cinematic intro loader. Counts a synthetic progress value to 100 while the
 * logo mark draws itself in, then irises open to reveal the site.
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => {
        setProgress(100);
        setDone(true);
      }, 300);
      return () => clearTimeout(t);
    }

    let raf = 0;
    let current = 0;
    const start = performance.now();
    const minDuration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      // ease toward 100 but never finish before minDuration
      const target = Math.min(100, (elapsed / minDuration) * 100);
      current += (target - current) * 0.15;
      const shown = Math.min(100, Math.round(current + Math.random() * 0.6));
      setProgress(shown);
      if (elapsed < minDuration || shown < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => setDone(true), 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        >
          {/* ambient glow */}
          <motion.div
            aria-hidden
            className="absolute h-[42rem] w-[42rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108,99,255,0.22), transparent 60%)",
            }}
            animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col items-center gap-10">
            <LogoMark />

            <div className="flex flex-col items-center gap-3">
              <motion.p
                className="font-display text-sm tracking-[0.5em] text-muted uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Out Of Box Studio
              </motion.p>

              {/* progress bar */}
              <div className="relative h-px w-56 overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex w-56 items-center justify-between font-mono text-[11px] tracking-widest text-muted">
                <span>LOADING</span>
                <span className="tabular-nums text-ink">
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LogoMark() {
  return (
    <motion.svg
      width="96"
      height="96"
      viewBox="0 0 100 100"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
      </defs>
      {/* outer box */}
      <motion.rect
        x="14"
        y="14"
        width="72"
        height="72"
        rx="14"
        stroke="url(#loaderGrad)"
        strokeWidth="2"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.6, ease: EASE_OUT_EXPO },
          },
        }}
      />
      {/* inner escaping mark */}
      <motion.path
        d="M34 66 L50 34 L66 66"
        stroke="url(#loaderGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.2, delay: 0.5, ease: "easeInOut" },
          },
        }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill="url(#loaderGrad)"
        variants={{
          hidden: { scale: 0 },
          visible: {
            scale: [0, 1.4, 1],
            transition: { duration: 0.8, delay: 1.2 },
          },
        }}
      />
    </motion.svg>
  );
}
