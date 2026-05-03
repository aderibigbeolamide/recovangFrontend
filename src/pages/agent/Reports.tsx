import { ArrowDown, ArrowUp, Calendar, Download, FileText, Filter, Printer, Search } from "lucide-react";
import { KPICard, PageHeader } from "@/components/ui";
import { AreaChart, BarChart, Donut } from "@/components/charts";
import { formatNaira } from "@/lib/cn";
import { Coins, Package, Recycle, Users } from "lucide-react";

import { useAgentReports } from "@/hooks/useAgent";

export default function AgentReports() {
  const { data, isLoading } = useAgentReports();

  if (isLoading) return <div className="p-20 text-center font-bold">Loading reports...</div>;

  const ROWS = data?.ledger || [];
  const stats = data?.summary || { drops: 0, volume: 0, payouts: 0, commission: 0 };

  const WEEKLY = ROWS.slice(0, 7).reverse().map((r: any) => ({
    label: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: r.volume
  }));
  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Hub performance reports"
        subtitle="Daily, weekly and monthly numbers. Export as PDF or CSV. Print-ready for LAWMA submission."
        actions={
          <>
            <button className="btn-outline"><Printer size={14} /> Print</button>
            <button className="btn-outline"><Download size={14} /> Export PDF</button>
            <button className="btn-primary"><Download size={14} /> Export CSV</button>
          </>
        }
      />

      <div className="card mb-6 flex flex-wrap items-center gap-3 p-4">
        <button className="btn-outline btn-sm"><Calendar size={13} /> Apr 18 – Apr 24</button>
        <button className="btn-outline btn-sm"><Filter size={13} /> All materials</button>
        <div className="flex-1" />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
          <input className="input h-9 pl-9 text-sm" placeholder="Search drops or collectors" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Drops this period" value={stats.drops} sub="Total verified drops" icon={Package} variant="primary" />
        <KPICard label="KG recovered" value={`${Math.round(stats.volume)} kg`} sub={`${(stats.volume / 1000).toFixed(2)} tonnes`} icon={Recycle} />
        <KPICard label="Paid to collectors" value={formatNaira(stats.payouts)} sub={`Avg ${formatNaira(stats.drops > 0 ? stats.payouts / stats.drops : 0)}/drop`} icon={Coins} variant="gold" />
        <KPICard label="Hub commission" value={formatNaira(stats.commission)} sub="6% of payouts" icon={Users} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-h4">Daily intake (kg)</h3>
              <p className="text-sm text-textgray">Last 7 days</p>
            </div>
            <span className="badge-success">+ 14%</span>
          </div>
          <div className="mt-5">
            <BarChart data={WEEKLY} height={220} barColor="#1A6B3C" />
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix</h3>
          <p className="mb-5 text-sm text-textgray">7-day total</p>
          <Donut
            centerValue="4.17 t"
            centerLabel="This week"
            data={[
              { label: "PET Plastic", value: 1620, color: "#1A6B3C" },
              { label: "Cardboard", value: 1180, color: "#D4A017" },
              { label: "Aluminium", value: 624, color: "#3F9264" },
              { label: "Paper", value: 482, color: "#1C1C2E" },
              { label: "Glass", value: 267, color: "#A0A4AB" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Daily ledger</h3>
            <p className="text-sm text-textgray">Verified, totalled and ready for submission</p>
          </div>
          <span className="badge bg-cream text-textgray">7 days</span>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Date</th><th>Drops</th><th>KG recovered</th><th>Paid out</th><th className="text-right">Hub commission</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r: any, i: number) => (
              <tr key={i}>
                <td className="font-bold">{new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="font-mono">{r.drops}</td>
                <td className="font-mono">{Math.round(r.volume)} kg</td>
                <td className="font-mono">{formatNaira(r.payouts)}</td>
                <td className="text-right"><span className="money">{formatNaira(r.commission)}</span></td>
                <td><span className="badge-success">Verified</span></td>
              </tr>
            ))}
            <tr className="bg-cream/50 font-extrabold">
              <td>Total</td>
              <td className="font-mono">{stats.drops}</td>
              <td className="font-mono">{Math.round(stats.volume)} kg</td>
              <td className="font-mono">{formatNaira(stats.payouts)}</td>
              <td className="text-right money text-accent-700">{formatNaira(stats.commission)}</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
