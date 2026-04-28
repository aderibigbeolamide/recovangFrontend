import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNaira(value: number | undefined | null, opts: { compact?: boolean; decimals?: number } = {}) {
  const val = value ?? 0;
  const { compact, decimals = 0 } = opts;
  if (compact) {
    if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `₦${(val / 1_000).toFixed(1)}K`;
  }
  return `₦${val.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatKg(value: number | undefined | null, opts: { compact?: boolean } = {}) {
  const val = value ?? 0;
  if (opts.compact && val >= 1000) return `${(val / 1000).toFixed(1)}t`;
  return `${val.toLocaleString("en-NG", { maximumFractionDigits: 1 })} kg`;
}

export function formatNumber(value: number | undefined | null, opts: { compact?: boolean } = {}) {
  const val = value ?? 0;
  if (opts.compact) {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  }
  return val.toLocaleString("en-NG");
}

