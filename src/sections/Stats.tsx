"use client";

import { stats, type Stat } from "@/lib/data";
import { useCountUp } from "@/hooks/useCountUp";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass rounded-[2rem] px-6 py-14 sm:px-12">
            <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-5">
              {stats.map((stat) => (
                <StatItem key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  const { value, ref } = useCountUp(stat.value);
  const formatted = value.toLocaleString("en-US");

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group flex flex-col items-center text-center"
    >
      <span className="font-display text-4xl font-bold tracking-tight text-gradient tabular-nums transition-transform duration-500 group-hover:scale-110 sm:text-5xl [text-shadow:0_0_0_transparent] group-hover:[text-shadow:0_0_30px_rgba(108,99,255,0.5)]">
        {stat.prefix}
        {formatted}
        {stat.suffix}
      </span>
      <span className="mt-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase transition-colors duration-500 group-hover:text-secondary">
        {stat.label}
      </span>
    </div>
  );
}
