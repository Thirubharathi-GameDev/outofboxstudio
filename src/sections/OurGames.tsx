"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { games, type Game } from "@/lib/data";
import { Artwork } from "@/components/ui/Artwork";
import { TiltCard } from "@/components/ui/TiltCard";
import { Sparks } from "@/components/ui/Sparks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { useGameModal } from "@/components/game/GameModalContext";
import { EASE_OUT_EXPO } from "@/lib/utils";

export function OurGames() {
  return (
    <section id="games" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Games"
          title="Worlds we've opened."
          intro="Each title is a self-contained universe — built from a single feeling and obsessed over until it breathes."
        />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const { open } = useGameModal();
  const cardVariants = {
    hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <TiltCard className="h-full">
        <article
          onClick={() => open(game)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open(game);
            }
          }}
          role="button"
          tabIndex={0}
          data-cursor="hover"
          data-cursor-label="Open"
          aria-label={`View ${game.title} details`}
          className="relative h-full cursor-pointer overflow-hidden rounded-3xl border border-line bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {/* animated gradient border on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `linear-gradient(130deg, ${game.accent}55, transparent 40%, transparent 60%, ${game.accent}33)`,
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: 1,
            }}
          />

          {/* artwork with subtle parallax float */}
          <div className="relative aspect-[16/10] overflow-hidden [transform:translateZ(30px)]">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            >
              <Artwork palette={game.palette} seed={index + 1} className="h-full w-full" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

            {/* spark particles */}
            <Sparks color={game.accent} count={12} />

            {/* hover buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-all duration-500 group-hover:opacity-100">
              <span className="translate-y-3 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
                View Project
              </span>
            </div>
          </div>

          <div className="relative flex flex-col gap-3 p-6 [transform:translateZ(20px)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:-translate-y-1 sm:text-3xl">
                  {game.title}
                </h3>
                <p className="mt-1 font-mono text-xs tracking-widest text-muted uppercase transition-all duration-500 group-hover:translate-x-1 group-hover:text-secondary">
                  {game.genre}
                </p>
              </div>
              <span
                className="mt-1 inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase"
                style={{ borderColor: `${game.accent}55`, color: game.accent }}
              >
                {game.release}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-muted">{game.tagline}</p>

            <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-primary group-hover:text-ink"
              >
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
