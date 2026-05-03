import { X, MapPin, Truck, Calendar, Package, Route, Clock, ShieldCheck, Camera, Phone, Navigation } from "lucide-react";
import { formatNaira } from "@/lib/cn";
import { StatusPill } from "./ui";
import { LogisticsMap } from "./LogisticsMap";

interface PickupDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  pickup: any | null;
}

export function PickupDetailDrawer({ open, onClose, pickup }: PickupDetailDrawerProps) {
  if (!pickup) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-[100] w-full max-w-xl bg-white shadow-2xl transition-transform duration-500 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bordergray bg-cream/30 p-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-charcoal tracking-tight">Trip Audit</h2>
              <StatusPill status={pickup.status === "completed" ? "success" : "pending"} label={pickup.status} />
            </div>
            <p className="text-xs font-bold text-textgray mt-1 uppercase tracking-widest">{pickup.id} · {pickup.cat}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Live Map Section */}
          <div className="rounded-[2rem] overflow-hidden border border-bordergray shadow-soft h-64 bg-cream/10 relative">
             <LogisticsMap 
                routes={[{
                    id: pickup.id,
                    hub: { lat: 6.5, lng: 3.3 }, // Placeholder for real origin
                    partner: { currentLat: 6.52, currentLng: 3.38 } // Placeholder for real truck
                }]} 
                hubs={[]} 
             />
             <div className="absolute top-4 left-4 badge bg-white/90 backdrop-blur-sm text-primary flex items-center gap-2 shadow-sm">
                <Navigation size={12} className="animate-pulse" /> Live Tracking Active
             </div>
          </div>

          {/* Route Info */}
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-textgray">From Hub</div>
                <div className="font-extrabold flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {pickup.origin}
                </div>
             </div>
             <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-textgray">To Factory</div>
                <div className="font-extrabold flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    {pickup.dest}
                </div>
             </div>
          </div>

          <div className="h-px bg-dashed border-t border-dashed border-bordergray" />

          {/* Load & Vehicle Details */}
          <div className="grid grid-cols-3 gap-4">
            <DataCard icon={Package} label="Load Weight" value={pickup.weight} />
            <DataCard icon={Truck} label="Vehicle" value={pickup.vehicle} />
            <DataCard icon={Route} label="Distance" value={`${pickup.km} km`} />
          </div>

          {/* Financials */}
          <div className="rounded-3xl bg-charcoal p-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-accent/80">Estimated Payout</div>
                    <div className="mt-1 text-3xl font-black tracking-tight">{formatNaira(pickup.fee)}</div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-accent" />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-white/50 leading-relaxed uppercase tracking-widest">
                Escrow Secured · Verified by Smart Contract
            </div>
          </div>

          {/* POD Photos */}
          <div className="space-y-4">
            <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-charcoal">
                <Camera size={16} /> Proof of Delivery (POD)
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video rounded-2xl bg-cream border border-bordergray flex items-center justify-center text-xs text-textgray font-bold italic">
                    Loading photo pending...
                </div>
                <div className="aspect-video rounded-2xl bg-cream border border-bordergray flex items-center justify-center text-xs text-textgray font-bold italic">
                    Unloading photo pending...
                </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-bordergray p-6 bg-cream/20 flex gap-3">
          <button className="btn-outline flex-1 gap-2"><Phone size={16} /> Contact Dispatch</button>
          <button className="btn-primary flex-1 gap-2">Full Analytics</button>
        </div>
      </div>
    </div>
  );
}

function DataCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-bordergray p-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-mint text-primary">
        <Icon size={16} />
      </div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-textgray">{label}</div>
      <div className="mt-0.5 font-extrabold text-charcoal">{value}</div>
    </div>
  );
}
