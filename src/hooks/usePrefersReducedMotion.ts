"use client";

import { useMediaQuery } from "./useMediaQuery";

/** Plain boolean for gating heavy effects (R3F, particle loops, etc). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
