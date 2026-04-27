import { cn } from "@/lib/cn";

interface LogoProps {
  variant?: "default" | "white" | "compact";
  className?: string;
  size?: number;
}

export function Logo({ variant = "default", className, size = 30 }: LogoProps) {
  const wordColor = variant === "white" ? "text-white" : "text-charcoal";
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {variant !== "compact" && (
        <span className={cn("font-display text-[19px] font-extrabold tracking-tight leading-none", wordColor)}>
          recovang<span className="text-accent">.</span>
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
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Recovang"
    >
      <defs>
        <linearGradient id="rg-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1F7A45" />
          <stop offset="1" stopColor="#0E4424" />
        </linearGradient>
        <linearGradient id="rg-gold" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0CB55" />
          <stop offset="1" stopColor="#B5870E" />
        </linearGradient>
      </defs>
      {/* Rounded square */}
      <rect width="40" height="40" rx="11" fill="url(#rg-bg)" />
      {/* Subtle inner ring */}
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" stroke="white" strokeOpacity="0.08" />
      {/* Curved arrow forming an R-loop */}
      <path
        d="M11 27V14a3 3 0 0 1 3-3h7.5a5.5 5.5 0 0 1 0 11H17"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow head */}
      <path
        d="M19.5 19.5L17 22l2.5 2.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Gold naira coin */}
      <circle cx="27.5" cy="27.5" r="5.2" fill="url(#rg-gold)" />
      <path
        d="M25.2 25.4v4.2M29.8 25.4v4.2M24.6 26.6h5.8M24.6 28.4h5.8"
        stroke="#1C1C2E"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
