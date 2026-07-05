"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-4 py-32 sm:px-6 lg:py-48">
      {/* focal glow */}
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(108,99,255,0.18), transparent 60%)" }}
        animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal blur={false}>
          <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.35em] text-secondary uppercase">
            <span className="h-px w-8 bg-secondary/50" />
            Get in touch
          </span>
        </Reveal>

        <div className="mt-8 font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-7xl lg:text-8xl">
          <TextReveal as="span" text="Let's build a" className="block text-ink" />
          <TextReveal as="span" text="world together." className="block text-gradient" delay={0.1} />
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Press, publishing, collaboration or you just want to say hello — the
            door is always open.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticButton
              href="mailto:hello@outofbox.studio"
              variant="primary"
              cursorLabel="Email"
            >
              hello@outofbox.studio
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#games" variant="secondary" cursorLabel="Back">
              Explore Games
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
