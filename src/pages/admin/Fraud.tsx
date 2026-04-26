import { AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const ALERTS = [
  { id: "FR-118", who: "Yusuf Olamide", hub: "Wuse Zone 5", reason: "Same QR scanned 3x in 30 min", severity: "High", value: 12_400 },
  { id: "FR-117", who: "Chika Eze", hub: "Surulere Hub", reason: "Weight ↑ 38% vs photo estimate", severity: "Medium", value: 4_800 },
  { id: "FR-116", who: "Hub: Karu", hub: "Karu Hub", reason: "Bulk submission outside open hours", severity: "Medium", value: 18_200 },
  { id: "FR-115", who: "Tope M.", hub: "Yaba Centre", reason: "Mismatched material vs photo (mixed paper claimed as PET)", severity: "Low", value: 1_200 },
];

export default function AdminFraud() {
  return (
    <>
      <PageHeader title="Fraud review" subtitle="Review flagged submissions and take action — approve, suspend or escalate." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard tone="green" label="False positive rate" value="3.2%" delta="↓ 0.4 pts WoW" />
        <StatCard tone="gold" label="Open alerts" value="9" delta="2 high · 4 med · 3 low" icon={<ShieldAlert size={18} />} />
        <StatCard label="Saved (30d)" value={formatNaira(2_840_000)} delta="payouts blocked" />
      </div>
      <Section>
        <div className="space-y-3">
          {ALERTS.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-bordergray bg-white p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error/10 text-error">
                <AlertTriangle size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-display font-bold">{a.who}</span>
                  <span className="text-textgray">·</span>
                  <span>{a.hub}</span>
                  <span className={`badge ${a.severity === "High" ? "bg-error/10 text-error" : a.severity === "Medium" ? "bg-warning/10 text-warning" : "bg-mint text-primary"}`}>
                    {a.severity}
                  </span>
                </div>
                <div className="mt-1 text-xs text-textgray">
                  <span className="font-mono">{a.id}</span> · {a.reason}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-xs text-textgray">Disputed value</div>
                <div className="font-mono font-bold">{formatNaira(a.value)}</div>
              </div>
              <button className="btn-outline text-error border-error/40"><X size={14} /> Reject</button>
              <button className="btn-primary"><CheckCircle2 size={14} /> Approve</button>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
