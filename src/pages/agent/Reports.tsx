import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { BarChart3, Building2, Coins, Recycle } from "lucide-react";

const WEEK = [
  { d: "Mon", v: 380 }, { d: "Tue", v: 420 }, { d: "Wed", v: 360 }, { d: "Thu", v: 480 },
  { d: "Fri", v: 520 }, { d: "Sat", v: 610 }, { d: "Sun", v: 280 },
];

export default function AgentReports() {
  const max = Math.max(...WEEK.map((w) => w.v));
  return (
    <>
      <PageHeader title="Hub reports" subtitle="Daily and weekly performance for Surulere Hub." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="green" label="This week kg" value="3,050 kg" delta="+18% WoW" icon={<Recycle size={18} />} />
        <StatCard tone="gold" label="Commission" value={formatNaira(58_400)} delta="This week" icon={<Coins size={18} />} />
        <StatCard label="Submissions" value="284" delta="48 today" icon={<BarChart3 size={18} />} />
        <StatCard label="Avg fill" value="62%" delta="↓ from 71% last week" icon={<Building2 size={18} />} />
      </div>
      <Section title="Daily volume (kg) — last 7 days">
        <div className="flex h-56 items-end gap-3">
          {WEEK.map((w) => (
            <div key={w.d} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-t-xl bg-gradient-primary" style={{ height: `${(w.v / max) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-textgray">{w.d}</span>
              <span className="font-mono text-xs">{w.v}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
