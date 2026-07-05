"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { behindScenes, type BehindScene } from "@/lib/data";
import { Artwork } from "@/components/ui/Artwork";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE_OUT_EXPO } from "@/lib/utils";

const spanClasses: Record<BehindScene["span"], string> = {
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  square: "",
};

export function BehindScenes() {
  return (
    <section id="behind" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Behind The Scenes"
          title="The craft behind the curtain."
          intro="Concept art, engine work, models, wireframes and late-night testing — the messy, beautiful middle no one usually sees."
        />

        <div className="mt-16 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-3">
          {behindScenes.map((item, i) => (
            <GalleryTile key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTile({ item, index }: { item: BehindScene; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE_OUT_EXPO }}
      className={`group relative overflow-hidden rounded-2xl border border-line ${spanClasses[item.span]}`}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 scale-110 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125"
      >
        <Artwork palette={item.palette} seed={index + 5} className="h-full w-full" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />

      {/* glass overlay sheen on hover */}
      <div className="absolute inset-0 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
        style={{ maskImage: "linear-gradient(to top, black, transparent 55%)", WebkitMaskImage: "linear-gradient(to top, black, transparent 55%)" }}
      />

      {/* animated caption */}
      <div className="absolute bottom-0 left-0 p-5">
        <span className="block translate-y-1 font-mono text-[10px] tracking-[0.3em] text-secondary uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.category}
        </span>
        <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:-translate-y-0.5">
          {item.title}
        </h3>
        <span className="mt-2 block h-px w-0 bg-gradient-to-r from-secondary to-transparent transition-all duration-700 group-hover:w-16" />
      </div>
    </motion.div>
  );
}
