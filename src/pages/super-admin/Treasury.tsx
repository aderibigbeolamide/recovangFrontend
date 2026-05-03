import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, Building2, CalendarClock, Download, Repeat, ShieldCheck, Wallet } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart } from "@/components/charts";
import { formatNaira } from "@/lib/cn";

const LANES = [
  { id: "epr", label: "EPR brand wallets", value: 184_200_000, holdings: 9, change: "+12.4%", note: "Coca-Cola, Nestlé, Unilever +6 brands have prepaid for compliance recovery." },
  { id: "payouts", label: "Collector payout pool", value: 42_800_000, holdings: 4_182, change: "+4.8%", note: "Ready for next settlement window. Auto-settles every 3 days." },
  { id: "reserve", label: "Reserve & operating float", value: 96_400_000, holdings: 1, change: "+1.2%", note: "Liquidity buffer for daily ops, refunds and incidents." },
  { id: "settlement", label: "Settlement in transit", value: 18_900_000, holdings: 142, change: "—", note: "Bank rails (NIBSS) — clears tonight 23:59 WAT." },
];

const FLOWS_30D = [
  { label: "Day 1", value: 8_400_000 }, { label: "5", value: 9_200_000 },
  { label: "10", value: 11_400_000 }, { label: "15", value: 13_800_000 },
  { label: "20", value: 12_900_000 }, { label: "25", value: 15_600_000 },
  { label: "30", value: 18_900_000 },
];

const SETTLEMENTS = [
  { id: "ST-2419", time: "Tonight · 23:59 WAT", count: 412, amount: 18_900_000, rail: "NIBSS · GTBank ops", status: "scheduled" },
  { id: "ST-2418", time: "27 Apr · 23:59", count: 384, amount: 16_200_000, rail: "NIBSS · GTBank ops", status: "settled" },
  { id: "ST-2417", time: "24 Apr · 23:59", count: 296, amount: 12_400_000, rail: "NIBSS · GTBank ops", status: "settled" },
  { id: "ST-2416", time: "21 Apr · 23:59", count: 318, amount: 14_900_000, rail: "Paystack · backup", status: "settled" },
];

const BRAND_LEDGERS = [
  { name: "Coca-Cola Nigeria", balance: 48_200_000, recovered: 84_412, target: 120_000, pct: 70 },
  { name: "Nestlé Waters", balance: 32_800_000, recovered: 41_280, target: 60_000, pct: 69 },
  { name: "Unilever Nigeria", balance: 28_400_000, recovered: 38_410, target: 80_000, pct: 48 },
  { name: "Pepsi Nigeria", balance: 24_100_000, recovered: 31_220, target: 50_000, pct: 62 },
  { name: "Friesland Campina", balance: 18_400_000, recovered: 22_180, target: 40_000, pct: 55 },
  { name: "Dangote Sugar", balance: 12_200_000, recovered: 14_180, target: 30_000, pct: 47 },
];

export default function SuperAdminTreasury() {
  const [tab, setTab] = useState<"flows" | "settlements" | "brands">("flows");
  const total = LANES.reduce((s, l) => s + l.value, 0);

  return (
    <>
      <PageHeader
        eyebrow="Super Admin · Financial engine"
        title="Treasury console"
        subtitle="Every naira on the platform — segregated, reconciled, audit-logged. Move funds between lanes and trigger settlements."
        actions={
          <>
            <button className="btn-outline"><Download size={14} /> Export ledger</button>
            <button className="btn-primary"><Repeat size={14} /> Trigger settlement</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total under management" value={formatNaira(total, { compact: true })} sub="Across 4 segregated lanes" icon={Wallet} variant="primary" trend={{ value: "+18.4% MoM", direction: "up" }} />
        <KPICard label="Inflows · last 30d" value={formatNaira(218_400_000, { compact: true })} sub="Brand top-ups + factory orders" icon={ArrowDownRight} variant="dark" />
        <KPICard label="Outflows · last 30d" value={formatNaira(96_200_000, { compact: true })} sub="Collector payouts + settlements" icon={ArrowUpRight} variant="gold" />
        <KPICard label="Reconciliation status" value="100%" sub="Last reconciled 12m ago" icon={ShieldCheck} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LANES.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">{l.label}</div>
              <span className="badge-success text-[10px]">{l.change}</span>
            </div>
            <div className="mt-3 font-mono text-2xl font-extrabold">{formatNaira(l.value, { compact: true })}</div>
            <div className="mt-1 text-[11px] text-textgray">{l.holdings} holding{l.holdings === 1 ? "" : "s"}</div>
            <p className="mt-3 text-xs text-textgray">{l.note}</p>
            <button className="btn-outline btn-sm mt-4 w-full">Move funds</button>
          </div>
        ))}
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-bordergray bg-cream/40 p-3">
          {[
            { id: "flows", label: "Daily flows", icon: Banknote },
            { id: "settlements", label: "Settlements", icon: CalendarClock },
            { id: "brands", label: "Brand ledgers", icon: Building2 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-charcoal text-white" : "text-textgray hover:bg-white"}`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "flows" && (
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Settlement volume · 30 days</div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="font-mono text-3xl font-extrabold">{formatNaira(78_400_000, { compact: true })}</div>
              <span className="badge-success">+ 18% MoM</span>
            </div>
            <div className="mt-6"><AreaChart data={FLOWS_30D} height={240} /></div>
          </div>
        )}

        {tab === "settlements" && (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Batch</th><th>Window</th><th className="text-right">Payouts</th><th className="text-right">Amount</th><th>Bank rail</th><th>Status</th><th className="text-right"></th></tr></thead>
              <tbody>
                {SETTLEMENTS.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs font-bold text-primary">{s.id}</td>
                    <td>{s.time}</td>
                    <td className="text-right font-mono">{s.count}</td>
                    <td className="text-right font-mono font-extrabold">{formatNaira(s.amount)}</td>
                    <td className="text-sm text-textgray">{s.rail}</td>
                    <td><StatusPill status={s.status === "settled" ? "success" : "warning"} label={s.status} /></td>
                    <td className="text-right"><button className="btn-ghost btn-sm">View batch</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "brands" && (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Brand</th><th className="text-right">EPR balance</th><th className="text-right">Recovered (kg)</th><th className="text-right">Target (kg)</th><th className="min-w-[180px]">Progress</th><th className="text-right"></th></tr></thead>
              <tbody>
                {BRAND_LEDGERS.map((b) => (
                  <tr key={b.name}>
                    <td className="font-extrabold">{b.name}</td>
                    <td className="text-right font-mono">{formatNaira(b.balance, { compact: true })}</td>
                    <td className="text-right font-mono">{b.recovered.toLocaleString()}</td>
                    <td className="text-right font-mono text-textgray">{b.target.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-charcoal/8">
                          <div className={`h-full rounded-full ${b.pct >= 60 ? "bg-grad-primary" : "bg-warning"}`} style={{ width: `${b.pct}%` }} />
                        </div>
                        <span className="font-mono text-xs">{b.pct}%</span>
                      </div>
                    </td>
                    <td className="text-right"><button className="btn-ghost btn-sm">Open ledger</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
