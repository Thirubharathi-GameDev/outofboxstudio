"use client";

import { motion } from "framer-motion";
import { process } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { EASE_OUT_EXPO } from "@/lib/utils";

export function Process() {
  return (
    <section id="process" className="relative px-4 py-24 sm:px-6 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Development Process"
          title="From a spark to a world."
          intro="Six stages, endlessly looping. Nothing ships until it earns its place."
        />

        <div className="relative mt-16">
          {/* animated blueprint grid behind the pipeline */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-6 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
            }}
            animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          <RevealGroup
            className="relative grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.09}
          >
            {process.map((step) => (
              <Step key={step.index} index={step.index} title={step.title} desc={step.description} />
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <motion.div
      variants={variants}
      className="group relative overflow-hidden bg-card p-8 transition-colors duration-500 hover:bg-surface sm:p-10"
    >
      {/* pipeline connector glow line */}
      <span className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-700 group-hover:w-full" />

      {/* blueprint → artwork reveal on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.25) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(60% 60% at 80% 20%, black, transparent)",
          WebkitMaskImage: "radial-gradient(60% 60% at 80% 20%, black, transparent)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 scale-50 rounded-full opacity-0 blur-2xl transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(108,99,255,0.5), transparent 65%)" }}
      />

      <span className="relative font-mono text-sm tracking-widest text-primary/70">
        {index}
      </span>
      <h3 className="relative mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted">{desc}</p>

      {/* drifting index watermark */}
      <span className="pointer-events-none absolute -right-4 -bottom-6 font-display text-8xl font-bold text-white/[0.03] transition-transform duration-700 group-hover:-translate-y-2">
        {index}
      </span>
    </motion.div>
  );
}
