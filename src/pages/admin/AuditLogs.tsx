import { Filter, Search } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";

const LOGS = [
  { ts: "2026-04-26 14:32:18", actor: "admin@recovang.com", action: "PRICE_UPDATE", target: "PET Plastic", note: "₦180 → ₦200/kg" },
  { ts: "2026-04-26 13:14:02", actor: "bola@hub.recovang", action: "SUBMISSION_VERIFY", target: "RX-2419", note: "4.2 kg @ ₦200 = ₦840" },
  { ts: "2026-04-26 12:48:55", actor: "admin@recovang.com", action: "USER_SUSPEND", target: "user_4192 (Yusuf O.)", note: "Fraud investigation FR-118" },
  { ts: "2026-04-26 12:11:39", actor: "kunle@logistics.ng", action: "PICKUP_ACCEPT", target: "PU-481", note: "Surulere Hub → Sunshine PET" },
  { ts: "2026-04-26 11:02:21", actor: "system", action: "PAYOUT_BATCH", target: "8,200 collectors", note: "₦8,400,000 disbursed" },
  { ts: "2026-04-26 09:48:14", actor: "admin@recovang.com", action: "HUB_APPROVE", target: "Karu Roundabout Hub", note: "Tier C · 200 kg/day" },
];

export default function AdminAuditLogs() {
  return (
    <>
      <PageHeader title="Audit logs" subtitle="Complete, immutable history of every admin and system action." />
      <Section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-9" placeholder="Search by actor, action or target..." />
          </div>
          <button className="btn-outline"><Filter size={14} /> Filter</button>
          <button className="btn-outline">Export CSV</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Notes</th></tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {LOGS.map((l, i) => (
                <tr key={i} className="hover:bg-mint/40">
                  <td className="px-4 py-3 font-mono text-xs text-textgray">{l.ts}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.actor}</td>
                  <td className="px-4 py-3"><span className="badge bg-mint text-primary">{l.action}</span></td>
                  <td className="px-4 py-3 font-mono text-xs">{l.target}</td>
                  <td className="px-4 py-3 text-textgray">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
