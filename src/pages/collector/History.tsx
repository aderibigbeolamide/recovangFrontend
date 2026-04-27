import { useState } from "react";
import { ArrowDown, Calendar, ChevronDown, Download, Filter, Search } from "lucide-react";
import { PageHeader, StatusPill, KPICard } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";
import { Coins, Recycle, Wallet } from "lucide-react";

const ROWS = [
  { id: "RX-2419", date: "Apr 24, 2026 · 10:42", hub: "Surulere Hub", agent: "Bola A.", cat: "PET Bottles", kg: 4.2, rate: 200, amt: 840, status: "verified" },
  { id: "RX-2402", date: "Apr 22, 2026 · 14:18", hub: "Surulere Hub", agent: "Bola A.", cat: "Cardboard", kg: 8.0, rate: 80, amt: 480, status: "verified" },
  { id: "RX-2391", date: "Apr 19, 2026 · 09:08", hub: "Yaba Centre", agent: "Tope D.", cat: "Aluminium Cans", kg: 1.1, rate: 600, amt: 660, status: "verified" },
  { id: "RX-2378", date: "Apr 16, 2026 · 16:55", hub: "Surulere Hub", agent: "Bola A.", cat: "Mixed Paper", kg: 5.6, rate: 60, amt: 280, status: "verified" },
  { id: "RX-2364", date: "Apr 13, 2026 · 11:21", hub: "Lekki Hub", agent: "Folake A.", cat: "PET Bottles", kg: 3.2, rate: 200, amt: 640, status: "verified" },
  { id: "RX-2347", date: "Apr 10, 2026 · 13:45", hub: "Surulere Hub", agent: "Bola A.", cat: "Glass Bottles", kg: 12.4, rate: 30, amt: 372, status: "verified" },
  { id: "RX-2331", date: "Apr 07, 2026 · 08:32", hub: "Surulere Hub", agent: "Bola A.", cat: "PET Bottles", kg: 6.8, rate: 200, amt: 1360, status: "verified" },
  { id: "RX-2318", date: "Apr 04, 2026 · 17:12", hub: "Yaba Centre", agent: "Tope D.", cat: "Cardboard", kg: 4.0, rate: 80, amt: 320, status: "disputed" },
  { id: "RX-2304", date: "Apr 02, 2026 · 12:38", hub: "Surulere Hub", agent: "Bola A.", cat: "Aluminium Cans", kg: 2.4, rate: 600, amt: 1440, status: "verified" },
  { id: "RX-2289", date: "Mar 30, 2026 · 10:05", hub: "Surulere Hub", agent: "Bola A.", cat: "PET Bottles", kg: 5.0, rate: 200, amt: 1000, status: "verified" },
];

export default function CollectorHistory() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHeader
        eyebrow="History"
        title="All your submissions"
        subtitle="Every drop, photo, agent and naira — searchable, filterable, exportable."
        actions={<><button className="btn-outline"><Download size={14} /> Export CSV</button></>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Total submissions" value="47" sub="across 9 categories" icon={Recycle} />
        <KPICard label="Total recovered" value="218.4 kg" sub="0.22 tonnes lifetime" icon={Recycle} />
        <KPICard label="Total earned" value="₦312,400" sub="Avg ₦6,646/drop" icon={Coins} variant="gold" />
      </div>

      <div className="mt-6 card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-10" placeholder="Search by drop ID, hub, agent…" />
          </div>
          <button className="btn-outline btn-sm"><Filter size={13} /> All categories</button>
          <button className="btn-outline btn-sm"><Calendar size={13} /> Last 30 days</button>
          <button className="btn-outline btn-sm">All statuses <ChevronDown size={12} /></button>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <table className="tbl">
          <thead>
            <tr><th>Drop ID</th><th>Date</th><th>Hub / Agent</th><th>Material</th><th>Weight</th><th>Rate</th><th className="text-right">Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="cursor-pointer" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <td className="font-mono text-xs font-bold text-primary">{r.id}</td>
                <td className="text-textgray">{r.date}</td>
                <td>
                  <div className="font-bold">{r.hub}</div>
                  <div className="text-[11px] text-textgray">{r.agent}</div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={r.cat} size={26} />
                    {r.cat}
                  </div>
                </td>
                <td className="font-mono">{r.kg} kg</td>
                <td className="font-mono text-xs text-textgray">{formatNaira(r.rate)}/kg</td>
                <td className="text-right"><span className="money text-success">+{formatNaira(r.amt)}</span></td>
                <td><StatusPill status={r.status === "verified" ? "success" : r.status === "disputed" ? "error" : "pending"} label={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-bordergray bg-cream/40 px-6 py-4 text-sm">
          <div className="text-textgray">Showing <span className="font-bold text-charcoal">10</span> of 47 submissions</div>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm">Previous</button>
            <button className="btn-outline btn-sm">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}
