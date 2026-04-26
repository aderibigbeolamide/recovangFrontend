import { Link } from "react-router-dom";
import { Truck, Users, MapPin, ArrowRight } from "lucide-react";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

export default function LogisticsDashboard() {
  return (
    <>
      <PageHeader title="Fleet & pickups today" subtitle="3 trucks · 4 active pickups · 12 completed this week"
        action={<Link to="/logistics/pickups" className="btn-primary"><Truck size={16} /> Open pickup queue</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="green" label="Active pickups" value="4" delta="2 in transit · 2 accepted" icon={<Truck size={18} />} />
        <StatCard tone="gold" label="Earned this week" value={formatNaira(186_400)} delta="↑ 22%" />
        <StatCard label="Fleet on duty" value="3 / 4" delta="1 truck off-shift" icon={<Users size={18} />} />
        <StatCard label="Avg pickup time" value="42 min" delta="-7 min vs last week" />
      </div>
      <Section className="mt-6" title="Active pickups">
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr><th className="px-4 py-3">Pickup</th><th className="px-4 py-3">Hub</th><th className="px-4 py-3">Destination</th><th className="px-4 py-3">Driver</th><th className="px-4 py-3 text-right">Weight</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {[
                { id: "PU-481", from: "Surulere Hub", to: "Sunshine PET Factory", drv: "Yusuf I.", w: "1,240 kg", s: "in-transit" as const },
                { id: "PU-480", from: "Yaba Centre", to: "Alaba E-Waste Plant", drv: "Tope A.", w: "320 kg", s: "in-transit" as const },
                { id: "PU-479", from: "Lekki Hub", to: "Sunshine PET Factory", drv: "Sani G.", w: "880 kg", s: "pending" as const },
                { id: "PU-478", from: "Ikorodu Garage", to: "Greencard Recyclers", drv: "Yusuf I.", w: "560 kg", s: "pending" as const },
              ].map((r) => (
                <tr key={r.id}><td className="px-4 py-3 font-mono text-xs">{r.id}</td><td className="px-4 py-3 font-semibold">{r.from}</td><td className="px-4 py-3">{r.to}</td><td className="px-4 py-3 text-textgray">{r.drv}</td><td className="px-4 py-3 text-right font-mono">{r.w}</td><td className="px-4 py-3"><StatusPill status={r.s} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/logistics/pickups" className="btn-outline mt-4 w-full justify-center"><MapPin size={14} /> See all pickups <ArrowRight size={14} /></Link>
      </Section>
    </>
  );
}
