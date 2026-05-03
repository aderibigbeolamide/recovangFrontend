import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Camera, Check, ChevronRight, QrCode, Scale, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { Avatar, PageHeader } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";
import { useAgentDashboard, usePendingSubmissions, useVerifySubmission, useRejectSubmission } from "@/hooks/useAgent";
import toast from "react-hot-toast";

import { QRScanner } from "@/components/QRScanner";

export default function AgentVerify() {
  const [searchParams] = useSearchParams();
  const { data: dashboardData } = useAgentDashboard();
  const { data: pending, isLoading } = usePendingSubmissions();
  const verifyMutation = useVerifySubmission();
  const rejectMutation = useRejectSubmission();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [actualKg, setActualKg] = useState<number>(0);
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const QUEUE = pending || [];
  const selected = QUEUE.find((q: any) => q.id === activeId) || QUEUE[0];

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setActiveId(id);
    else if (QUEUE.length > 0 && !activeId) setActiveId(QUEUE[0].id);
  }, [searchParams, QUEUE]);

  useEffect(() => {
    if (selected) {
        setActualKg(Number(selected.totalWeightKg));
    }
  }, [selected]);

  if (isLoading) return <div className="p-20 text-center font-bold">Loading verifier...</div>;

  const handleScan = (id: string) => {
    // Check if ID exists in queue
    const match = QUEUE.find((q: any) => q.id === id || q.id.slice(0, 8) === id);
    if (match) {
        setActiveId(match.id);
        toast.success(`Found drop for ${match.collector.user.firstName}`);
    } else {
        toast.error("Drop not found in queue");
    }
  };

  const handleVerify = async () => {
    if (!selected) return;
    try {
        await verifyMutation.mutateAsync({
            id: selected.id,
            items: selected.items.map((i: any) => ({
                itemId: i.id,
                actualWeightKg: actualKg
            }))
        });
        toast.success("Verification successful! Payout sent.");
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason) return;
    try {
        await rejectMutation.mutateAsync({ id: selected.id, reason: rejectReason });
        toast.success("Submission rejected");
        setShowRejectPanel(false);
        setRejectReason("");
    } catch (err: any) {
        toast.error("Rejection failed");
    }
  };

  // Mock rate for display
  const rate = 200; 
  const payout = Math.round(actualKg * rate);

  return (
    <>
      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
      
      <PageHeader
        eyebrow="Verify drops"
        title="Drop verifier"
        subtitle="Scan QR, weigh, snap, confirm. Real-time payouts to collector wallets."
        actions={<button onClick={() => setShowScanner(true)} className="btn-primary"><QrCode size={14} /> Scan QR</button>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Queue */}
        <div className="lg:col-span-5">
          <div className="card p-3">
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
              <input className="input h-9 pl-9 text-sm" placeholder="Search by name or drop ID" />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {QUEUE.length === 0 ? (
                  <div className="p-10 text-center text-sm text-textgray">All caught up! No pending drops.</div>
              ) : QUEUE.map((q: any) => (
                <button
                  key={q.id}
                  onClick={() => setActiveId(q.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    activeId === q.id ? "border-primary bg-mint" : "border-transparent hover:bg-cream"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center font-bold text-primary">
                    {q.collector.user.firstName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-extrabold">{q.collector.user.firstName} {q.collector.user.lastName}</span>
                      <span className="font-mono text-[10px] text-primary">{q.id.slice(0, 8)}</span>
                    </div>
                    <div className="text-xs text-textgray">{q.items[0]?.wasteCategory.name || "Mixed"} · ~{q.totalWeightKg}kg</div>
                  </div>
                  <span className="badge badge-success">Arrived</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verifier */}
        {selected ? (
        <div className="lg:col-span-7">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-bordergray bg-cream/40 p-6">
              <div className="flex items-center gap-3">
                 <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xl">
                    {selected.collector.user.firstName.charAt(0)}
                  </div>
                <div>
                  <div className="font-extrabold text-charcoal">{selected.collector.user.firstName} {selected.collector.user.lastName}</div>
                  <div className="text-xs text-textgray">{selected.collector.user.phoneNumber} · Drop {selected.id.slice(0, 12)}</div>
                </div>
              </div>
              <span className="badge-mint inline-flex items-center gap-1"><ShieldCheck size={12} /> Verified collector</span>
            </div>

            <div className="p-6">
              <div className="grid items-stretch gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-bordergray bg-cream p-5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={selected.items?.[0]?.wasteCategory?.name} size={48} />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Material</div>
                      <div className="text-base font-extrabold">{selected.items?.[0]?.wasteCategory?.name || "Mixed Material"}</div>
                      <div className="font-mono text-xs text-primary">₦200/kg (standard)</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between border-t border-bordergray pt-3">
                    <span className="text-xs text-textgray">Collector estimated</span>
                    <span className="font-mono font-extrabold">{selected.totalWeightKg} kg</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-primary bg-mint/40 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Scale size={12} /> Hub-scale weight
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => setActualKg((k) => Math.max(0, k - 0.1))} className="grid h-10 w-10 place-items-center rounded-xl border border-bordergray bg-white">−</button>
                    <input
                      value={actualKg.toFixed(1)}
                      onChange={(e) => setActualKg(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      type="number"
                      className="input h-10 flex-1 text-center font-mono text-2xl font-extrabold"
                    />
                    <button onClick={() => setActualKg((k) => k + 0.1)} className="grid h-10 w-10 place-items-center rounded-xl border border-bordergray bg-white">+</button>
                  </div>
                  <div className="mt-2 text-center text-xs text-textgray">Confirm weight from physical scale</div>
                </div>
              </div>

              {/* Photos */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Scale Proof · Required</div>
                  <button className="btn-outline btn-sm"><Camera size={12} /> Snap scale</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-bordergray bg-cream grid place-items-center cursor-pointer hover:border-primary transition">
                    <Camera size={18} className="text-textgray" />
                  </div>
                </div>
              </div>

              {showRejectPanel ? (
                <div className="mt-5 rounded-2xl border-2 border-error/20 bg-error/5 p-5 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-error">Rejection Reason</div>
                    <button onClick={() => setShowRejectPanel(false)} className="text-textgray hover:text-charcoal"><X size={16} /></button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Contaminated", "Wrong material", "Incorrect weight", "Underage collector"].map(r => (
                      <button 
                        key={r}
                        onClick={() => setRejectReason(r)}
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold border transition ${
                          rejectReason === r ? "bg-error text-white border-error" : "bg-white text-error border-error/30 hover:bg-error/10"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter detailed reason for rejection..."
                    className="input min-h-[80px] w-full py-3 text-sm"
                  />
                  
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={handleReject}
                      disabled={!rejectReason || rejectMutation.isPending}
                      className="btn-error flex-1"
                    >
                      {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                    <button onClick={() => setShowRejectPanel(false)} className="btn-outline flex-1">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-dark mt-5 flex items-center gap-5 p-5">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Wallet payout</div>
                      <div className="mt-1 font-mono text-3xl font-extrabold text-white">
                        <span className="text-accent">₦</span>{payout.toLocaleString("en-NG")}
                      </div>
                      <div className="mt-1 text-[11px] text-white/60">{actualKg.toFixed(1)} kg × ₦200/kg · Verified by {dashboardData?.agent?.name}</div>
                    </div>
                    <button 
                        disabled={verifyMutation.isPending}
                        onClick={handleVerify}
                        className="btn-gold btn-lg"
                    >
                      {verifyMutation.isPending ? "Processing..." : "Approve & Pay"} <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex justify-between text-xs">
                    <button onClick={() => setShowRejectPanel(true)} className="font-bold text-error hover:underline inline-flex items-center gap-1"><X size={12} /> Reject drop</button>
                    <button className="font-bold text-textgray hover:underline">Skip for now <ChevronRight size={12} className="inline" /></button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        ) : (
            <div className="lg:col-span-7 card p-20 text-center text-textgray italic">
                Select a drop from the queue to start verification.
            </div>
        )}
      </div>
    </>
  );
}
