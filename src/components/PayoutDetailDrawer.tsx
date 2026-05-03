import { X, ShieldAlert, CheckCircle2, AlertCircle, Banknote, History, User } from "lucide-react";
import { Avatar, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { useAdminPayouts } from "@/hooks/useAdmin";

interface PayoutDetailDrawerProps {
  payout: any | null;
  onClose: () => void;
}

export default function PayoutDetailDrawer({ payout, onClose }: PayoutDetailDrawerProps) {
  const { mutate: processPayout, isPending } = useAdminPayouts();

  if (!payout) return null;

  const user = payout.collector?.user;
  const name = user ? `${user.firstName} ${user.lastName}` : "Unknown Collector";

  const handleAction = (action: "approve" | "reject" | "flag") => {
    console.log(`[Drawer] Triggering action: ${action} for payout: ${payout.id}`);
    const statusMap = {
      approve: "COMPLETED",
      reject: "REJECTED",
      flag: "FLAGGED"
    };

    processPayout({ 
      id: payout.id, 
      status: statusMap[action],
      reason: action === "reject" ? "Manual rejection by admin" : undefined
    }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-bordergray p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-charcoal tracking-tight">Withdrawal Review</h2>
                <p className="text-xs text-textgray font-bold uppercase tracking-widest mt-1">Ref: {payout.id.slice(0, 8)}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-bordergray transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Collector Section */}
            <div className="flex items-center gap-4 mb-8 bg-cream/30 p-4 rounded-3xl border border-primary/5">
              <Avatar name={name} size={64} />
              <div>
                <h3 className="text-lg font-black text-charcoal leading-tight">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-textgray uppercase tracking-tighter">{user?.role || "Collector"}</span>
                  <div className="h-1 w-1 rounded-full bg-textgray/30" />
                  <span className="text-xs font-bold text-primary uppercase">KYC Verified</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[10px] font-black text-textgray uppercase tracking-widest">Collector Rating</div>
                <div className="flex items-center gap-1 text-gold">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <X key={i} size={10} className="fill-gold" />
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="card p-4 bg-white border-2 border-bordergray/50">
                <div className="text-[10px] font-black text-textgray uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Banknote size={12} /> Requested Amount
                </div>
                <div className="text-2xl font-black text-charcoal">{formatNaira(payout.grossAmount)}</div>
              </div>
              <div className="card p-4 bg-primary/5 border-2 border-primary/10">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                  <CheckCircle2 size={12} /> Net Payout
                </div>
                <div className="text-2xl font-black text-primary">{formatNaira(payout.amount)}</div>
              </div>
            </div>

            {/* Deductions List */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-black text-textgray uppercase tracking-widest px-1">Deduction Breakdown</h4>
              <div className="bg-white rounded-2xl border border-bordergray overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-bordergray">
                  <span className="text-sm font-bold text-charcoal">Platform Fee (5%)</span>
                  <span className="text-sm font-mono font-black text-error">-{formatNaira(payout.feeAmount)}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm font-bold text-charcoal">Withholding Tax (2.5%)</span>
                  <span className="text-sm font-mono font-black text-error">-{formatNaira(payout.taxAmount)}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-8 bg-charcoal text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Banknote size={80} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-white/50">Destination Account</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase">Bank Name</div>
                  <div className="text-lg font-black">{payout.details?.bankName || "GTBank"}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase">Account Number</div>
                  <div className="text-2xl font-mono tracking-widest font-black leading-none">{payout.details?.accountNumber || "0123456789"}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase">Account Name</div>
                  <div className="text-md font-bold">{payout.details?.accountName || name}</div>
                </div>
              </div>
            </div>

            {/* Audit & Security */}
            <div className="card p-5 border-2 border-warning/20 bg-warning/5 rounded-3xl mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-warning/20 rounded-xl text-warning">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-charcoal leading-tight">Security Check</h4>
                  <p className="text-xs text-textgray font-bold mt-1">Account has no recent flags. Verified as a recurring trusted collector.</p>
                </div>
              </div>
            </div>

            {/* Proof of Payment (Only for COMPLETED) */}
            {payout.status === "COMPLETED" && (
              <div className="card p-6 border-2 border-dashed border-primary/30 bg-primary/5 rounded-3xl">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-md font-black text-charcoal">Proof of Payment</h4>
                  <p className="text-xs text-textgray font-bold mb-4">Transaction finalized. Upload bank receipt for audit trail.</p>
                  <label className="btn-primary py-2 px-6 cursor-pointer text-[10px] font-black uppercase tracking-widest">
                    Upload Receipt
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-bordergray p-6 bg-cream/10">
            {payout.status === "PENDING" || payout.status === "FLAGGED" ? (
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleAction("reject")}
                  className="btn-outline border-error text-error hover:bg-error hover:text-white py-3 font-black text-xs uppercase tracking-widest"
                >
                  <AlertCircle size={16} /> Reject
                </button>
                <button 
                  onClick={() => handleAction("flag")}
                  className="btn-outline border-warning text-warning hover:bg-warning hover:text-white py-3 font-black text-xs uppercase tracking-widest"
                >
                  <ShieldAlert size={16} /> Flag
                </button>
                <button 
                  onClick={() => handleAction("approve")}
                  disabled={isPending}
                  className="btn-primary py-3 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  {isPending ? "Processing..." : "Approve Payout"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-success font-black uppercase tracking-widest text-xs">
                <CheckCircle2 size={16} /> Transaction Finalized
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
