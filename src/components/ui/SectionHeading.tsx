import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { TextReveal } from "./TextReveal";

/** Consistent eyebrow + title + optional intro block used across sections. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal direction="up" blur={false}>
        <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.35em] text-secondary uppercase">
          <span className="h-px w-8 bg-secondary/50" />
          {eyebrow}
        </span>
      </Reveal>

      <TextReveal
        as="h2"
        text={title}
        className="max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      />

      {intro && (
        <Reveal direction="up" delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
