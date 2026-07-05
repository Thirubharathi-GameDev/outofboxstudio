"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal blur={false}>
          <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.35em] text-secondary uppercase">
            <span className="h-px w-8 bg-secondary/50" />
            The Studio
          </span>
        </Reveal>

        <div className="mt-8 font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <TextReveal as="span" text="We create" className="block text-muted/40" />
          <TextReveal as="span" text="unforgettable" className="block text-gradient" delay={0.1} />
          <TextReveal as="span" text="experiences." className="block text-ink" delay={0.2} />
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
            Out Of Box Studio is a small team of artists, engineers and dreamers.
            We believe a game is not a product but a place — somewhere a player can
            step inside, get lost, and return changed. Every world we build starts
            with a single feeling and refuses to compromise on it.
          </p>
        </Reveal>
      </div>

      <motion.div ref={ref} style={{ x: x1 }} className="mt-20">
        <Marquee
          items={["Atmosphere", "Craft", "Emotion", "Worldbuilding", "Detail", "Immersion"]}
          speed={35}
        />
      </motion.div>
    </section>
  );
}
