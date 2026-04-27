import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  tone?: "info" | "success" | "warning" | "error";
}

const DEFAULT_NOTIFS: AppNotification[] = [
  { id: "n1", title: "Drop verified", body: "Your drop #2419 (PET, 4.2kg) was verified at Surulere Hub.", time: "2 min ago", unread: true, tone: "success" },
  { id: "n2", title: "Payment sent", body: "₦12,400 paid into your Access Bank account.", time: "1 hr ago", unread: true, tone: "success" },
  { id: "n3", title: "Streak alert", body: "3 days to lose your 14-day streak. Drop today for +₦500 bonus.", time: "Yesterday", unread: true, tone: "warning" },
  { id: "n4", title: "New leaderboard rank", body: "You moved up to #14 in Lagos this week.", time: "2 days ago", tone: "info" },
];

export function NotificationDropdown({ size = "md" }: { size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>(DEFAULT_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = notifs.filter((n) => n.unread).length;

  function markAll() {
    setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
  }
  function markOne(id: string) {
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  const toneMap: Record<string, string> = {
    info: "bg-info-50 text-info",
    success: "bg-success-50 text-success",
    warning: "bg-warning-50 text-warning",
    error: "bg-error-50 text-error",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className={cn(
          "relative grid place-items-center rounded-xl border border-bordergray bg-white text-charcoal hover:border-charcoal/30",
          size === "md" ? "h-10 w-10" : "h-9 w-9"
        )}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-charcoal">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-bordergray bg-white shadow-lift sm:w-96 animate-slideUp">
          <div className="flex items-center justify-between border-b border-bordergray px-4 py-3">
            <div>
              <div className="text-sm font-extrabold text-charcoal">Notifications</div>
              <div className="text-[11px] text-textgray">{unread} unread</div>
            </div>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-mint/80"
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] divide-y divide-bordergray overflow-y-auto">
            {notifs.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-textgray">You're all caught up.</div>
            )}
            {notifs.map((n) => (
              <button
                key={n.id}
                onClick={() => markOne(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-cream/60",
                  n.unread && "bg-mint/30"
                )}
              >
                <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", toneMap[n.tone ?? "info"])}>
                  <Bell size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-extrabold text-charcoal">{n.title}</div>
                    {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </div>
                  <div className="line-clamp-2 text-xs text-textgray">{n.body}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-textgray/80">{n.time}</div>
                </div>
                {!n.unread && <Check size={14} className="text-success shrink-0" />}
              </button>
            ))}
          </div>
          <div className="border-t border-bordergray bg-cream/50 px-4 py-2.5 text-center">
            <button className="text-xs font-bold text-primary hover:text-primary-700">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}
