import { Truck } from "lucide-react";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/ui";

export default function AdminLogistics() {
  return (
    <>
      <PageHeader title="Logistics oversight" subtitle="Manage logistics partners, allocate pickups and monitor SLAs." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard tone="green" label="Active partners" value="38" icon={<Truck size={18} />} />
        <StatCard tone="gold" label="Pickups today" value="184" delta="↑ 12% vs yesterday" />
        <StatCard label="On-time rate" value="94.2%" delta="SLA target 90%" />
      </div>
      <Section title="Partners">
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr><th className="px-4 py-3">Partner</th><th className="px-4 py-3">Cities</th><th className="px-4 py-3">Fleet</th><th className="px-4 py-3 text-right">Pickups (30d)</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {[
                { n: "Kunle Logistics Ltd", c: "Lagos · Ogun · Oyo", f: "4 trucks", p: 482, s: "verified" as const },
                { n: "Sahara Movers", c: "Abuja · Nasarawa", f: "3 trucks", p: 318, s: "verified" as const },
                { n: "Niger Delta Freight", c: "Port Harcourt · Bayelsa", f: "5 trucks", p: 401, s: "verified" as const },
                { n: "Greater Kano Cartage", c: "Kano · Kaduna", f: "2 trucks", p: 142, s: "pending" as const },
              ].map((r) => (
                <tr key={r.n}><td className="px-4 py-3 font-semibold">{r.n}</td><td className="px-4 py-3">{r.c}</td><td className="px-4 py-3 text-textgray">{r.f}</td><td className="px-4 py-3 text-right font-mono">{r.p}</td><td className="px-4 py-3"><StatusPill status={r.s} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
