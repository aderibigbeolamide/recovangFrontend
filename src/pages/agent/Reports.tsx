import { ArrowDown, ArrowUp, Calendar, Download, FileText, Filter, Printer, Search } from "lucide-react";
import { KPICard, PageHeader } from "@/components/ui";
import { AreaChart, BarChart, Donut } from "@/components/charts";
import { formatNaira } from "@/lib/cn";
import { Coins, Package, Recycle, Users } from "lucide-react";

const ROWS = [
  { date: "Apr 24", drops: 184, kg: 642, paid: 88400, comm: 14820 },
  { date: "Apr 23", drops: 162, kg: 584, paid: 79200, comm: 13280 },
  { date: "Apr 22", drops: 178, kg: 612, paid: 84600, comm: 14180 },
  { date: "Apr 21", drops: 143, kg: 521, paid: 71400, comm: 11960 },
  { date: "Apr 20", drops: 156, kg: 548, paid: 76200, comm: 12780 },
  { date: "Apr 19", drops: 188, kg: 668, paid: 92400, comm: 15490 },
  { date: "Apr 18", drops: 171, kg: 598, paid: 82100, comm: 13760 },
];

const WEEKLY = [
  { label: "Apr 18", value: 598 },
  { label: "Apr 19", value: 668 },
  { label: "Apr 20", value: 548 },
  { label: "Apr 21", value: 521 },
  { label: "Apr 22", value: 612 },
  { label: "Apr 23", value: 584 },
  { label: "Apr 24", value: 642 },
];

export default function AgentReports() {
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
        <KPICard label="Drops this week" value="1,182" sub="+ 14% vs last week" icon={Package} variant="primary" trend={{ value: "+14%", direction: "up" }} />
        <KPICard label="KG recovered" value="4,173 kg" sub="4.17 tonnes" icon={Recycle} />
        <KPICard label="Paid to collectors" value={formatNaira(574400)} sub="Avg ₦486/drop" icon={Coins} variant="gold" />
        <KPICard label="Hub commission" value={formatNaira(96270)} sub="6% of payouts" icon={Users} variant="dark" />
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
            {ROWS.map((r, i) => (
              <tr key={i}>
                <td className="font-bold">{r.date}, 2026</td>
                <td className="font-mono">{r.drops}</td>
                <td className="font-mono">{r.kg} kg</td>
                <td className="font-mono">{formatNaira(r.paid)}</td>
                <td className="text-right"><span className="money">{formatNaira(r.comm)}</span></td>
                <td><span className="badge-success">Submitted</span></td>
              </tr>
            ))}
            <tr className="bg-cream/50 font-extrabold">
              <td>Total</td>
              <td className="font-mono">1,182</td>
              <td className="font-mono">4,173 kg</td>
              <td className="font-mono">{formatNaira(574400)}</td>
              <td className="text-right money text-accent-700">{formatNaira(96270)}</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
