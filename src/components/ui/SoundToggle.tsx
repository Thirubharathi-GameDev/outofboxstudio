"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

/**
 * Ambient-audio toggle. Sound is opt-in (and there are no assets yet), but the
 * control is wired so that enabling it will start ambience + interaction cues
 * as soon as files land in /public/sounds.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="hover"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-primary/50 hover:text-ink",
        className,
      )}
    >
      {/* animated eq bars when enabled */}
      {enabled && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full bg-secondary/70"
              animate={{ height: [4, 12, 6, 14, 4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </span>
      )}
      <span className={cn("transition-opacity", enabled && "opacity-0")}>
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </span>
    </button>
  );
}
