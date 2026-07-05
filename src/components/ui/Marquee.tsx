import { cn } from "@/lib/utils";

/**
 * Infinite CSS marquee. Duplicates its children once and translates -50% so the
 * loop is seamless. Pure CSS = no JS on the main thread.
 */
export function Marquee({
  items,
  className,
  speed = 40,
  reverse = false,
}: {
  items: string[];
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  const content = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className="flex shrink-0 items-center gap-16 pr-16"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {content.map((item, i) => (
          <span
            key={i}
            className="font-display text-2xl font-semibold tracking-tight text-muted/50 whitespace-nowrap sm:text-4xl"
          >
            {item}
            <span className="ml-16 text-primary/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
