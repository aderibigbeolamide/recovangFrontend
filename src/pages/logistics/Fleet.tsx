import { Battery, Calendar, Edit3, Fuel, MapPin, Phone, Plus, Settings, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar } from "@/components/charts";
import { formatNaira } from "@/lib/cn";

const TRUCKS = [
  { id: "LG-LD221", model: "Iveco Daily 35S15", cap: 3.5, year: 2022, status: "active", driver: "Suleiman Mohammed", odo: 84210, fuel: 68, service: "in 18d", trips: 142 },
  { id: "LG-AP118", model: "JAC X200 1.5T", cap: 1.5, year: 2023, status: "active", driver: "Femi Akande", odo: 41820, fuel: 41, service: "in 32d", trips: 98 },
  { id: "LG-IK402", model: "Foton Aumark 2T", cap: 2.0, year: 2021, status: "active", driver: "Bashir Olu", odo: 132410, fuel: 22, service: "OVERDUE", trips: 218 },
  { id: "LG-MK331", model: "Toyota Dyna 200", cap: 4.0, year: 2020, status: "idle", driver: "Adamu Sani", odo: 218400, fuel: 84, service: "in 9d", trips: 312 },
  { id: "LG-OS112", model: "Ford Transit 350", cap: 1.8, year: 2024, status: "idle", driver: "—", odo: 12480, fuel: 92, service: "in 56d", trips: 28 },
  { id: "LG-AB204", model: "Mercedes Atego", cap: 7.0, year: 2019, status: "maintenance", driver: "—", odo: 342100, fuel: 0, service: "In service", trips: 482 },
  { id: "LG-PH901", model: "Hino 300", cap: 5.0, year: 2022, status: "idle", driver: "—", odo: 96820, fuel: 71, service: "in 14d", trips: 184 },
  { id: "LG-NJ501", model: "Tata Ultra 1014", cap: 4.5, year: 2023, status: "idle", driver: "—", odo: 38420, fuel: 88, service: "in 41d", trips: 76 },
];

const STATUS: Record<string, { c: string; l: string }> = {
  active: { c: "success", l: "On the road" },
  idle: { c: "warning", l: "Idle · ready" },
  maintenance: { c: "error", l: "In maintenance" },
};

export default function LogisticsFleet() {
  return (
    <>
      <PageHeader
        eyebrow="Fleet"
        title="Your fleet · 8 vehicles"
        subtitle="Manage trucks, drivers, fuel and service schedules. Live status pulled from your in-cab telemetry units."
        actions={
          <>
            <button className="btn-outline"><Calendar size={14} /> Maintenance schedule</button>
            <button className="btn-primary"><Plus size={14} /> Add vehicle</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Total vehicles" value="8" sub="22 tonnes capacity" icon={Truck} variant="primary" />
        <KPICard label="On the road" value="3" sub="62% utilisation" icon={MapPin} variant="dark" />
        <KPICard label="Maintenance due" value="2" sub="1 overdue" icon={Wrench} variant="gold" />
        <KPICard label="Avg fuel" value="58%" sub="Refuel needed: 2" icon={Fuel} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TRUCKS.map((t) => {
          const s = STATUS[t.status];
          const overdue = t.service === "OVERDUE";
          return (
            <div key={t.id} className="card overflow-hidden">
              <div className={`grid h-32 place-items-center ${
                t.status === "active" ? "bg-grad-primary text-white"
                : t.status === "idle" ? "bg-grad-mint text-primary"
                : "bg-cream text-charcoal/40"
              }`}>
                <div className="text-center">
                  <Truck size={32} className="mx-auto" />
                  <div className="mt-1 font-mono text-xs font-bold opacity-80">{t.id}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold">{t.model}</h3>
                    <div className="text-xs text-textgray">{t.cap}T · {t.year} · {t.trips} trips</div>
                  </div>
                  <span className={`badge bg-${s.c}-50 text-${s.c}`}>{s.l}</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={t.driver === "—" ? "Unassigned" : t.driver} size={32} />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{t.driver === "—" ? "Unassigned" : t.driver}</div>
                    <div className="text-[11px] text-textgray">{t.driver === "—" ? "No driver" : "Verified"}</div>
                  </div>
                  {t.driver !== "—" && <button className="btn-ghost btn-sm"><Phone size={11} /></button>}
                </div>
                <div className="mt-4 space-y-2">
                  <ProgressBar label={`Fuel · ${t.fuel}%`} value={t.fuel} max={100} color={t.fuel < 30 ? "#E74C3C" : t.fuel < 60 ? "#D4A017" : "#1A6B3C"} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-cream p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Odometer</div>
                    <div className="font-mono font-extrabold">{(t.odo / 1000).toFixed(1)}k km</div>
                  </div>
                  <div className={`rounded-xl p-2.5 ${overdue ? "bg-error-50 text-error" : "bg-cream text-charcoal"}`}>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Service</div>
                    <div className="font-mono font-extrabold">{t.service}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-outline btn-sm flex-1"><Edit3 size={11} /> Edit</button>
                  <button className="btn-primary btn-sm flex-1"><Settings size={11} /> Manage</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
