import { AlertTriangle, Plus } from "lucide-react";
import { PageHeader, Section, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const ROWS = [
  { id: "DISP-019", date: "Apr 22", submission: "RX-2381", reason: "Weight reads 2 kg less than I dropped", agent: "Bola A.", amount: 200, status: "pending" as const },
  { id: "DISP-014", date: "Apr 11", submission: "RX-2179", reason: "E-waste classified as mixed paper", agent: "Bola A.", amount: 480, status: "pending" as const },
  { id: "DISP-008", date: "Apr 03", submission: "RX-2056", reason: "Photo upload failed — reweigh requested", agent: "Tunde O.", amount: 0, status: "verified" as const },
];

export default function CollectorDisputes() {
  return (
    <>
      <PageHeader
        title="Disputes"
        subtitle="Raise a dispute on any verified weight or category. Our team reviews within 24 working hours."
        action={<button className="btn-primary"><Plus size={16} /> New dispute</button>}
      />
      <Section>
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr>
                <th className="px-4 py-3">Dispute</th>
                <th className="px-4 py-3">Submission</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3 text-right">Disputed value</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {ROWS.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono">
                    <span className="inline-flex items-center gap-2">
                      <AlertTriangle size={14} className="text-warning" /> {r.id}
                    </span>
                    <div className="text-xs text-textgray">{r.date}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{r.submission}</td>
                  <td className="px-4 py-3">{r.reason}</td>
                  <td className="px-4 py-3 text-textgray">{r.agent}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{r.amount ? formatNaira(r.amount) : "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
