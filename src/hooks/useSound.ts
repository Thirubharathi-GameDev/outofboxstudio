"use client";

import { useCallback, useEffect, useState } from "react";
import { SoundManager, type SoundCue } from "@/lib/sound";

/**
 * Thin React binding over the global SoundManager. Returns fire-and-forget
 * cue helpers plus reactive enabled state + toggle for a mute control.
 */
export function useSound() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    SoundManager.init();
    const id = requestAnimationFrame(() => setEnabled(SoundManager.isEnabled()));
    const unsubscribe = SoundManager.subscribe(setEnabled);
    return () => {
      cancelAnimationFrame(id);
      unsubscribe();
    };
  }, []);

  const play = useCallback((cue: SoundCue) => SoundManager.play(cue), []);
  const toggle = useCallback(() => SoundManager.toggle(), []);

  return { enabled, toggle, play };
}

/** Convenience: handlers you can spread onto interactive elements. */
export function useHoverSound() {
  return {
    onPointerEnter: () => SoundManager.play("hover"),
    onClick: () => SoundManager.play("click"),
  };
}
