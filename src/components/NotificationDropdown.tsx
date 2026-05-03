import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useCollector";
import { Link } from "react-router-dom";

export function NotificationDropdown({ size = "md" }: { size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const toneMap: Record<string, string> = {
    info: "bg-info-50 text-info",
    success: "bg-success-50 text-success",
    warning: "bg-warning-50 text-warning",
    error: "bg-error-50 text-error",
    system: "bg-mint text-primary",
  };

  function formatTime(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  }

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
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-charcoal">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm origin-top-right overflow-hidden rounded-2xl border border-bordergray bg-white shadow-lift animate-slideUp">
          <div className="flex items-center justify-between border-b border-bordergray px-4 py-3">
            <div>
              <div className="text-sm font-extrabold text-charcoal">Notifications</div>
              <div className="text-[11px] text-textgray">{unreadCount} unread</div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-mint/80 disabled:opacity-50"
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] divide-y divide-bordergray overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-10 text-center text-sm text-textgray">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-textgray">You're all caught up.</div>
            ) : (
              notifications.slice(0, 5).map((n: any) => (
                <button
                  key={n.id}
                  onClick={() => !n.isRead && markRead.mutate(n.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-cream/60",
                    !n.isRead && "bg-mint/15"
                  )}
                >
                  <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", toneMap[n.type] || toneMap.info)}>
                    <Bell size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-extrabold text-charcoal truncate">{n.title}</div>
                      {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    </div>
                    <div className="line-clamp-2 text-xs text-textgray">{n.message}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-textgray/80">{formatTime(n.createdAt || new Date())}</div>
                  </div>
                  {n.isRead && <Check size={14} className="text-success shrink-0" />}
                </button>
              ))
            )}
          </div>
          <div className="border-t border-bordergray bg-cream/50 px-4 py-2.5 text-center">
            <Link to="/collector/notifications" onClick={() => setOpen(false)} className="text-xs font-bold text-primary hover:text-primary-700">View all notifications</Link>
          </div>
        </div>
      )}
    </div>
  );
}
