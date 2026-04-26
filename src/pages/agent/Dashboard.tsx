import { Building2, Coins, ScanLine, Users } from "lucide-react";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { Link } from "react-router-dom";

const QUEUE = [
  { id: "RX-2419", who: "Adaeze N.", material: "PET Plastic", weight: "4.2 kg", time: "2 min ago", status: "pending" as const },
  { id: "RX-2418", who: "Tope M.", material: "Cardboard", weight: "11.0 kg", time: "5 min ago", status: "pending" as const },
  { id: "RX-2417", who: "Femi R.", material: "Aluminium Cans", weight: "0.9 kg", time: "12 min ago", status: "pending" as const },
];

export default function AgentDashboard() {
  return (
    <>
      <PageHeader title="Surulere Hub · Today" subtitle="68% of capacity used. 7 submissions waiting for verification."
        action={<Link to="/agent/verify" className="btn-primary"><ScanLine size={16} /> Open scanner</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="green" label="Hub load" value="68%" delta="340 / 500 kg today" icon={<Building2 size={18} />} />
        <StatCard tone="gold" label="Verifications" value="48" delta="+12 vs yesterday" icon={<ScanLine size={18} />} />
        <StatCard label="Active collectors" value="29" delta="3 new this week" icon={<Users size={18} />} />
        <StatCard label="Commission earned" value={formatNaira(8_400)} delta="Today" icon={<Coins size={18} />} />
      </div>
      <Section className="mt-6" title="Pending verification queue" action={<Link to="/agent/verify" className="text-sm font-semibold text-primary">Open queue →</Link>}>
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Collector</th><th className="px-4 py-3">Material</th><th className="px-4 py-3 text-right">Weight (claimed)</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {QUEUE.map((r) => (
                <tr key={r.id} className="hover:bg-mint/40">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 font-semibold">{r.who}</td>
                  <td className="px-4 py-3">{r.material}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.weight}</td>
                  <td className="px-4 py-3 text-textgray">{r.time}</td>
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
