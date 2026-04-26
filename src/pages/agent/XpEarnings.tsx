import { Award, Coins, Flame } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

export default function AgentXp() {
  return (
    <>
      <PageHeader title="Agent XP & earnings" subtitle="Verify accurately, fight fraud, and climb the agent rankings." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard tone="green" label="Agent XP" value="3,840" delta="Level 6 · Verifier" icon={<Award size={18} />} />
        <StatCard tone="gold" label="Lifetime commission" value={formatNaira(284_000)} delta="2.5% per verified kg" icon={<Coins size={18} />} />
        <StatCard label="Streak" value="42 days" delta="Verified at least one drop daily" icon={<Flame size={18} />} />
      </div>
      <Section title="Commission breakdown — this month">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-textgray">
            <tr><th className="py-2">Material</th><th>Verified kg</th><th>Rate</th><th className="text-right">Earned</th></tr>
          </thead>
          <tbody className="divide-y divide-bordergray">
            {[
              { m: "PET Plastic", k: 480, r: "₦5/kg", e: 2400 },
              { m: "Cardboard", k: 720, r: "₦2/kg", e: 1440 },
              { m: "Aluminium Cans", k: 96, r: "₦15/kg", e: 1440 },
              { m: "E-Waste", k: 22, r: "₦30/kg", e: 660 },
              { m: "Glass", k: 410, r: "₦1/kg", e: 410 },
            ].map((r) => (
              <tr key={r.m}>
                <td className="py-3 font-semibold">{r.m}</td>
                <td className="py-3 font-mono">{r.k} kg</td>
                <td className="py-3 text-textgray">{r.r}</td>
                <td className="py-3 text-right font-mono font-semibold">{formatNaira(r.e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}
