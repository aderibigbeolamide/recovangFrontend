import { PageHeader, Section, StatusPill } from "@/components/ui";
import { CheckCircle2, MapPin, Truck } from "lucide-react";

const PICKUPS = [
  { id: "PU-481", from: "Surulere Hub", to: "Sunshine PET Factory", drv: "Yusuf I.", w: "1,240 kg", eta: "12 min", pay: 18_000, s: "in-transit" as const },
  { id: "PU-480", from: "Yaba Centre", to: "Alaba E-Waste Plant", drv: "Tope A.", w: "320 kg", eta: "28 min", pay: 9_500, s: "in-transit" as const },
  { id: "PU-479", from: "Lekki Hub", to: "Sunshine PET Factory", drv: "Sani G.", w: "880 kg", eta: "—", pay: 14_000, s: "pending" as const },
  { id: "PU-478", from: "Ikorodu Garage", to: "Greencard Recyclers", drv: "Yusuf I.", w: "560 kg", eta: "—", pay: 22_000, s: "pending" as const },
  { id: "PU-477", from: "Wuse Zone 5", to: "Karu Steel Mills", drv: "Auwal D.", w: "1,800 kg", eta: "—", pay: 32_000, s: "completed" as const },
];

export default function LogisticsPickups() {
  return (
    <>
      <PageHeader title="Pickups" subtitle="Accept, transit and complete pickup requests across your assigned hubs." />
      <Section>
        <div className="space-y-3">
          {PICKUPS.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-bordergray bg-white p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary">
                <Truck size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-display font-bold">{p.from}</span>
                  <span className="text-textgray">→</span>
                  <span className="font-display font-bold">{p.to}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-textgray">
                  <span className="font-mono">{p.id}</span>
                  <span>·</span>
                  <span>{p.w}</span>
                  <span>·</span>
                  <span>Driver: {p.drv}</span>
                  {p.eta !== "—" && (<><span>·</span><span className="flex items-center gap-1"><MapPin size={12} /> ETA {p.eta}</span></>)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">₦{p.pay.toLocaleString()}</div>
                <StatusPill status={p.s} />
              </div>
              {p.s === "pending" && <button className="btn-primary"><CheckCircle2 size={14} /> Accept</button>}
              {p.s === "in-transit" && <button className="btn-outline">Mark complete</button>}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
