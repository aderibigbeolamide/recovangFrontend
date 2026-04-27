import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNaira(value: number, opts: { compact?: boolean; decimals?: number } = {}) {
  const { compact, decimals = 0 } = opts;
  if (compact) {
    if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  }
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatKg(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && value >= 1000) return `${(value / 1000).toFixed(1)}t`;
  return `${value.toLocaleString("en-NG", { maximumFractionDigits: 1 })} kg`;
}

export function formatNumber(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-NG");
}
