"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { devlogs, type Devlog } from "@/lib/data";
import { Artwork } from "@/components/ui/Artwork";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { EASE_OUT_EXPO } from "@/lib/utils";

export function Devlogs() {
  return (
    <section id="devlogs" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Latest Devlogs"
            title="Notes from the workshop."
          />
          <a
            href="#"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 self-start text-sm font-medium text-muted transition-colors hover:text-ink md:self-auto"
          >
            All devlogs
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {devlogs.map((log, i) => (
            <DevlogCard key={log.id} log={log} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function DevlogCard({ log, index }: { log: Devlog; index: number }) {
  const variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <motion.a
      href="#"
      variants={variants}
      data-cursor="hover"
      data-cursor-label="Read"
      whileHover={{ y: -6, boxShadow: "0 40px 70px -35px rgba(0,0,0,0.85)" }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-card transition-colors duration-500 hover:border-primary/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        >
          <Artwork palette={log.palette} seed={index + 9} className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        {/* deepening gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(to top, ${log.palette[0]}33, transparent 70%)` }}
        />
        <span className="absolute top-4 left-4 rounded-full border border-line bg-void/60 px-3 py-1 font-mono text-[10px] tracking-widest text-secondary uppercase backdrop-blur transition-transform duration-500 group-hover:-translate-y-0.5">
          {log.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-muted/70 uppercase transition-transform duration-500 group-hover:translate-x-1">
          <span>{log.date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {log.readingTime}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight text-ink transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-gradient">
          {log.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{log.excerpt}</p>
        {/* sliding read button */}
        <span className="mt-5 inline-flex items-center gap-1.5 overflow-hidden text-sm font-medium text-primary">
          <span className="transition-transform duration-500 group-hover:translate-x-0.5">Read more</span>
          <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </motion.a>
  );
}
