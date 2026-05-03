import { useState } from "react";
import { AlertTriangle, Camera, Check, ChevronDown, Clock, Eye, Filter, Flag, MapPin, Scale, Search, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";
import { toast } from "react-hot-toast";

const FLAGS: any[] = [];


import { useFlaggedSubmissions, useReviewFraudAlert } from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";

const RISK_MAP: Record<string, { c: string; l: string }> = {
  high: { c: "error", l: "High risk" },
  medium: { c: "warning", l: "Medium risk" },
  low: { c: "info", l: "Low risk" },
};

export default function AdminFraud() {
  const { data: flagged, isLoading } = useFlaggedSubmissions();
  const { mutate: reviewAlert, isPending: isReviewing } = useReviewFraudAlert();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [hubFilter, setHubFilter] = useState<string>("all");

  const flags = Array.isArray(flagged) && flagged.length > 0 ? flagged.map((f: any) => {
    const user = f.user || f.submission?.collector?.user;
    const submission = f.submission;
    const items = submission?.items || [];
    const mainItem = items[0];
    
    return {
      id: f.id,
      drop: submission?.id?.slice(0, 8) || "N/A",
      risk: f.type === 'LARGE_SUBMISSION' || f.type === 'SUSPICIOUS_PHOTOS' ? 'high' : 'medium',
      reason: f.description,
      collector: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      hub: submission?.hub?.name || "N/A",
      agent: submission?.agent?.user ? `${submission.agent.user.firstName} ${submission.agent.user.lastName}` : (submission?.agent ? "System Agent" : "System"),
      cat: mainItem?.wasteCategory?.name || "Materials",
      weight: parseFloat(submission?.totalWeightKg || 0),
      payout: (submission?.totalAmount || 0), // Use as is, formatNaira will handle it
      time: f.createdAt ? new Date(f.createdAt).toLocaleTimeString() : "N/A",
      photos: submission?.photos || []
    };
  }).filter((f: any) => {
    const matchesRisk = riskFilter === "all" || f.risk === riskFilter;
    const matchesHub = hubFilter === "all" || f.hub === hubFilter;
    return matchesRisk && matchesHub;
  }) : []; // No fallback to mock FLAGS if we want real data

  // Extract unique hubs for the filter
  const uniqueHubs = Array.from(new Set(Array.isArray(flagged) ? flagged.map((f: any) => f.submission?.hub?.name).filter(Boolean) : []));

  const sel = flags.find((f: any) => f.id === (activeId || flags[0]?.id)) || flags[0];

  const handleReview = (action: "DISMISS" | "FREEZE" | "RESOLVE") => {
    if (!sel) return;
    
    const loadingToast = toast.loading("Processing security review...");
    
    reviewAlert({ id: sel.id, action }, {
      onSuccess: (data: any) => {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-bold">Action Recorded</span>
            <span className="text-xs opacity-80">The {action.toLowerCase()} decision is now live in the database and audit logs.</span>
          </div>,
          { duration: 5000 }
        );

        
        // Auto-select the next item if available
        const currentIndex = flags.findIndex((f: any) => f.id === sel.id);
        const nextItem = flags[currentIndex + 1] || flags[0];
        if (nextItem && nextItem.id !== sel.id) {
          setActiveId(nextItem.id);
        } else {
          setActiveId(null);
        }
      },
      onSettled: () => {
        toast.dismiss(loadingToast);
      }
    });
  };

  const openEvidence = () => {
    if (sel.photos?.length > 0) {
      setSelectedPhoto(sel.photos[0]);
    } else {
      toast("No photos attached to this submission");
    }
  };

  if (!sel) return null;
  return (
    <>
      <PageHeader
        eyebrow="Fraud queue"
        title="Trust & safety review"
        subtitle="ML-flagged drops awaiting human review. Approve to release payout. Reject to freeze. Always look at the photo evidence."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard 
          label="Open flags" 
          value={<span key={flags.length} className="animate-in zoom-in duration-300 inline-block">{flags.length}</span>} 
          sub={`${formatNaira(flags.reduce((acc: number, f: any) => acc + f.payout, 0))} on hold`} 
          icon={Flag} 
          variant="dark" 
        />
        <KPICard 
          label="High risk" 
          value={<span key={flags.filter((f: any) => f.risk === "high").length} className="animate-in zoom-in duration-300 inline-block">{flags.filter((f: any) => f.risk === "high").length}</span>} 
          sub="Action required" 
          icon={AlertTriangle} 
          variant="gold" 
        />
        <KPICard label="Avg time to decide" value="4h 12m" sub="Target: < 6h" icon={Clock} variant="primary" />
        <KPICard label="ML precision" value="91%" sub="Last 30 days" icon={Sparkles} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Queue */}
        <div className="lg:col-span-5">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-bordergray bg-cream/40 p-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-bordergray rounded-lg px-3 py-1 pr-8 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-primary"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="all">All risks</option>
                  <option value="high">High risk</option>
                  <option value="medium">Medium risk</option>
                  <option value="low">Low risk</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-textgray">
                  <ChevronDown size={10} />
                </div>
              </div>

              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-bordergray rounded-lg px-3 py-1 pr-8 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-primary"
                  value={hubFilter}
                  onChange={(e) => setHubFilter(e.target.value)}
                >
                  <option value="all">All hubs</option>
                  {uniqueHubs.map(hub => (
                    <option key={hub} value={hub}>{hub}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-textgray">
                  <ChevronDown size={10} />
                </div>
              </div>
              <div className="flex-1" />
              <span className="badge bg-error-50 text-error">{flags.length}</span>
            </div>
            {isLoading ? (
              <div className="p-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : flags.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-mint-50 flex items-center justify-center text-mint mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-extrabold text-charcoal">All clear</h3>
                <p className="text-xs text-textgray mt-1">No pending fraud alerts found.</p>
              </div>
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
                {sel.photos && sel.photos.length > 0 ? (
                  sel.photos.map((url: string, i: number) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-xl overflow-hidden border border-bordergray group relative cursor-pointer"
                      onClick={() => setSelectedPhoto(url)}
                    >
                      <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="p-2 bg-white rounded-lg text-primary"><Eye size={16} /></div>
                      </div>
                    </div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-grad-mint grid place-items-center">
                      <Camera size={20} className="text-primary/60" />
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <Evidence label="Hub-scale weight" value={`${sel.weight} kg`} icon={Scale} />
                <Evidence label="Geo distance" value="0.3 km from hub" icon={MapPin} />
                <Evidence label="Auto-trigger" value="Weight × ratio" icon={Zap} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="btn-outline" onClick={openEvidence}><Eye size={14} /> Open full evidence</button>
                <button 
                  className="btn-ghost" 
                  onClick={() => handleReview("RESOLVE")}
                  disabled={isReviewing}
                >
                  {isReviewing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" /> : <Flag size={14} />}
                  Escalate
                </button>
                <div className="flex-1" />
                <button 
                  className="btn-outline text-error border-error/30 hover:bg-error/5"
                  onClick={() => handleReview("FREEZE")}
                  disabled={isReviewing}
                >
                  {isReviewing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-error border-t-transparent mr-2" /> : <X size={14} />}
                  Reject & freeze account
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleReview("DISMISS")}
                  disabled={isReviewing}
                >
                  {isReviewing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" /> : <Check size={14} />}
                  Approve & release {formatNaira(sel.payout)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute right-6 top-6 text-white hover:scale-110 transition-transform">
            <X size={32} />
          </button>
          <img 
            src={selectedPhoto} 
            alt="Full Evidence" 
            className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
