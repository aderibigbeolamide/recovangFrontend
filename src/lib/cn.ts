import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

export function formatKg(weight: number): string {
  return `${weight.toLocaleString("en-NG", { maximumFractionDigits: 1 })} kg`;
}
