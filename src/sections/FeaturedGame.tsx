"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowUpRight, Gamepad2, CalendarDays, Layers } from "lucide-react";
import { featuredGame } from "@/lib/data";
import { Artwork } from "@/components/ui/Artwork";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Sparks } from "@/components/ui/Sparks";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function FeaturedGame() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  const g = featuredGame;

  return (
    <section id="featured" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.35em] text-secondary uppercase">
            <span className="h-px w-8 bg-secondary/50" />
            Featured Title
          </span>
        </Reveal>

        <div
          ref={ref}
          className="group relative mt-8 overflow-hidden rounded-[2rem] border border-line bg-card"
        >
          {/* huge artwork with parallax + perpetual slow zoom */}
          <motion.div style={{ y: imgY, scale }} className="absolute inset-0 -z-0">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            >
              <Artwork palette={g.palette} seed={3} className="h-full w-full" />
            </motion.div>
          </motion.div>

          {/* overlay fog drifting across the art */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40 blur-2xl"
            style={{
              background: `radial-gradient(50% 60% at 30% 40%, ${g.accent}22, transparent 60%)`,
            }}
            animate={{ x: ["-6%", "6%", "-6%"], y: ["0%", "-4%", "0%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* floating particles */}
          <Sparks color={g.accent} count={16} />

          {/* mouse-reactive lighting handled via CSS group hover glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: `radial-gradient(60% 60% at 50% 40%, ${g.accent}22, transparent 65%)` }}
          />

          <div className="relative z-10 flex min-h-[32rem] flex-col justify-end p-8 sm:p-12 lg:min-h-[40rem] lg:p-16">
            <div className="max-w-2xl">
              <Reveal blur={false}>
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-widest uppercase"
                  style={{ borderColor: `${g.accent}55`, color: g.accent }}
                >
                  {g.status}
                </span>
              </Reveal>

              <TextReveal
                as="h3"
                text={g.title}
                className="mt-5 font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              />

              <Reveal delay={0.1}>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                  {g.description}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                  <Meta icon={<Gamepad2 size={15} />} label="Genre" value={g.genre} />
                  <Meta icon={<CalendarDays size={15} />} label="Release" value={g.release} />
                  <Meta icon={<Layers size={15} />} label="Platforms" value={g.platforms.join(" · ")} />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <MagneticButton variant="primary" cursorLabel="Play">
                    <Play size={15} className="fill-current" />
                    Watch Trailer
                  </MagneticButton>
                  <MagneticButton href="#games" variant="secondary" cursorLabel="More">
                    Learn More
                    <ArrowUpRight size={15} />
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
