import { Bell, CheckCircle2, Coins, AlertTriangle, Award } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const NOTIFS = [
  { icon: <Coins size={16} />, color: "text-success", title: "Payout received", body: `${formatNaira(840)} for RX-2419 (PET Plastic, 4.2 kg)`, time: "2 min ago", unread: true },
  { icon: <CheckCircle2 size={16} />, color: "text-primary", title: "Submission verified", body: "Bola A. verified your drop at Surulere Hub.", time: "12 min ago", unread: true },
  { icon: <Award size={16} />, color: "text-accent", title: "New badge unlocked", body: "Streak Master · +300 XP", time: "1 hr ago", unread: true },
  { icon: <AlertTriangle size={16} />, color: "text-warning", title: "Dispute update", body: "DISP-019 is under review by the Recovang team.", time: "Yesterday", unread: false },
  { icon: <Bell size={16} />, color: "text-textgray", title: "Hub change", body: "Surulere Hub now closes at 7pm on Saturdays.", time: "2 days ago", unread: false },
];

export default function CollectorNotifications() {
  return (
    <>
      <PageHeader title="Notifications" subtitle="Real-time alerts on payouts, verifications, badges and disputes." action={<button className="btn-outline">Mark all as read</button>} />
      <Section>
        <div className="divide-y divide-bordergray">
          {NOTIFS.map((n, i) => (
            <div key={i} className={`flex gap-3 py-4 ${n.unread ? "" : "opacity-70"}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint ${n.color}`}>{n.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display font-bold">{n.title}</p>
                  <span className="text-xs text-textgray">{n.time}</span>
                </div>
                <p className="text-sm text-textgray">{n.body}</p>
              </div>
              {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
