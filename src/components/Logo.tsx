import { cn } from "@/lib/cn";

interface LogoProps {
  variant?: "default" | "white" | "compact";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  const wordmarkColor =
    variant === "white" ? "text-white" : "text-charcoal";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {variant !== "compact" && (
        <span className={cn("font-display text-xl font-extrabold tracking-tight", wordmarkColor)}>
          recovang
        </span>
      )}
    </div>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Recovang"
    >
      <rect width="64" height="64" rx="14" fill="#1A6B3C" />
      <path
        d="M44 22 a14 14 0 1 0 4 16"
        stroke="#D4A017"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48 38 l-2 -7 l-7 2"
        stroke="#D4A017"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="32"
        y="42"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontSize="24"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
      >
        ₦
      </text>
    </svg>
  );
}
