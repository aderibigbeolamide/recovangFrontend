import { useState } from "react";
import { AlertTriangle, Camera, Check, ChevronDown, Clock, Eye, Filter, Flag, MapPin, Scale, Search, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const FLAGS = [
  { id: "FR-2419", drop: "RX-2419", risk: "high", reason: "Weight 240% above scale capacity for 4 photos shown", collector: "Anonymous user 28482", hub: "Lekki Hub", agent: "Folake A.", cat: "PET Bottles", weight: 18.4, payout: 3680, time: "2 mins ago" },
  { id: "FR-2418", drop: "RX-2418", risk: "high", reason: "Same hub, same collector, 14 drops in 12 minutes", collector: "Tunde Bello", hub: "Yaba Centre", agent: "Tope D.", cat: "Cardboard", weight: 6.0, payout: 480, time: "8 mins ago" },
  { id: "FR-2417", drop: "RX-2417", risk: "medium", reason: "Photos appear duplicated from drop RX-2402", collector: "Maryam Sani", hub: "Surulere Hub", agent: "Bola A.", cat: "Aluminium Cans", weight: 1.8, payout: 1080, time: "27 mins ago" },
  { id: "FR-2416", drop: "RX-2416", risk: "medium", reason: "Geo location 12km from registered hub coordinates", collector: "Joy Eze", hub: "Surulere Hub", agent: "Bola A.", cat: "Mixed Paper", weight: 3.4, payout: 204, time: "41 mins ago" },
  { id: "FR-2415", drop: "RX-2415", risk: "low", reason: "First-time collector, large initial drop", collector: "Anonymous user 28491", hub: "Apapa Hub", agent: "Sola K.", cat: "Glass Bottles", weight: 22.4, payout: 672, time: "1h ago" },
  { id: "FR-2414", drop: "RX-2414", risk: "high", reason: "Account age 4 minutes, drop weight 9.2kg", collector: "Anonymous user 28492", hub: "Ikeja Hub", agent: "Wale T.", cat: "PET Bottles", weight: 9.2, payout: 1840, time: "1h 12m ago" },
  { id: "FR-2413", drop: "RX-2413", risk: "medium", reason: "E-Waste with no serial-number photo", collector: "Chinedu Okeke", hub: "Surulere Hub", agent: "Femi O.", cat: "E-Waste", weight: 0.8, payout: 960, time: "2h ago" },
  { id: "FR-2412", drop: "RX-2412", risk: "low", reason: "Multiple identity-verification retries", collector: "Wale Aboderin", hub: "Yaba Centre", agent: "Tope D.", cat: "PET Bottles", weight: 4.4, payout: 880, time: "2h 30m ago" },
  { id: "FR-2411", drop: "RX-2411", risk: "high", reason: "ML model: 92% probability synthetic photo", collector: "Anonymous user 28488", hub: "Lekki Hub", agent: "Folake A.", cat: "Aluminium Cans", weight: 4.6, payout: 2760, time: "3h ago" },
];

import { useFlaggedSubmissions } from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";

const RISK_MAP: Record<string, { c: string; l: string }> = {
  high: { c: "error", l: "High risk" },
  medium: { c: "warning", l: "Medium risk" },
  low: { c: "info", l: "Low risk" },
};

export default function AdminFraud() {
  const { data: flagged, isLoading } = useFlaggedSubmissions();
  const [activeId, setActiveId] = useState<string | null>(null);

  const flags = Array.isArray(flagged) && flagged.length > 0 ? flagged : [
    { id: "FR-2419", drop: "RX-2419", risk: "high", reason: "Weight 240% above scale capacity for 4 photos shown", collector: "Anonymous user 28482", hub: "Lekki Hub", agent: "Folake A.", cat: "PET Bottles", weight: 18.4, payout: 3680, time: "2 mins ago" },
    { id: "FR-2418", drop: "RX-2418", risk: "high", reason: "Same hub, same collector, 14 drops in 12 minutes", collector: "Tunde Bello", hub: "Yaba Centre", agent: "Tope D.", cat: "Cardboard", weight: 6.0, payout: 480, time: "8 mins ago" },
  ];

  const sel = flags.find((f: any) => f.id === (activeId || flags[0]?.id)) || flags[0];

  if (!sel) return null;
  return (
    <>
      <PageHeader
        eyebrow="Fraud queue"
        title="Trust & safety review"
        subtitle="ML-flagged drops awaiting human review. Approve to release payout. Reject to freeze. Always look at the photo evidence."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Open flags" value="9" sub="₦12,536 on hold" icon={Flag} variant="dark" />
        <KPICard label="High risk" value="4" sub="Action required" icon={AlertTriangle} variant="gold" />
        <KPICard label="Avg time to decide" value="4h 12m" sub="Target: < 6h" icon={Clock} variant="primary" />
        <KPICard label="ML precision" value="91%" sub="Last 30 days" icon={Sparkles} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Queue */}
        <div className="lg:col-span-5">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-bordergray bg-cream/40 p-3">
              <button className="btn-outline btn-sm"><Filter size={11} /> All risks</button>
              <button className="btn-outline btn-sm">All hubs <ChevronDown size={11} /></button>
              <div className="flex-1" />
              <span className="badge bg-error-50 text-error">{flags.length}</span>
            </div>
            {isLoading ? (
              <div className="p-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : (
              <div className="divide-y divide-bordergray max-h-[640px] overflow-auto">
                {flags.map((f: any) => {
                  const r = RISK_MAP[f.risk] || RISK_MAP.low;
                  const isActive = sel?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveId(f.id)}
                      className={`flex w-full items-start gap-3 p-4 text-left transition ${isActive ? "bg-mint/40 border-l-4 border-l-primary" : "hover:bg-cream border-l-4 border-l-transparent"}`}
                    >
                      <CategoryIcon category={f.cat} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-primary">{f.id}</span>
                          <span className={`badge bg-${r.c}-50 text-${r.c}`}>{r.l}</span>
                        </div>
                        <div className="mt-1 truncate text-sm font-extrabold">{f.collector}</div>
                        <div className="mt-1 line-clamp-2 text-[11px] text-textgray">{f.reason}</div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-textgray">
                          <span>{f.hub}</span>
                          <span>{f.time}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-7">
          <div className="card overflow-hidden">
            <div className="border-b border-bordergray bg-cream/40 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{sel.id}</span>
                    <span className={`badge bg-${RISK_MAP[sel.risk].c}-50 text-${RISK_MAP[sel.risk].c} inline-flex items-center gap-1`}>
                      <AlertTriangle size={11} /> {RISK_MAP[sel.risk].l}
                    </span>
                  </div>
                  <h3 className="mt-2 text-h3">{sel.cat} · {sel.weight}kg drop</h3>
                  <p className="mt-1 text-sm text-textgray">Drop {sel.drop} at {sel.hub} verified by {sel.agent}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Payout on hold</div>
                  <div className="font-mono text-2xl font-extrabold text-warning">{formatNaira(sel.payout)}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div className="rounded-2xl bg-cream p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={sel.collector} size={42} />
                  <div className="flex-1">
                    <div className="font-extrabold">{sel.collector}</div>
                    <div className="text-[11px] text-textgray">Account · 47d old · 3 prior flags</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-cream p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-grad-primary text-white"><MapPin size={16} /></div>
                  <div className="flex-1">
                    <div className="font-extrabold">{sel.hub}</div>
                    <div className="text-[11px] text-textgray">Verified by {sel.agent}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-2xl border-l-4 border-l-error bg-error-50 p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-error">
                  <AlertTriangle size={12} /> Why flagged
                </div>
                <p className="mt-2 text-sm font-bold text-charcoal">{sel.reason}</p>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-grad-mint grid place-items-center">
                    <Camera size={20} className="text-primary/60" />
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <Evidence label="Hub-scale weight" value={`${sel.weight} kg`} icon={Scale} />
                <Evidence label="Geo distance" value="0.3 km from hub" icon={MapPin} />
                <Evidence label="Auto-trigger" value="Weight × ratio" icon={Zap} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="btn-outline"><Eye size={14} /> Open full evidence</button>
                <button className="btn-ghost"><Flag size={14} /> Escalate</button>
                <div className="flex-1" />
                <button className="btn-outline text-error border-error/30 hover:bg-error/5"><X size={14} /> Reject & freeze account</button>
                <button className="btn-primary"><Check size={14} /> Approve & release ₦{formatNumber(sel.payout)}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Evidence({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-bordergray bg-white p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-textgray">
        <Icon size={11} className="text-primary" /> {label}
      </div>
      <div className="mt-1 font-mono text-sm font-extrabold text-charcoal">{value}</div>
    </div>
  );
}
