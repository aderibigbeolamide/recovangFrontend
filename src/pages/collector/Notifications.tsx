import { useState } from "react";
import { Award, BadgeCheck, Bell, CheckCheck, Coins, FileWarning, Filter, Flame, Gift, Inbox, MessageSquare, Sparkles, Trash2, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui";

const ITEMS = [
  { id: 1, type: "earning", title: "Drop verified — ₦840 credited", body: "Your 4.2kg PET drop at Surulere Hub was verified by Bola A. Wallet credited.", time: "2 hours ago", unread: true, icon: Coins, color: "bg-success-50 text-success" },
  { id: 2, type: "system", title: "New milestone unlocked", body: "You're now in the Top 100 in Lagos for April. Keep dropping to stay there!", time: "5 hours ago", unread: true, icon: Award, color: "bg-grad-gold text-charcoal" },
  { id: 3, type: "system", title: "Streak in danger", body: "Your 14-day streak ends in 2d 14h. Drop something today to keep it going.", time: "8 hours ago", unread: true, icon: Flame, color: "bg-error-50 text-error" },
  { id: 4, type: "wallet", title: "Withdrawal successful", body: "₦10,000 sent to GTBank ****8821. Transaction WD-2026-04-3219.", time: "Yesterday · 18:02", unread: false, icon: Wallet, color: "bg-cream text-charcoal" },
  { id: 5, type: "promo", title: "Referral promo running", body: "Invite 10 friends in April for a ₦5,000 bonus. You're at 14 — bonus already claimed!", time: "Yesterday · 09:00", unread: false, icon: Gift, color: "bg-mint text-primary" },
  { id: 6, type: "dispute", title: "Dispute DSP-1042 update", body: "Our ops team replied. Expect a final decision by tomorrow.", time: "2 days ago", unread: false, icon: FileWarning, color: "bg-warning-50 text-warning" },
  { id: 7, type: "system", title: "Pricing update for Lagos", body: "PET plastic rate raised to ₦200/kg this week. Aluminium also bumped to ₦600.", time: "2 days ago", unread: false, icon: Sparkles, color: "bg-mint text-primary" },
  { id: 8, type: "earning", title: "Streak bonus credited", body: "+₦500 streak bonus for hitting your 14-day milestone.", time: "3 days ago", unread: false, icon: Coins, color: "bg-success-50 text-success" },
  { id: 9, type: "system", title: "App updated", body: "New version (v2.4.1) is live. Faster wallet sync and offline drop support improved.", time: "1 week ago", unread: false, icon: Bell, color: "bg-cream text-charcoal" },
];

const TABS = [
  { id: "all", label: "All", icon: Inbox },
  { id: "earning", label: "Earnings", icon: Coins },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "system", label: "System", icon: Bell },
  { id: "dispute", label: "Disputes", icon: FileWarning },
  { id: "promo", label: "Promotions", icon: Gift },
];

export default function CollectorNotifications() {
  const [tab, setTab] = useState("all");
  const filtered = ITEMS.filter((i) => tab === "all" || i.type === tab);
  const unread = ITEMS.filter((i) => i.unread).length;

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title={`Inbox · ${unread} unread`}
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
          {filtered.map((it) => (
            <div key={it.id} className={`flex gap-4 p-5 transition hover:bg-cream/40 ${it.unread ? "bg-mint/15" : ""}`}>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${it.color}`}>
                <it.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-charcoal">{it.title}</span>
                  {it.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm text-textgray">{it.body}</p>
                <div className="mt-2 text-[11px] text-textgray">{it.time}</div>
              </div>
              <button className="btn-ghost btn-sm self-start"><MessageSquare size={12} /> Action</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
