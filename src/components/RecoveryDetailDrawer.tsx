import { useState } from "react";
import { 
  X, MapPin, Recycle, Coins, Calendar, Building2, 
  CheckCircle2, Camera, User, Hash, ArrowRight
} from "lucide-react";
import { StatusPill } from "./ui";
import { formatNaira, formatKg } from "@/lib/cn";
import { useSubmissionDetails } from "@/hooks/useBrand";

interface RecoveryDetailDrawerProps {
  submissionId: string | null;
  onClose: () => void;
}

export function RecoveryDetailDrawer({ submissionId, onClose }: RecoveryDetailDrawerProps) {
  const { data: s, isLoading } = useSubmissionDetails(submissionId);

  if (!submissionId) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-sm transition-opacity duration-300 ${submissionId ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${submissionId ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Recycle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black">Recovery Details</h2>
                <div className="text-[10px] text-textgray uppercase tracking-widest font-bold">
                  ID: {submissionId.toUpperCase()}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isLoading ? (
              <div className="flex h-full items-center justify-center py-20 text-textgray animate-pulse font-bold">
                Fetching recovery proof...
              </div>
            ) : s ? (
              <div className="space-y-8">
                {/* Status Card */}
                <div className="rounded-3xl bg-grad-mint p-6">
                  <div className="flex items-center justify-between">
                    <StatusPill status="success" label={s.status} />
                    <div className="text-xs font-bold text-primary flex items-center gap-1">
                      <CheckCircle2 size={14} /> Verified drop
                    </div>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <div className="text-4xl font-black text-charcoal">{formatKg(s.totalWeightKg)}</div>
                    <div className="text-sm font-bold text-primary/60">Recovered</div>
                  </div>
                </div>

                {/* Proof Gallery */}
                <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3 flex items-center gap-2">
                        <Camera size={12} /> Photographic Proof
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {s.photos && s.photos.length > 0 ? s.photos.map((url: string, i: number) => (
                            <div key={i} className="aspect-square rounded-2xl bg-cream border border-bordergray overflow-hidden group relative">
                                <img src={url} alt="Proof" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button className="btn-primary btn-sm px-2 py-1 text-[10px]">View Large</button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 py-10 border-2 border-dashed border-bordergray rounded-2xl flex flex-col items-center justify-center text-textgray italic text-xs">
                                No photos attached to this submission.
                            </div>
                        )}
                    </div>
                </section>

                {/* Details Grid */}
                <section className="grid gap-6">
                    <div className="space-y-4">
                        <DetailItem icon={Calendar} label="Date Verified" value={new Date(s.verifiedAt || s.createdAt).toLocaleDateString("en-NG", { day: 'numeric', month: 'long', year: 'numeric' })} />
                        <DetailItem icon={Building2} label="Processing Hub" value={s.hub?.name || "Lagos Central Hub"} />
                        <DetailItem icon={MapPin} label="Location" value={`${s.hub?.lga || "Ikeja"}, ${s.hub?.state || "Lagos"}`} />
                        <DetailItem icon={User} label="Verified By" value={s.verifiedBy?.user?.firstName ? `${s.verifiedBy.user.firstName} ${s.verifiedBy.user.lastName}` : "Hub Agent #204"} />
                        <DetailItem icon={Coins} label="EPR Value" value={formatNaira(s.totalAmount / 100)} />
                    </div>
                </section>

                {/* Items Table */}
                <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3 flex items-center gap-2">
                        <Hash size={12} /> Material Breakdown
                    </h3>
                    <div className="rounded-2xl border border-bordergray overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-cream/50">
                                <tr>
                                    <th className="px-4 py-2 font-bold">Category</th>
                                    <th className="px-4 py-2 text-right font-bold">Weight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-bordergray">
                                {s.items?.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 font-medium">{item.wasteCategory?.name}</td>
                                        <td className="px-4 py-3 text-right font-mono font-bold">{formatKg(item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
              </div>
            ) : (
              <div className="text-center py-20 text-error font-bold">Failed to load submission data.</div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-bordergray p-6 bg-cream/20">
            <button className="btn-primary w-full gap-2">
                Download Audit Certificate <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-lg bg-cream flex items-center justify-center text-textgray shrink-0">
                <Icon size={14} />
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">{label}</div>
                <div className="text-sm font-bold text-charcoal">{value}</div>
            </div>
        </div>
    );
}
