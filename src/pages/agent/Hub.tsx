import { Battery, Building2, Camera, Check, Clock, Fuel, MapPin, Phone, Settings, ShieldCheck, Star, Thermometer, Wifi, Zap } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar, ProgressRing } from "@/components/charts";

const STAFF = [
  { name: "Bola Akande", role: "Lead agent (you)", you: true, status: "online", today: 184 },
  { name: "Femi Olu", role: "Junior agent", status: "online", today: 76 },
  { name: "Ngozi Eze", role: "Junior agent", status: "break", today: 42 },
  { name: "Ibrahim Lawal", role: "Loader", status: "offline", today: 0 },
];

const EQUIPMENT = [
  { name: "Calibrated scale #1", id: "SC-2018", status: "online", last: "Calibrated 14d ago", color: "success" },
  { name: "Calibrated scale #2", id: "SC-2019", status: "online", last: "Calibrated 14d ago", color: "success" },
  { name: "Compactor", id: "CP-0112", status: "online", last: "Service due in 12d", color: "warning" },
  { name: "POS / printer", id: "PR-441", status: "offline", last: "Last seen 2h ago", color: "error" },
  { name: "Solar inverter", id: "IV-220", status: "online", last: "Battery 88%", color: "success" },
];

export default function AgentHub() {
  return (
    <>
      <PageHeader
        eyebrow="My hub"
        title="Surulere Flagship Hub"
        subtitle="12 Bode Thomas, Surulere · Open today 7am – 7pm · Operational since Aug 2024"
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
            <h2 className="mt-4 font-display text-4xl font-extrabold text-white">Surulere Flagship Hub</h2>
            <p className="mt-2 text-white/70">12 Bode Thomas Street, opposite the Methodist Cathedral.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "4.9", l: "Rating", icon: Star },
                { v: "412", l: "Active collectors", icon: Building2 },
                { v: "78%", l: "Capacity used", icon: ProgressRing },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-mono text-2xl font-extrabold text-white">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1"><Clock size={12} /> 7am – 7pm</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Phone size={12} /> +234 803 555 0182</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Wifi size={12} /> 4G + offline-first sync</span>
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="space-y-4 lg:col-span-5">
          <KPICard label="Today's intake" value="642 kg" sub="+ 18% vs avg" variant="primary" />
          <KPICard label="Today's commission" value="₦14,820" sub="From 184 verifications" variant="gold" />
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
            <h3 className="text-h4">Hub team · 4 members</h3>
            <p className="text-sm text-textgray">Today's activity at a glance</p>
          </div>
          <div className="divide-y divide-bordergray">
            {STAFF.map((s) => (
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
          <button className="btn-ghost w-full justify-center border-t border-bordergray py-4 text-sm">+ Invite team member</button>
        </div>

        {/* Equipment */}
        <div className="card overflow-hidden lg:col-span-5">
          <div className="border-b border-bordergray p-6">
            <h3 className="text-h4">Equipment & systems</h3>
            <p className="text-sm text-textgray">Live status from connected devices</p>
          </div>
          <div className="divide-y divide-bordergray">
            {EQUIPMENT.map((e) => (
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
          <ProgressBar label="PET Plastic · 942 / 1,000 kg" value={942} max={1000} color="#E74C3C" />
          <ProgressBar label="Cardboard · 684 / 800 kg" value={684} max={800} color="#D4A017" />
          <ProgressBar label="Aluminium · 318 / 500 kg" value={318} max={500} color="#1A6B3C" />
          <ProgressBar label="Mixed paper · 264 / 600 kg" value={264} max={600} color="#1C1C2E" />
          <ProgressBar label="Glass · 210 / 1,200 kg" value={210} max={1200} color="#3F9264" />
        </div>
      </div>
    </>
  );
}
