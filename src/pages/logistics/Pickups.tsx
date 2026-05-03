import { useState } from "react";
import { Calendar, Check, Clock, Filter, MapPin, Navigation, Package, Phone, Plus, Route, Search, Truck, X } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const TABS = [
  { id: "open", label: "Available", key: "open" },
  { id: "active", label: "In progress", key: "active" },
  { id: "done", label: "Completed", key: "done" },
];

import { useLogisticsDashboard, useAcceptPickup } from "@/hooks/useLogistics";
import { PickupDetailDrawer } from "@/components/PickupDetailDrawer";

export default function LogisticsPickups() {
  const [tab, setTab] = useState("open");
  const [selectedPickup, setSelectedPickup] = useState<any | null>(null);
  
  const { data, isLoading } = useLogisticsDashboard();
  const { mutate: acceptPickup, isPending: isAccepting } = useAcceptPickup();

  if (isLoading || !data) return <div className="p-20 text-center font-bold">Loading pickups...</div>;

  const list = data.pickups[tab] || [];
  
  return (
    <>
      <PickupDetailDrawer 
        open={!!selectedPickup} 
        onClose={() => setSelectedPickup(null)} 
        pickup={selectedPickup} 
      />
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
        <KPICard label="Available now" value={data.pickups.open.length} sub="Real-time demand" />
        <KPICard label="In progress" value={data.pickups.active.length} sub="Materials in transit" variant="primary" />
        <KPICard label="Today's revenue" value={formatNaira(data.stats.revenue)} sub="Total earnings" variant="gold" />
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
                {t.label} <span className={`ml-1 rounded-full px-1.5 ${tab === t.id ? "bg-white/15 text-white" : "bg-charcoal/8 text-charcoal"}`}>{data.pickups[t.id]?.length || 0}</span>
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
            <div 
              key={p.fullId} 
              onClick={() => setSelectedPickup(p)}
              className="grid gap-4 p-6 lg:grid-cols-12 cursor-pointer hover:bg-cream/20 transition-colors"
            >
              <div className="lg:col-span-7">
                <div className="flex items-start gap-4">
                  <CategoryIcon category={p.cat} size={48} />
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

                {p.progress !== undefined && p.progress > 0 && (
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
                <div className="flex flex-wrap justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  {tab === "open" && (
                    <>
                      <button className="btn-outline btn-sm"><X size={12} /> Skip</button>
                      <button 
                        onClick={() => acceptPickup(p.fullId)}
                        disabled={isAccepting}
                        className="btn-primary btn-sm"
                      >
                        {isAccepting ? "Accepting..." : <><Check size={12} /> Accept pickup</>}
                      </button>
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
