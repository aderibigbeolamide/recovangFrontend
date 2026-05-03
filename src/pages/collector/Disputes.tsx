import { AlertTriangle, ArrowRight, Camera, CheckCircle2, Clock, FileWarning, MessageCircle, Plus, Scale, X } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { useState } from "react";
import { formatNaira } from "@/lib/cn";

const DISPUTES = [
  {
    id: "DSP-1042",
    drop: "RX-2318",
    date: "Apr 04, 2026",
    hub: "Yaba Centre",
    agent: "Tope D.",
    cat: "Cardboard",
    claimedKg: 6.2,
    recordedKg: 4.0,
    diff: 176,
    status: "open",
    reply: "We've received your dispute. Our ops team is reviewing the photo and weighing receipt. Expect a decision by tomorrow.",
    replyAt: "5h ago",
  },
  {
    id: "DSP-1029",
    drop: "RX-2271",
    date: "Mar 21, 2026",
    hub: "Surulere Hub",
    agent: "Bola A.",
    cat: "PET Bottles",
    claimedKg: 5.4,
    recordedKg: 3.8,
    diff: 320,
    status: "won",
    reply: "Resolution: weighing scale was 0.6kg under-calibrated. We've credited the difference plus a ₦100 apology.",
    replyAt: "2d ago",
  },
  {
    id: "DSP-1014",
    drop: "RX-2204",
    date: "Mar 11, 2026",
    hub: "Surulere Hub",
    agent: "Bola A.",
    cat: "Aluminium Cans",
    claimedKg: 1.4,
    recordedKg: 1.1,
    diff: 180,
    status: "lost",
    reply: "Resolution: photo evidence shows wet drink residue inflated your home-scale reading. Hub scale was correct.",
    replyAt: "5d ago",
  },
];

const STATUS_MAP: Record<string, { color: string; label: string; icon: any }> = {
  PENDING: { color: "warning", label: "Under review", icon: Clock },
  RESOLVED: { color: "success", label: "Resolved · adjusted", icon: CheckCircle2 },
  DISMISSED: { color: "error", label: "Closed · upheld", icon: X },
  // Legacy mock support
  open: { color: "warning", label: "Under review", icon: Clock },
  won: { color: "success", label: "Resolved · adjusted", icon: CheckCircle2 },
  lost: { color: "error", label: "Closed · upheld", icon: X },
};

import { useDisputes, useSubmissions, useDisputeSubmission } from "@/hooks/useCollector";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function CollectorDisputes() {
  const { data: disputes, isLoading: loadingDisputes } = useDisputes();
  const { data: submissions, isLoading: loadingSubs } = useSubmissions();
  const createDispute = useDisputeSubmission();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newReason, setNewReason] = useState("");
  const [selectedSubId, setSelectedSubId] = useState("");

  const activeDispute = disputes?.find((d: any) => d.id === activeId) || disputes?.[0];

  useEffect(() => {
    if (disputes?.length > 0 && !activeId) {
      setActiveId(disputes[0].id);
    }
  }, [disputes]);

  const handleCreate = async () => {
    if (!selectedSubId) return toast.error("Please select a submission");
    if (!newReason) return toast.error("Please provide a reason");

    try {
      await createDispute.mutateAsync({ submissionId: selectedSubId, reason: newReason });
      toast.success("Dispute raised successfully");
      setShowNew(false);
      setNewReason("");
      setSelectedSubId("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to raise dispute");
    }
  };

  const eligibleSubmissions = submissions?.filter((s: any) => 
    s.status === "VERIFIED" && s.disputeStatus === "NONE"
  ) || [];

  if (loadingDisputes || loadingSubs) return <div className="p-20 text-center font-bold">Loading disputes...</div>;

  return (
    <>
      <PageHeader
        eyebrow="Disputes"
        title="Disagree with a drop?"
        subtitle="Raise a dispute within 14 days. Our ops team reviews photo, scale and timestamp evidence — usually within 4 hours."
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={14} /> New dispute</button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Open" value={disputes?.filter((d: any) => d.disputeStatus === 'PENDING').length || 0} sub="Under review" icon={Clock} variant="default" />
        <KPICard label="Resolved" value={disputes?.filter((d: any) => d.disputeStatus === 'RESOLVED').length || 0} sub="In your favour" icon={CheckCircle2} variant="primary" />
        <KPICard label="Total" value={disputes?.length || 0} sub="Lifetime disputes" icon={Scale} variant="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* List */}
        <div className="space-y-3 lg:col-span-5">
          {disputes?.map((d: any) => {
            const s = STATUS_MAP[d.disputeStatus] || STATUS_MAP.PENDING;
            return (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`card w-full p-5 text-left transition ${activeId === d.id ? "border-primary ring-4 ring-primary/10" : "hover:border-primary/40"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs font-bold text-primary">{d.id.slice(0, 8).toUpperCase()}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryIcon category={d.items[0]?.wasteCategory?.name || "Mixed"} size={26} />
                      <span className="text-sm font-extrabold">{d.items[0]?.wasteCategory?.name || "Mixed"}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-textgray">Drop #{d.id.slice(0, 4)} · {new Date(d.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge bg-${s.color}-50 text-${s.color}`}>{s.label}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-bordergray pt-3 text-xs">
                  <span className="text-textgray">Total Recorded</span>
                  <span className="font-mono font-extrabold">{d.totalWeightKg} kg</span>
                </div>
              </button>
            );
          })}
          {(!disputes || disputes.length === 0) && (
            <div className="p-10 text-center card border-dashed text-textgray">
              No disputes raised yet.
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-7">
          {activeDispute ? (
            <div className="card overflow-hidden animate-lift">
              <div className="flex items-start justify-between border-b border-bordergray bg-cream/40 p-6">
                <div>
                  <div className="font-mono text-xs font-bold text-primary">{activeDispute.id.slice(0, 8).toUpperCase()}</div>
                  <h3 className="mt-1 text-h3">{activeDispute.items[0]?.wasteCategory?.name || "Mixed Waste"} · {activeDispute.totalWeightKg} kg</h3>
                  <div className="mt-1 text-sm text-textgray">{activeDispute.hub?.name || "Mobile Agent"} · {new Date(activeDispute.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`badge bg-${STATUS_MAP[activeDispute.disputeStatus]?.color}-50 text-${STATUS_MAP[activeDispute.disputeStatus]?.color} inline-flex items-center gap-1`}>
                  <AlertTriangle size={11} /> {STATUS_MAP[activeDispute.disputeStatus]?.label}
                </span>
              </div>

              <div className="p-6">
                <div className="rounded-2xl bg-cream p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Your reason</div>
                  <p className="mt-1 text-sm text-charcoal">{activeDispute.disputeReason}</p>
                </div>
              </div>

              <div className="border-t border-bordergray p-6">
                <div className="flex items-start gap-3">
                  <Avatar name="Recovang Ops" size={36} />
                  <div className="flex-1 rounded-2xl bg-cream p-4">
                    <div className="text-xs font-bold text-primary">Recovang Operations</div>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal">
                      {activeDispute.disputeStatus === 'PENDING' 
                        ? "We've received your dispute. Our ops team is reviewing the records. Expect a decision shortly."
                        : activeDispute.disputeStatus === 'RESOLVED'
                        ? "Resolution: We've verified your claim and adjusted your balance accordingly."
                        : "Resolution: Hub records were found to be accurate. Dispute dismissed."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center p-20 text-center text-textgray">
              <FileWarning size={48} className="mb-4 opacity-20" />
              <p>Select a dispute to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-lg p-8 animate-lift">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3">New Dispute</h3>
              <button onClick={() => setShowNew(false)} className="text-textgray hover:text-charcoal"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-textgray">Select Submission</label>
                <select 
                  className="input mt-1 w-full"
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                >
                  <option value="">Choose a verified drop...</option>
                  {eligibleSubmissions.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      #{s.id.slice(0, 6).toUpperCase()} · {new Date(s.createdAt).toLocaleDateString()} · {s.totalWeightKg}kg
                    </option>
                  ))}
                </select>
                {eligibleSubmissions.length === 0 && (
                  <p className="mt-1 text-[11px] text-error">No verified submissions available to dispute.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-textgray">Reason for dispute</label>
                <textarea 
                  className="input mt-1 w-full min-h-[100px] py-3"
                  placeholder="e.g. The weight recorded was 2kg less than what I weighed at home..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                />
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Important:</strong> Our team will review the scale calibration logs and hub photos for this drop. Intentional false claims may lead to account flags.
                </p>
              </div>

              <button 
                onClick={handleCreate}
                disabled={!selectedSubId || !newReason || createDispute.isPending}
                className="btn-primary w-full py-4 text-base mt-4"
              >
                {createDispute.isPending ? "Submitting..." : "Submit Dispute Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-grad-gold-soft" : "bg-cream"}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">{label}</div>
      <div className={`mt-1 font-mono text-xl font-extrabold ${highlight ? "text-accent-700" : "text-charcoal"}`}>{value}</div>
    </div>
  );
}
