"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CharReveal } from "@/components/ui/CharReveal";
import { useLoading } from "@/components/experience/LoadingContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/utils";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 50% at 70% 30%, rgba(174,185,255,0.18), transparent 60%), radial-gradient(50% 40% at 30% 70%, rgba(0,229,255,0.10), transparent 60%)",
      }}
    />
  );
}

export function Hero() {
  const { isLoading } = useLoading();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // orchestrate reveal once the loader is gone
  const show = !isLoading;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D backdrop with slow scale/parallax on scroll + perpetual slow zoom */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        >
          {reduced ? <SceneFallback /> : <HeroScene />}
        </motion.div>
        {/* readability veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />
      </motion.div>

      <motion.div
        style={{ y }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center"
      >
        {/* crisp depth halo behind the title (no haze) */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108,99,255,0.16), rgba(0,229,255,0.05) 45%, transparent 70%)",
            }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate={show ? "visible" : "hidden"}
          className="flex flex-col items-center"
        >
          <motion.span
            variants={item}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] tracking-[0.3em] text-secondary uppercase backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
            Independent Game Studio
          </motion.span>

          <h1 className="font-display text-[15vw] leading-[0.92] font-bold tracking-tight sm:text-7xl lg:text-8xl xl:text-[9rem]">
            <CharReveal
              text="OUT OF BOX"
              trigger="mount"
              play={show}
              delay={0.35}
              gradient
              className="block"
            />
            <CharReveal
              text="STUDIO"
              trigger="mount"
              play={show}
              delay={0.7}
              className="block text-ink"
            />
          </h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            Creating Worlds Beyond Reality.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
          >
            <MagneticButton href="#games" variant="primary" cursorLabel="View">
              Explore Our Games
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#journey" variant="secondary" cursorLabel="Scroll">
              <Compass size={16} />
              Our Journey
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.a
        href="#featured"
        aria-label="Scroll to explore"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        data-cursor="hover"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-line pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-secondary"
            animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ChevronDown size={14} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
