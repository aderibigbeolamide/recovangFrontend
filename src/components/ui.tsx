import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-charcoal sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-textgray">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  tone?: "default" | "gold" | "green" | "dark";
  icon?: ReactNode;
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-white border-bordergray text-charcoal",
    gold: "bg-gradient-gold border-transparent text-charcoal shadow-gold",
    green: "bg-gradient-primary border-transparent text-white shadow-glow",
    dark: "bg-gradient-dark border-transparent text-white",
  };
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border p-5", toneClasses[tone])}>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            tone === "default" ? "text-textgray" : "opacity-80"
          )}
        >
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              tone === "default" ? "bg-mint text-primary" : "bg-white/20"
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="font-display text-3xl font-extrabold leading-tight">{value}</div>
      {delta && (
        <div
          className={cn(
            "text-xs font-semibold",
            tone === "default" ? "text-success" : "opacity-80"
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-lg font-bold">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-textgray">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusPill({
  status,
}: {
  status: "verified" | "pending" | "rejected" | "paid" | "in-transit" | "completed";
}) {
  const map: Record<string, string> = {
    verified: "bg-success/10 text-success",
    paid: "bg-success/10 text-success",
    completed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    "in-transit": "bg-warning/10 text-warning",
    rejected: "bg-error/10 text-error",
  };
  return (
    <span className={cn("badge", map[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace("-", " ")}
    </span>
  );
}

export function Empty({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-bordergray bg-white p-10 text-center">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-primary">
          {icon}
        </div>
      )}
      <h4 className="font-display text-lg font-bold text-charcoal">{title}</h4>
      {description && <p className="mt-1 max-w-md text-sm text-textgray">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
