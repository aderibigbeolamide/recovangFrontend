import { PageHeader, Section, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { Filter, Search } from "lucide-react";

const ROWS = [
  { id: "RX-2419", date: "Apr 24, 2026", hub: "Surulere Hub", agent: "Bola A.", category: "PET Plastic", weight: "4.2 kg", amount: 840, status: "verified" as const },
  { id: "RX-2381", date: "Apr 22, 2026", hub: "Surulere Hub", agent: "Bola A.", category: "Cardboard", weight: "8.0 kg", amount: 480, status: "paid" as const },
  { id: "RX-2350", date: "Apr 19, 2026", hub: "Yaba Centre", agent: "Tunde O.", category: "Aluminium Cans", weight: "1.1 kg", amount: 660, status: "paid" as const },
  { id: "RX-2298", date: "Apr 16, 2026", hub: "Surulere Hub", agent: "Bola A.", category: "Mixed Paper", weight: "5.6 kg", amount: 280, status: "paid" as const },
  { id: "RX-2241", date: "Apr 13, 2026", hub: "Lekki Hub", agent: "Femi K.", category: "PET Plastic", weight: "3.2 kg", amount: 640, status: "paid" as const },
  { id: "RX-2179", date: "Apr 11, 2026", hub: "Surulere Hub", agent: "Bola A.", category: "E-Waste", weight: "0.8 kg", amount: 960, status: "pending" as const },
  { id: "RX-2104", date: "Apr 08, 2026", hub: "Yaba Centre", agent: "Tunde O.", category: "Glass", weight: "12.4 kg", amount: 496, status: "rejected" as const },
];

export default function CollectorHistory() {
  return (
    <>
      <PageHeader
        title="Submission history"
        subtitle="Every drop, every weigh-in, every payout — fully traceable."
      />
      <Section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-9" placeholder="Search by ID, hub or material..." />
          </div>
          <button className="btn-outline"><Filter size={14} /> Filter</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Hub</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3 text-right">Weight</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {ROWS.map((r) => (
                <tr key={r.id} className="hover:bg-mint/40">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 text-textgray">{r.date}</td>
                  <td className="px-4 py-3 font-semibold">{r.hub}</td>
                  <td className="px-4 py-3 text-textgray">{r.agent}</td>
                  <td className="px-4 py-3">{r.category}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.weight}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{formatNaira(r.amount)}</td>
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
