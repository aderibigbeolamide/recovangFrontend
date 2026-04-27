import { Activity, AlertTriangle, ArrowRight, Building2, CheckCircle2, Coins, Globe, Package, Recycle, ShieldCheck, TrendingUp, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut, ProgressRing } from "@/components/charts";
import { formatNaira } from "@/lib/cn";

const ALERTS = [
  { type: "fraud", text: "9 flagged drops awaiting review at Lekki Hub", priority: "high" },
  { type: "logistics", text: "Hub LG-IK402 truck service overdue", priority: "high" },
  { type: "capacity", text: "Surulere Flagship Hub at 78% capacity", priority: "med" },
  { type: "ops", text: "Pricing engine refresh scheduled for Monday 6am", priority: "low" },
];

const REVENUE = [
  { label: "W1", value: 1200000 }, { label: "W2", value: 1480000 },
  { label: "W3", value: 1620000 }, { label: "W4", value: 1840000 },
];

const CITIES = [
  { name: "Lagos", drops: 18420, kg: 64280, rev: 14820000 },
  { name: "Abuja", drops: 6840, kg: 22480, rev: 5240000 },
  { name: "Port Harcourt", drops: 4280, kg: 14820, rev: 3480000 },
  { name: "Ibadan", drops: 2840, kg: 9420, rev: 2180000 },
  { name: "Kano", drops: 1840, kg: 6280, rev: 1480000 },
];

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Admin · Recovang HQ · Lagos"
        title="Platform overview"
        subtitle="Real-time across 412 hubs, 9 cities, 8 logistics partners and 62,418 active collectors."
        actions={
          <>
            <button className="btn-outline"><Activity size={14} /> System health</button>
            <button className="btn-primary"><ShieldCheck size={14} /> Operations console</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active collectors" value="62,418" sub="+ 1,824 this week" icon={Users} variant="primary" trend={{ value: "+3.0%", direction: "up" }} />
        <KPICard label="KG recovered" value="1.24M kg" sub="1,240 tonnes" icon={Recycle} variant="default" trend={{ value: "+12% vs LM", direction: "up" }} />
        <KPICard label="Paid to collectors" value={formatNaira(284000000)} sub="₦284M lifetime" icon={Coins} variant="gold" />
        <KPICard label="Platform revenue" value={formatNaira(48400000)} sub="MRR ₦8.2M" icon={TrendingUp} variant="dark" trend={{ value: "+28% MoM", direction: "up" }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Revenue */}
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Monthly revenue</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">₦8.2M</div>
                <span className="badge-success">+ 28% MoM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
              {["1M", "3M", "1Y"].map((p, i) => (
                <button key={p} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-white text-charcoal shadow-soft" : "text-textgray"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <AreaChart data={REVENUE} height={220} />
          </div>
        </div>

        {/* Alerts */}
        <div className="card overflow-hidden lg:col-span-4">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <h3 className="text-h4 flex items-center gap-2"><AlertTriangle size={18} className="text-warning" /> Live alerts</h3>
            <span className="badge bg-error-50 text-error">4</span>
          </div>
          <div className="divide-y divide-bordergray">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.priority === "high" ? "bg-error" : a.priority === "med" ? "bg-warning" : "bg-info"}`} />
                <div className="flex-1">
                  <div className="text-sm text-charcoal">{a.text}</div>
                </div>
                <button className="btn-ghost btn-sm">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Cities table */}
        <div className="card overflow-hidden lg:col-span-7">
          <div className="border-b border-bordergray p-6">
            <h3 className="text-h4">Performance by city</h3>
            <p className="text-sm text-textgray">Live, last 30 days</p>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>City</th><th>Drops</th><th>KG</th><th className="text-right">Revenue</th></tr>
            </thead>
            <tbody>
              {CITIES.map((c) => (
                <tr key={c.name}>
                  <td><div className="flex items-center gap-2"><Globe size={14} className="text-primary" /><span className="font-bold">{c.name}</span></div></td>
                  <td className="font-mono">{c.drops.toLocaleString()}</td>
                  <td className="font-mono">{(c.kg / 1000).toFixed(1)} t</td>
                  <td className="text-right"><span className="money">{formatNaira(c.rev)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Material mix */}
        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix · platform-wide</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days · 1,240 t total</p>
          <Donut
            centerValue="1,240 t"
            centerLabel="Recovered"
            data={[
              { label: "PET Plastic", value: 482, color: "#1A6B3C" },
              { label: "Cardboard", value: 318, color: "#D4A017" },
              { label: "Aluminium", value: 184, color: "#3F9264" },
              { label: "Paper", value: 142, color: "#1C1C2E" },
              { label: "Glass", value: 84, color: "#A0A4AB" },
              { label: "E-Waste", value: 30, color: "#E74C3C" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active hubs" value="412" sub="22 opened this month" icon={Building2} />
        <KPICard label="Logistics fleet" value="68 trucks" sub="8 partners" icon={Truck} />
        <KPICard label="System uptime" value="99.97%" sub="30-day rolling" icon={CheckCircle2} variant="primary" />
        <KPICard label="Fraud queue" value="9" sub="Avg resolution: 4h" icon={ShieldCheck} variant="dark" />
      </div>
    </>
  );
}
