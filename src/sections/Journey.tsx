"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { journey } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE_OUT_EXPO } from "@/lib/utils";

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });
  const lineHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Our Journey"
          title="Every studio has an origin."
          intro="A short timeline of the sparks that brought us here — and the ones still ahead."
        />

        <div ref={ref} className="relative mt-20 pl-10 sm:pl-16">
          {/* track */}
          <div className="absolute top-2 left-[13px] h-full w-px bg-line sm:left-[23px]" />
          {/* animated fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-2 left-[13px] w-px bg-gradient-to-b from-primary via-secondary to-primary sm:left-[23px]"
          />

          <div className="flex flex-col gap-16">
            {journey.map((event, i) => (
              <TimelineItem key={i} index={i} isFuture={i === journey.length - 1}>
                <span className="font-mono text-sm tracking-widest text-secondary">
                  {event.year}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-500 sm:text-3xl">
                  {event.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                  {event.description}
                </p>
              </TimelineItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  children,
  index,
  isFuture,
}: {
  children: React.ReactNode;
  index: number;
  isFuture?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: EASE_OUT_EXPO }}
      className="group/item relative"
    >
      {/* node */}
      <span className="absolute top-1.5 -left-10 flex h-6 w-6 items-center justify-center sm:-left-16">
        {/* pulsing halo */}
        <motion.span
          className="absolute h-6 w-6 rounded-full bg-primary/25 blur-sm"
          animate={
            isFuture
              ? { opacity: [0.2, 0.7, 0.15, 0.6, 0.2] }
              : { scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }
          }
          transition={{
            duration: isFuture ? 3 : 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
        <motion.span
          className="relative h-3 w-3 rounded-full border border-primary bg-void"
          animate={isFuture ? { borderColor: ["#6c63ff", "#00e5ff", "#6c63ff"] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="absolute inset-0.5 rounded-full bg-secondary"
            animate={
              isFuture
                ? { opacity: [1, 0.2, 0.9, 0.3, 1] }
                : { boxShadow: ["0 0 0px #00e5ff", "0 0 8px #00e5ff", "0 0 0px #00e5ff"] }
            }
            transition={{ duration: isFuture ? 2.4 : 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </span>
      {children}
    </motion.div>
  );
}
