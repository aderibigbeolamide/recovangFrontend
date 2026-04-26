import { Flame } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";

export default function CollectorStreaks() {
  const days = Array.from({ length: 28 }, (_, i) => i);
  const active = new Set([0, 2, 3, 5, 6, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 23, 24, 25, 26, 27]);
  return (
    <>
      <PageHeader title="Collection streak" subtitle="Stay consistent — every 7 days unlocks a streak bonus." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard tone="green" label="Current streak" value="14 days" delta="🔥 Top 3% in Lagos" icon={<Flame size={18} />} />
        <StatCard tone="gold" label="Longest streak" value="22 days" delta="Set Mar 2026" />
        <StatCard label="Streak bonus earned" value="₦7,800" delta="Lifetime" />
      </div>
      <Section title="Last 28 days" description="Each green dot is a day with a verified submission.">
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold ${
                active.has(d) ? "bg-primary text-white" : "bg-bordergray/50 text-textgray"
              }`}
            >
              {active.has(d) && <Flame size={14} />}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
