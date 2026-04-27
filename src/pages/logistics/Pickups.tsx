import { useState } from "react";
import { Calendar, Check, Clock, Filter, MapPin, Navigation, Package, Phone, Plus, Route, Search, Truck, X } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const TABS = [
  { id: "open", label: "Available", count: 4 },
  { id: "active", label: "In progress", count: 3 },
  { id: "done", label: "Completed", count: 28 },
];

const PICKUPS: any = {
  open: [
    { id: "PK-2424", origin: "Mushin Hub", dest: "Ikorodu Recycler", weight: "1.8t", cat: "PET", km: 32, fee: 7800, window: "Today · 14:00 – 16:00", urgent: true },
    { id: "PK-2423", origin: "Apapa Hub", dest: "Apapa Port", weight: "3.2t", cat: "Cardboard", km: 8, fee: 4200, window: "Today · 16:00 – 18:00" },
    { id: "PK-2422", origin: "Ikeja Hub", dest: "Ikorodu Recycler", weight: "0.9t", cat: "Aluminium", km: 41, fee: 9600, window: "Tomorrow · 09:00 – 11:00" },
    { id: "PK-2421", origin: "Festac Hub", dest: "Ikorodu Recycler", weight: "2.4t", cat: "Glass", km: 38, fee: 8800, window: "Tomorrow · 12:00 – 14:00" },
  ],
  active: [
    { id: "PK-2419", origin: "Surulere Hub", dest: "Ikorodu Recycler", weight: "1.2t", cat: "PET", km: 28, fee: 6800, window: "ETA 27 min", driver: "Suleiman M.", vehicle: "LG-LD221", progress: 64 },
    { id: "PK-2417", origin: "Yaba Centre", dest: "Apapa Port", weight: "2.4t", cat: "Cardboard", km: 14, fee: 5200, window: "ETA 1h 12m", driver: "Femi A.", vehicle: "LG-AP118", progress: 32 },
    { id: "PK-2415", origin: "Lekki Hub", dest: "Ikorodu Recycler", weight: "0.8t", cat: "Aluminium", km: 22, fee: 7400, window: "Loading", driver: "Bashir O.", vehicle: "LG-IK402", progress: 8 },
  ],
  done: [
    { id: "PK-2410", origin: "Surulere Hub", dest: "Ikorodu Recycler", weight: "2.2t", cat: "PET", km: 28, fee: 7400, window: "Apr 23 · Completed 16:42", driver: "Suleiman M." },
    { id: "PK-2408", origin: "Yaba Centre", dest: "Apapa Port", weight: "1.8t", cat: "Cardboard", km: 14, fee: 4800, window: "Apr 23 · Completed 13:18" },
    { id: "PK-2402", origin: "Lekki Hub", dest: "Ikorodu Recycler", weight: "1.4t", cat: "Aluminium", km: 22, fee: 8200, window: "Apr 22 · Completed 17:55" },
  ],
};

export default function LogisticsPickups() {
  const [tab, setTab] = useState("open");
  const list = PICKUPS[tab];
  return (
    <>
      <PageHeader
        eyebrow="Pickups"
        title="Pickup marketplace"
        subtitle="Accept pickups, dispatch trucks and track them to delivery. ₦35–₦65 per km plus ₦15 per kilo above 1.5t."
        actions={
          <>
            <button className="btn-outline"><Calendar size={14} /> Schedule</button>
            <button className="btn-primary"><Plus size={14} /> Manual pickup</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Available now" value="4" sub="₦30,400 potential" />
        <KPICard label="In progress" value="3" sub="14.2t in transit" variant="primary" />
        <KPICard label="Completed today" value="9" sub={formatNaira(248400) + " earned"} variant="gold" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-charcoal text-white" : "text-textgray hover:bg-white"}`}
              >
                {t.label} <span className={`ml-1 rounded-full px-1.5 ${tab === t.id ? "bg-white/15 text-white" : "bg-charcoal/8 text-charcoal"}`}>{t.count}</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="btn-outline btn-sm"><Filter size={12} /> All materials</button>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input h-9 pl-9 text-sm" placeholder="Search pickups" />
          </div>
        </div>

        <div className="divide-y divide-bordergray">
          {list.map((p: any) => (
            <div key={p.id} className="grid gap-4 p-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-start gap-4">
                  <CategoryIcon category={p.cat === "PET" ? "PET Plastic" : p.cat === "Cardboard" ? "Cardboard" : p.cat} size={48} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{p.id}</span>
                      {p.urgent && <span className="badge bg-error-50 text-error">Urgent</span>}
                      <span className="badge bg-cream text-charcoal/70">{p.cat}</span>
                    </div>
                    <h3 className="mt-1 text-h4">{p.origin} → {p.dest}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-textgray">
                      <span><Package size={11} className="mr-1 inline" /> {p.weight}</span>
                      <span><Route size={11} className="mr-1 inline" /> {p.km} km</span>
                      <span><Clock size={11} className="mr-1 inline" /> {p.window}</span>
                    </div>
                  </div>
                </div>

                {p.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-textgray">
                      <span>Driver: {p.driver} · {p.vehicle}</span>
                      <span className="font-mono text-charcoal">{p.progress}% complete</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-charcoal/8">
                      <div className="h-full rounded-full bg-grad-primary" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-stretch justify-between gap-3 lg:col-span-5 lg:items-end">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Payout</div>
                  <div className="font-mono text-2xl font-extrabold text-primary">{formatNaira(p.fee)}</div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {tab === "open" && (
                    <>
                      <button className="btn-outline btn-sm"><X size={12} /> Skip</button>
                      <button className="btn-primary btn-sm"><Check size={12} /> Accept pickup</button>
                    </>
                  )}
                  {tab === "active" && (
                    <>
                      <button className="btn-outline btn-sm"><Phone size={12} /> Call driver</button>
                      <button className="btn-primary btn-sm"><Navigation size={12} /> Live tracking</button>
                    </>
                  )}
                  {tab === "done" && (
                    <>
                      <button className="btn-ghost btn-sm">View receipt</button>
                      <span className="badge-success">Paid</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
