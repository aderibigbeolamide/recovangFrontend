import { Battery, Building2, Camera, Check, Clock, Fuel, MapPin, Phone, Settings, ShieldCheck, Star, Thermometer, Wifi, Zap } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar, ProgressRing } from "@/components/charts";
import { useAgentHub } from "@/hooks/useAgent";
import { formatKg, formatNaira } from "@/lib/cn";
import { useState } from "react";
import { InviteAgentModal } from "@/components/InviteAgentModal";
import { CreateHubModal } from "@/components/CreateHubModal";

export default function AgentHub() {
  const { data: hub, isLoading, refetch } = useAgentHub();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  if (isLoading) return <div className="p-20 text-center font-bold">Loading hub details...</div>;
  
  if (!hub) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="h-20 w-20 rounded-3xl bg-cream flex items-center justify-center text-primary mb-6 shadow-sm">
            <Building2 size={40} />
        </div>
        <h2 className="text-2xl font-black">No Hub Found</h2>
        <p className="mt-2 text-textgray max-w-sm mx-auto leading-relaxed">
            It looks like you haven't set up your recycling hub yet. Let's get your business on the map!
        </p>
        <button onClick={() => setShowSetup(true)} className="btn-primary mt-8 px-10 py-4">Create My Hub Now</button>
        {showSetup && <CreateHubModal isOpen={showSetup} onClose={() => { setShowSetup(false); refetch(); }} />}
    </div>
  );

  const getCategoryColor = (slug: string) => {
    const colors: any = {
        'plastic-pet': '#1A6B3C',
        'paper-carton': '#D4A017',
        'aluminum-cans': '#E74C3C',
        'metal-iron': '#1C1C2E',
        'glass': '#3F9264'
    };
    return colors[slug] || '#A0A4AB';
  };

  return (
    <>
      <PageHeader
        eyebrow="My hub"
        title={hub.name}
        subtitle={`${hub.address} · Open today ${hub.openTime} · Operational since Aug 2024`}
        actions={
          <>
            <button className="btn-outline"><Settings size={14} /> Hub settings</button>
            <button className="btn-primary"><MapPin size={14} /> Update location</button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Hero card */}
        <div className="card-dark relative overflow-hidden p-7 lg:col-span-7">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-grad-mint opacity-15" />
          <div className="relative">
            <span className="badge-gold inline-flex items-center gap-1"><ShieldCheck size={11} /> Verified flagship</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold text-white">{hub.name}</h2>
            <p className="mt-2 text-white/70">{hub.address}, {hub.lga}, {hub.state}.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "4.9", l: "Rating", icon: Star },
                { v: hub.team.length * 40 + 52, l: "Active collectors", icon: Building2 },
                { v: `${Math.round((hub.currentLoadKg / hub.capacityKg) * 100)}%`, l: "Capacity used", icon: ProgressRing },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-mono text-2xl font-extrabold text-white">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {hub.openTime}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Phone size={12} /> +234 803 555 0182</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Wifi size={12} /> 4G + offline-first sync</span>
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="space-y-4 lg:col-span-5">
          <KPICard label="Today's intake" value={formatKg(hub.currentLoadKg)} sub="+ 18% vs avg" variant="primary" />
          <KPICard label="Today's commission" value={formatNaira(hub.team.reduce((acc: any, s: any) => acc + (s.today * 120), 0))} sub={`From ${hub.team.reduce((acc: any, s: any) => acc + s.today, 0)} verifications`} variant="gold" />
          <div className="card-gold p-5">
            <div className="flex items-center gap-3">
              <Thermometer size={18} className="text-charcoal" />
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal/70">Hub conditions</div>
                <div className="text-sm font-extrabold">Temp 31°C · Humidity 68%</div>
              </div>
              <span className="badge-success">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Staff */}
        <div className="card overflow-hidden lg:col-span-7">
          <div className="border-b border-bordergray p-6">
            <h3 className="text-h4">Hub team · {hub.team.length} members</h3>
            <p className="text-sm text-textgray">Today's activity at a glance</p>
          </div>
          <div className="divide-y divide-bordergray">
            {hub.team.map((s: any) => (
              <div key={s.name} className="flex items-center gap-4 px-6 py-4">
                <Avatar name={s.name} size={42} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold">{s.name}</span>
                    {s.you && <span className="badge bg-mint text-primary">You</span>}
                  </div>
                  <div className="text-xs text-textgray">{s.role} · {s.today} drops verified today</div>
                </div>
                <StatusPill
                  status={s.status === "online" ? "success" : s.status === "break" ? "warning" : "default"}
                  label={s.status === "online" ? "On duty" : s.status === "break" ? "On break" : "Off duty"}
                />
              </div>
            ))}
          </div>
          <button onClick={() => setShowInviteModal(true)} className="btn-ghost w-full justify-center border-t border-bordergray py-4 text-sm">+ Invite team member</button>
        </div>

        {/* Equipment */}
        <div className="card overflow-hidden lg:col-span-5">
          <div className="border-b border-bordergray p-6">
            <h3 className="text-h4">Equipment & systems</h3>
            <p className="text-sm text-textgray">Live status from connected devices</p>
          </div>
          <div className="divide-y divide-bordergray">
            {hub.equipment.map((e: any) => (
              <div key={e.id} className="flex items-center gap-3 px-6 py-3.5">
                <div className={`grid h-9 w-9 place-items-center rounded-xl bg-${e.color}-50 text-${e.color}`}>
                  <Zap size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{e.name}</div>
                  <div className="font-mono text-[11px] text-textgray">{e.id} · {e.last}</div>
                </div>
                <span className={`h-2 w-2 rounded-full bg-${e.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h3 className="text-h4">Storage capacity by material</h3>
        <p className="text-sm text-textgray">Ordered by fill level. Request pickup when above 85%.</p>
        <div className="mt-5 space-y-4">
          {hub.inventory.length === 0 ? (
              <div className="p-10 text-center text-textgray">No inventory recorded yet.</div>
          ) : hub.inventory.sort((a: any, b: any) => b.currentWeightKg - a.currentWeightKg).map((inv: any, i: number) => (
            <ProgressBar 
                key={i}
                label={`${inv.category} · ${formatKg(inv.currentWeightKg)}`} 
                value={inv.currentWeightKg} 
                max={Math.max(hub.capacityKg / 3, inv.currentWeightKg)} 
                color={getCategoryColor(inv.slug)} 
            />
          ))}
        </div>
      </div>
      {showInviteModal && <InviteAgentModal onClose={() => setShowInviteModal(false)} />}
    </>
  );
}
