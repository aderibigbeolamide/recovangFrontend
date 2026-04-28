import { Activity, Building2, ChevronDown, Filter, Fuel, MapPin, Navigation, Package, Plus, Route, Search, ShieldCheck, Star, Truck } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar } from "@/components/charts";
import { CategoryIcon } from "@/components/illustrations";
import { formatKg, formatNaira, formatNumber } from "@/lib/cn";
import { useHubs, useLogistics } from "@/hooks/useAdmin";

const PARTNERS = [
  { name: "GreenWheels Nigeria", trucks: 8, drivers: 12, rating: 4.9, trips: 2418, on: 96, rev: 48400000, cities: ["Lagos", "Ibadan"] },
  { name: "BlueArrow Logistics", trucks: 12, drivers: 18, rating: 4.8, trips: 3104, on: 94, rev: 62400000, cities: ["Lagos", "Abeokuta"] },
  { name: "PalmCargo Movers", trucks: 6, drivers: 9, rating: 4.7, trips: 1820, on: 91, rev: 32400000, cities: ["PH", "Calabar"] },
  { name: "Sahel Express", trucks: 9, drivers: 14, rating: 4.6, trips: 2104, on: 89, rev: 38800000, cities: ["Abuja", "Kano"] },
  { name: "Naija Haulage", trucks: 14, drivers: 22, rating: 4.5, trips: 3418, on: 87, rev: 71200000, cities: ["Lagos", "Ibadan", "PH"] },
  { name: "Lagos Freight Co.", trucks: 5, drivers: 7, rating: 4.4, trips: 1240, on: 92, rev: 21800000, cities: ["Lagos"] },
  { name: "Triton Movers", trucks: 7, drivers: 11, rating: 4.6, trips: 1890, on: 93, rev: 32100000, cities: ["Lagos", "Ogun"] },
  { name: "Eagle Cargo", trucks: 7, drivers: 9, rating: 4.5, trips: 1610, on: 90, rev: 28100000, cities: ["Abuja", "Jos"] },
];

const ROUTES = [
  { id: "RT-018", from: "Surulere · Lagos", to: "Ikorodu Recycler", load: "PET 1.2t", eta: "27 min", driver: "Suleiman M.", partner: "GreenWheels", status: "in-transit", progress: 64 },
  { id: "RT-017", from: "Yaba Centre · Lagos", to: "Apapa Port", load: "Cardboard 2.4t", eta: "1h 12m", driver: "Femi A.", partner: "BlueArrow", status: "in-transit", progress: 32 },
  { id: "RT-016", from: "GRA · Port Harcourt", to: "PH Recycler", load: "Glass 1.8t", eta: "Loading", driver: "Pius O.", partner: "PalmCargo", status: "loading", progress: 8 },
  { id: "RT-015", from: "Wuse · Abuja", to: "Idu Industrial", load: "Aluminium 0.9t", eta: "ETA 18m", driver: "Bashir L.", partner: "Sahel Express", status: "in-transit", progress: 78 },
];

export default function AdminLogistics() {
  const { data: partners, isLoading: partnersLoading } = useLogistics();
  const { data: hubs, isLoading: hubsLoading } = useHubs();

  const isLoading = partnersLoading || hubsLoading;
  return (
    <>
      <PageHeader
        eyebrow="Logistics ops"
        title="Fleet & route control"
        subtitle="Live view of every truck, partner and route across Recovang. Spot delays, rebalance loads, audit performance."
        actions={
          <>
            <button className="btn-outline"><Activity size={14} /> Map view</button>
            <button className="btn-primary"><Plus size={14} /> Manual route</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Active partners" value={formatNumber(partners?.length || 0)} sub="Across all regions" icon={Truck} variant="primary" />
        <KPICard label="Total Hubs" value={formatNumber(hubs?.length || 0)} sub="Lagos · Abuja · Port Harcourt" icon={Building2} />
        <KPICard label="Today's tonnage" value="1.2 t" sub="Across all hubs" icon={Package} variant="gold" />
        <KPICard label="System health" value="98%" sub="Operational" icon={ShieldCheck} variant="dark" />
      </div>

      {/* Live routes map */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Live routes</h3>
            <p className="text-sm text-textgray">14 trucks moving material right now</p>
          </div>
          <span className="badge-success inline-flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live</span>
        </div>

        {/* Map mock */}
        <div className="relative h-64 bg-grad-mint">
          <div className="absolute inset-0 bg-grid opacity-50" />
          <svg viewBox="0 0 800 240" className="absolute inset-0 h-full w-full">
            <path d="M0 140 C 200 90, 380 200, 540 130 S 780 80, 800 140" stroke="#1A6B3C" strokeOpacity="0.25" strokeWidth="22" fill="none" />
            <path d="M0 80 C 240 60, 400 150, 600 90 S 800 60, 800 60" stroke="#D4A017" strokeOpacity="0.18" strokeWidth="14" fill="none" />
          </svg>
          {ROUTES.map((r, i) => (
            <div key={r.id} className="absolute" style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 3) * 22}%` }}>
              <div className="relative">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-charcoal shadow-lift">
                  <Truck size={14} />
                </div>
                <div className="absolute -inset-2 animate-pulseRing rounded-full bg-accent/20" />
              </div>
            </div>
          ))}
        </div>

        <table className="tbl">
          <thead>
            <tr><th>Route</th><th>From → To</th><th>Load</th><th>Driver / partner</th><th>Progress</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROUTES.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs font-bold text-primary">{r.id}</td>
                <td>
                  <div className="font-bold">{r.from}</div>
                  <div className="text-[11px] text-textgray">→ {r.to}</div>
                </td>
                <td className="font-mono">{r.load}</td>
                <td>
                  <div className="font-bold">{r.driver}</div>
                  <div className="text-[11px] text-textgray">{r.partner}</div>
                </td>
                <td className="min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-charcoal/8">
                      <div className="h-full rounded-full bg-grad-primary" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="font-mono text-xs">{r.progress}%</span>
                  </div>
                </td>
                <td><StatusPill status={r.status === "in-transit" ? "info" : "warning"} label={r.eta} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partners */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
          <h3 className="text-h4">Logistics partners</h3>
          <div className="flex-1" />
          <button className="btn-outline btn-sm"><Filter size={12} /> All types</button>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input h-9 pl-9 text-sm" placeholder="Search partners" />
          </div>
        </div>
        <table className="tbl">
          <thead><tr><th>Partner</th><th>Vehicle Info</th><th>Capacity</th><th>Status</th><th className="text-right">Action</th></tr></thead>
          <tbody>
            {(partners || []).map((p: any) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-grad-primary text-white"><Truck size={14} /></div>
                    <div>
                      <span className="font-bold">{p.user?.firstName} {p.user?.lastName}</span>
                      <div className="text-[10px] text-textgray">{p.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="font-mono text-xs">{p.vehicleType} · {p.vehicleRegNumber}</td>
                <td className="font-mono">{formatKg(p.capacityKg)}</td>
                <td><StatusPill status={p.isOnline ? "success" : "error"} label={p.isOnline ? "Online" : "Offline"} /></td>
                <td className="text-right">
                  <button className="btn-ghost btn-sm">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hubs */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
          <h3 className="text-h4">Processing Hubs</h3>
          <div className="flex-1" />
          <button className="btn-primary btn-sm"><Plus size={12} /> New Hub</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Hub Name</th><th>Address</th><th>Capacity</th><th>Activity</th><th className="text-right">Status</th></tr></thead>
          <tbody>
            {(hubs || []).map((h: any) => (
              <tr key={h.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-charcoal text-white"><Building2 size={14} /></div>
                    <span className="font-bold">{h.name}</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm">{h.address}</div>
                  <div className="text-[10px] text-textgray">{h.lga}, {h.state}</div>
                </td>
                <td className="font-mono">{formatKg(h.capacityKg)}</td>
                <td className="font-mono text-xs">{h.verificationCount || 0} drops</td>
                <td className="text-right">
                  <StatusPill status="success" label="Active" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
