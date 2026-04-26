import { Plus, Truck, User } from "lucide-react";
import { PageHeader, Section, StatusPill } from "@/components/ui";

const FLEET = [
  { plate: "LAG-481-XY", model: "Mitsubishi Canter 4-ton", driver: "Yusuf Ibrahim", phone: "+234 803 111 2222", status: "in-transit" as const },
  { plate: "LAG-296-ZB", model: "Iveco Daily 3.5-ton", driver: "Tope Adesanya", phone: "+234 803 222 3333", status: "in-transit" as const },
  { plate: "LAG-104-MA", model: "JAC N-Series 6-ton", driver: "Sani Garba", phone: "+234 803 333 4444", status: "pending" as const },
  { plate: "LAG-873-BR", model: "Mitsubishi Canter 4-ton", driver: "Auwal Danjuma", phone: "+234 803 444 5555", status: "completed" as const },
];

export default function LogisticsFleet() {
  return (
    <>
      <PageHeader title="Fleet & drivers" subtitle="Manage your trucks, assign drivers and monitor status."
        action={<button className="btn-primary"><Plus size={16} /> Add vehicle</button>} />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {FLEET.map((f) => (
            <div key={f.plate} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary"><Truck size={20} /></div>
                  <div>
                    <p className="font-display font-bold">{f.plate}</p>
                    <p className="text-xs text-textgray">{f.model}</p>
                  </div>
                </div>
                <StatusPill status={f.status} />
              </div>
              <div className="divider" />
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-textgray" />
                <span className="font-semibold">{f.driver}</span>
                <span className="text-textgray">·</span>
                <span className="text-textgray">{f.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
