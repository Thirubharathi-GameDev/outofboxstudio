"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, Gamepad2, CalendarDays, Layers, Sparkles } from "lucide-react";
import { useGameModal } from "./GameModalContext";
import { Artwork } from "@/components/ui/Artwork";
import { Sparks } from "@/components/ui/Sparks";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { games } from "@/lib/data";
import { SoundManager } from "@/lib/sound";
import { EASE_OUT_EXPO } from "@/lib/utils";

/**
 * Cinematic game detail modal. Opened via the shared GameModalContext from any
 * game card or the featured showcase. Handles Esc-to-close, backdrop click,
 * scroll lock, and focuses the close button on open for accessibility.
 */
export function GameModal() {
  const { game, close } = useGameModal();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!game) return;
    SoundManager.play("transition");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
    };
  }, [game, close]);

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${game.title} details`}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
            onClick={close}
            data-cursor="hover"
            data-cursor-label="Close"
          />

          {/* dialog */}
          <motion.div
            data-lenis-prevent
            className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
            initial={{ y: 40, scale: 0.96, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 30, scale: 0.97, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          >
            {/* header artwork */}
            <div className="group relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-[2/1]">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
              >
                <Artwork palette={game.palette} seed={7} className="h-full w-full" />
              </motion.div>
              <Sparks color={game.accent} count={18} />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close"
                data-cursor="hover"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-void/50 text-ink backdrop-blur transition-colors hover:border-primary/60 hover:bg-primary/20"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-widest uppercase"
                  style={{ borderColor: `${game.accent}55`, color: game.accent }}
                >
                  {game.status}
                </span>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {game.title}
                </h2>
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <p className="max-w-2xl text-base leading-relaxed text-muted">
                {game.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <Meta icon={<Gamepad2 size={15} />} label="Genre" value={game.genre} />
                <Meta icon={<CalendarDays size={15} />} label="Release" value={game.release} />
                <Meta icon={<Layers size={15} />} label="Platforms" value={game.platforms.join(" · ")} />
              </div>

              {/* related titles */}
              <div className="mt-8 border-t border-line pt-6">
                <span className="font-mono text-[11px] tracking-[0.3em] text-muted/60 uppercase">
                  More from the studio
                </span>
                <div className="mt-4 flex flex-wrap gap-3">
                  {games
                    .filter((g) => g.id !== game.id)
                    .map((g) => (
                      <OtherGame key={g.id} id={g.id} title={g.title} accent={g.accent} />
                    ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MagneticButton variant="primary" cursorLabel="Play">
                  <Play size={15} className="fill-current" />
                  Watch Trailer
                </MagneticButton>
                <MagneticButton variant="secondary" cursorLabel="Wishlist">
                  <Sparkles size={15} />
                  Add to Wishlist
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted/70 uppercase">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function OtherGame({
  id,
  title,
  accent,
}: {
  id: string;
  title: string;
  accent: string;
}) {
  const { open } = useGameModal();
  const target = games.find((g) => g.id === id)!;
  return (
    <button
      onClick={() => open(target)}
      data-cursor="hover"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/50 hover:text-ink"
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      {title}
    </button>
  );
}
