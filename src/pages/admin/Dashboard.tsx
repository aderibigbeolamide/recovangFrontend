import { BarChart3, Coins, Recycle, Users } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const REGIONS = [
  { r: "Lagos", c: 28_400, kg: 482_000, paid: 124_000_000 },
  { r: "Abuja", c: 12_800, kg: 198_400, paid: 52_000_000 },
  { r: "Port Harcourt", c: 9_600, kg: 142_800, paid: 38_500_000 },
  { r: "Kano", c: 6_200, kg: 88_900, paid: 22_400_000 },
  { r: "Ibadan", c: 5_400, kg: 74_100, paid: 18_900_000 },
];

export default function AdminDashboard() {
  return (
    <>
      <PageHeader title="Platform overview" subtitle="Real-time KPIs across collectors, agents, hubs and brands." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="green" label="Total collectors" value="62,418" delta="+1,284 this week" icon={<Users size={18} />} />
        <StatCard tone="gold" label="Paid out" value={formatNaira(284_000_000)} delta="+₦12.8M this week" icon={<Coins size={18} />} />
        <StatCard label="Kg recovered" value="1.2M" delta="+18,400 this week" icon={<Recycle size={18} />} />
        <StatCard label="Active hubs" value="412" delta="+9 verified" icon={<BarChart3 size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Regional performance" className="lg:col-span-2">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-textgray">
              <tr><th className="py-2">Region</th><th>Collectors</th><th>Kg recovered</th><th className="text-right">Paid</th></tr>
            </thead>
            <tbody className="divide-y divide-bordergray">
              {REGIONS.map((r) => (
                <tr key={r.r}>
                  <td className="py-3 font-semibold">{r.r}</td>
                  <td className="py-3 font-mono">{r.c.toLocaleString()}</td>
                  <td className="py-3 font-mono">{r.kg.toLocaleString()} kg</td>
                  <td className="py-3 text-right font-mono font-semibold">{formatNaira(r.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section title="Today">
          <Stat label="Submissions" value="1,284" />
          <Stat label="Pending verifications" value="86" />
          <Stat label="Withdrawals" value={formatNaira(8_400_000)} />
          <Stat label="Fraud flagged" value="9" warn />
          <Stat label="New collectors" value="412" />
        </Section>
      </div>
    </>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-bordergray py-3 last:border-0">
      <span className="text-sm text-textgray">{label}</span>
      <span className={`font-mono font-bold ${warn ? "text-error" : "text-charcoal"}`}>{value}</span>
    </div>
  );
}
