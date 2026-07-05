"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A one-shot cinematic light sweep + iris that plays when `active` flips true
 * (e.g. the moment the intro loader finishes) — the "camera" opening onto the
 * scene. Removes itself after the animation completes.
 */
export function LightSweep({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || reduced) return;
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, [active, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && !done && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(108,99,255,0.18) 45%, rgba(0,229,255,0.22) 55%, transparent)",
              filter: "blur(30px)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "220%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
