import { cn } from "@/lib/utils";

/**
 * Procedurally-rendered cinematic "key art". Instead of shipping heavy image
 * assets, each piece is composed from layered gradients, a horizon glow, drifting
 * light streaks and a scanline grain — giving every game/section a distinct,
 * atmospheric poster that stays crisp at any size and costs almost nothing.
 */
export function Artwork({
  palette,
  seed = 0,
  className,
  label,
}: {
  palette: [string, string];
  seed?: number;
  className?: string;
  label?: string;
}) {
  const [accent, deep] = palette;
  const angle = 120 + seed * 37;
  const orbX = 20 + ((seed * 27) % 60);
  const orbY = 15 + ((seed * 19) % 40);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        className,
      )}
      style={{ backgroundColor: deep }}
    >
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, ${deep} 0%, ${accent}22 55%, ${deep} 100%)`,
        }}
      />
      {/* horizon glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 55% at ${orbX}% ${orbY}%, ${accent}66, transparent 60%)`,
        }}
      />
      {/* distant sun/moon */}
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: "40%",
          paddingBottom: "40%",
          height: 0,
          left: `${orbX}%`,
          top: `${orbY}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${accent}, transparent 65%)`,
        }}
      />
      {/* light streaks */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle + 40}deg, transparent 0 26px, ${accent}10 26px 27px)`,
        }}
      />
      {/* bottom fade to card */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: `linear-gradient(to top, ${deep}, transparent)`,
        }}
      />
      {/* grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {label && (
        <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
