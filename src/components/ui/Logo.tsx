import { cn } from "@/lib/utils";

/** Studio wordmark + escaping-box glyph. */
export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" className="h-8 w-8">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6c63ff" />
              <stop offset="100%" stopColor="#00e5ff" />
            </linearGradient>
          </defs>
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="16"
            stroke="url(#logoGrad)"
            strokeWidth="6"
          />
          <path
            d="M34 66 L50 34 L66 66"
            stroke="url(#logoGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-sm font-semibold tracking-[0.18em] text-ink uppercase">
          Out Of Box
        </span>
      )}
    </span>
  );
}
