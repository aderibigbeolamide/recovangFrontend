import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";

export default function AgentHub() {
  return (
    <>
      <PageHeader title="Hub overview" subtitle="Surulere Hub · 12 Bode Thomas, Surulere · Lagos" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="green" label="Today's load" value="340 kg" delta="68% of capacity" icon={<Building2 size={18} />} />
        <StatCard tone="gold" label="Capacity" value="500 kg/day" delta="Tier B hub" />
        <StatCard label="Open hours" value="8am – 7pm" delta="Mon – Sat" icon={<Clock size={18} />} />
        <StatCard label="Hub manager" value="Bola A." delta="+234 802 345 6789" icon={<Phone size={18} />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Real-time capacity">
          <div className="space-y-3">
            {[
              { mat: "PET Plastic", load: 124, cap: 200 },
              { mat: "Cardboard", load: 86, cap: 150 },
              { mat: "Aluminium Cans", load: 18, cap: 50 },
              { mat: "E-Waste", load: 8, cap: 30 },
              { mat: "Glass", load: 104, cap: 70 },
            ].map((m) => {
              const pct = Math.min(100, (m.load / m.cap) * 100);
              const over = m.load > m.cap;
              return (
                <div key={m.mat}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold">{m.mat}</span>
                    <span className={`font-mono text-xs ${over ? "text-error" : "text-textgray"}`}>{m.load} / {m.cap} kg</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bordergray">
                    <div className={`h-full ${over ? "bg-error" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
        <Section title="Hub details">
          <div className="space-y-3 text-sm">
            <Row label="Address" value="12 Bode Thomas, Surulere, Lagos" icon={<MapPin size={14} />} />
            <Row label="GPS" value="6.4951° N, 3.3556° E" />
            <Row label="Tier" value="B (medium volume)" />
            <Row label="Active since" value="Jan 14, 2025" />
            <Row label="Verified collectors" value="29" />
            <Row label="Lifetime kg processed" value="14,820 kg" />
          </div>
          <button className="btn-outline mt-5 w-full">Update capacity</button>
        </Section>
      </div>
    </>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-bordergray pb-2">
      <span className="flex items-center gap-2 text-textgray">{icon} {label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
