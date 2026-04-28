import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

/* ---------- Section / page header ---------- */

export function Section({
  children,
  className,
  bg = "default",
}: {
  children: ReactNode;
  className?: string;
  bg?: "default" | "cream" | "mint" | "dark" | "primary";
}) {
  const bgs: Record<string, string> = {
    default: "bg-white",
    cream: "bg-cream",
    mint: "bg-mint",
    dark: "bg-charcoal text-white",
    primary: "bg-grad-primary-deep text-white",
  };
  return <section className={cn("section", bgs[bg], className)}>{children}</section>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow eyebrow-dot", className)}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h1 className="text-h1 font-extrabold text-balance leading-[1.1]">{title}</h1>
        {subtitle && <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-textgray text-pretty">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">{actions}</div>}
    </div>
  );
}

/* ---------- KPI / stat cards ---------- */

export function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  variant = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  variant?: "default" | "primary" | "gold" | "dark";
}) {
  const card =
    variant === "primary"
      ? "card-primary"
      : variant === "gold"
      ? "card-gold"
      : variant === "dark"
      ? "card-dark"
      : "card";
  const iconWrap =
    variant === "default"
      ? "bg-mint text-primary"
      : "bg-white/15 text-white";
  return (
    <div className={cn(card, "relative p-3.5 sm:p-5 overflow-hidden")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={cn("text-[11px] font-bold uppercase tracking-widest", variant === "default" ? "text-textgray" : "text-white/70")}>
            {label}
          </div>
          <div className={cn("mt-2 sm:mt-3 font-display text-2xl sm:text-3xl font-extrabold tabular-nums leading-none", variant === "default" ? "text-charcoal" : "")}>
            {value}
          </div>
          {sub && (
            <div className={cn("mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium", variant === "default" ? "text-textgray" : "text-white/70")}>{sub}</div>
          )}
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconWrap)}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
            trend.direction === "up"
              ? variant === "default"
                ? "bg-success-50 text-success"
                : "bg-white/15 text-white"
              : trend.direction === "down"
              ? variant === "default"
                ? "bg-error-50 text-error"
                : "bg-white/15 text-white"
              : "bg-charcoal/10 text-charcoal"
          )}
        >
          {trend.direction === "up" ? <ArrowUpRight size={12} /> : trend.direction === "down" ? <ArrowDownRight size={12} /> : null}
          {trend.value}
        </div>
      )}
      {variant !== "default" && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      )}
    </div>
  );
}

/* ---------- Status pill ---------- */

export function StatusPill({
  status,
  label,
}: {
  status: "success" | "pending" | "error" | "info" | "neutral" | "warning" | "default";
  label?: string;
}) {
  const map = {
    success: { cls: "bg-success-50 text-success", dot: "bg-success" },
    pending: { cls: "bg-warning-50 text-warning", dot: "bg-warning" },
    warning: { cls: "bg-warning-50 text-warning", dot: "bg-warning" },
    default: { cls: "bg-charcoal/8 text-charcoal", dot: "bg-charcoal" },
    error: { cls: "bg-error-50 text-error", dot: "bg-error" },
    info: { cls: "bg-info-50 text-info", dot: "bg-info" },
    neutral: { cls: "bg-charcoal/8 text-charcoal", dot: "bg-charcoal" },
  };
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", m.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {label ?? status}
    </span>
  );
}

/* ---------- Empty state ---------- */

export function Empty({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  cta?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 p-12 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-primary">
          <Icon size={22} />
        </div>
      )}
      <div className="text-h3 font-bold">{title}</div>
      {body && <p className="max-w-md text-sm text-textgray">{body}</p>}
      {cta}
    </div>
  );
}

/* ---------- Avatar ---------- */

export function Avatar({ letters, name, size = 36, tone = "primary" }: { letters?: string; name?: string; size?: number; tone?: "primary" | "gold" | "dark" }) {
  const tones = {
    primary: "bg-mint text-primary",
    gold: "bg-accent-50 text-accent-600",
    dark: "bg-charcoal text-white",
  };
  const initials = letters ?? (name
    ? name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
    : "?");
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-display font-extrabold", tones[tone])}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
