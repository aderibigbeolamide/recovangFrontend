import { useState } from "react";
import { Award, BadgeCheck, Bell, CheckCheck, Coins, FileWarning, Filter, Flame, Gift, Inbox, MessageSquare, Sparkles, Trash2, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useNotifications } from "@/hooks/useCollector";
import { NotificationDrawer } from "@/components/NotificationDrawer";

const TYPE_MAP: any = {
  earning: { icon: Coins, color: "bg-success-50 text-success" },
  system: { icon: Bell, color: "bg-mint text-primary" },
  wallet: { icon: Wallet, color: "bg-cream text-charcoal" },
  dispute: { icon: FileWarning, color: "bg-warning-50 text-warning" },
  promo: { icon: Gift, color: "bg-mint text-primary" },
};

export default function CollectorNotifications() {
  const { data, isLoading } = useNotifications();
  const [tab, setTab] = useState("all");
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  
  const notifications = data || [];
  const filtered = notifications.filter((i: any) => tab === "all" || i.type === tab);
  const unreadCount = notifications.filter((i: any) => !i.isRead).length;

  if (isLoading) return <div className="p-20 text-center font-bold">Loading notifications...</div>;

  const TABS = [
    { id: "all", label: "All", icon: Inbox },
    { id: "earning", label: "Earnings", icon: Coins },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "system", label: "System", icon: Bell },
  ];

  function formatTime(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-NG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title={`Inbox · ${unreadCount} unread`}
        subtitle="Earnings, withdrawals, milestones, disputes — all in one place."
        actions={
          <>
            <button className="btn-outline"><CheckCheck size={14} /> Mark all read</button>
            <button className="btn-ghost"><Trash2 size={14} /> Clear</button>
          </>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-bordergray bg-cream/40 p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                tab === t.id ? "bg-charcoal text-white shadow-soft" : "text-textgray hover:bg-white"
              }`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-bordergray">
          {filtered.length === 0 && (
            <div className="grid place-items-center py-20 text-textgray">
              <Inbox size={32} className="mb-2 opacity-40" />
              <p className="text-sm">Nothing to see here</p>
            </div>
          )}
          {filtered.map((it: any) => {
            const config = TYPE_MAP[it.type] || TYPE_MAP.system;
            const Icon = config.icon;
            return (
              <div key={it.id} className={`flex gap-4 p-5 transition hover:bg-cream/40 ${!it.isRead ? "bg-mint/15" : ""}`}>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${config.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-charcoal">{it.title}</span>
                    {!it.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1 text-sm text-textgray">{it.message}</p>
                  <div className="mt-2 text-[11px] text-textgray">{formatTime(it.createdAt)}</div>
                </div>
                <button 
                  onClick={() => setSelectedNotif(it)}
                  className="btn-ghost btn-sm self-start"
                >
                  <MessageSquare size={12} /> View
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <NotificationDrawer 
        notification={selectedNotif} 
        onClose={() => setSelectedNotif(null)} 
      />
    </>
  );
}
