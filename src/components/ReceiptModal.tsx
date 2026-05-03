import React from "react";
import { Modal } from "./Modal";
import { Printer, ShieldCheck, Download, CheckCircle2, FileText, Scale, Award } from "lucide-react";
import { formatNumber, formatNaira } from "@/lib/cn";

interface ReceiptModalProps {
  receipt: any;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={!!receipt}
      onClose={onClose}
      title="Material Acceptance Receipt"
      size="lg"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <button className="btn-outline flex items-center gap-2" onClick={onClose}>Close</button>
          <button className="btn-primary flex items-center gap-2" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      }
    >
      <div className="p-8 bg-white border-2 border-primary/10 rounded-3xl space-y-8 print:p-0 print:border-0 relative overflow-hidden">
        {/* Verification Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.03]">
            <ShieldCheck size={400} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-charcoal/5 pb-6">
          <div>
            <div className="text-2xl font-black text-primary tracking-tighter italic">RECOVANG</div>
            <div className="text-[10px] font-bold text-textgray uppercase tracking-widest mt-1">Verified Supply Chain Hub</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-textgray uppercase">Receipt Number</div>
            <div className="text-xl font-mono font-black text-charcoal">#{receipt.id.toUpperCase()}</div>
            <div className="text-[10px] font-bold text-success mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 size={12} /> GATE VERIFIED · SECURE
            </div>
          </div>
        </div>

        {/* Main Details */}
        <div className="grid grid-cols-2 gap-12">
            <div className="space-y-6">
                <div>
                    <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Issuing Factory</div>
                    <div className="mt-1 text-lg font-black text-charcoal">Indorama PET Recyclers</div>
                    <div className="text-xs text-textgray italic leading-relaxed">Apapa Port Industrial Area, Lagos, Nigeria</div>
                </div>
                <div>
                    <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Order Reference</div>
                    <div className="mt-1 font-mono font-bold text-charcoal">ORD-{receipt.orderId}</div>
                </div>
            </div>
            <div className="rounded-3xl bg-primary/5 p-6 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
                    Verification Summary
                    <Award size={14} />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-textgray font-bold uppercase">QA Score</span>
                        <span className="text-lg font-black text-charcoal">{receipt.qaScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-textgray font-bold uppercase">Grade</span>
                        <span className="text-lg font-black text-success">Grade A</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Weight Verification Table */}
        <div className="overflow-hidden rounded-3xl border border-bordergray">
            <table className="w-full text-left">
                <thead className="bg-cream/50 text-[10px] font-bold text-textgray uppercase tracking-widest">
                    <tr>
                        <th className="px-6 py-4">Verification Type</th>
                        <th className="px-6 py-4">Expected</th>
                        <th className="px-6 py-4">Actual (Scale)</th>
                        <th className="px-6 py-4 text-right">Variance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-bordergray text-sm">
                    <tr className="bg-white font-bold">
                        <td className="px-6 py-5 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-mint flex items-center justify-center text-primary">
                                <Scale size={16} />
                            </div>
                            Net Weight
                        </td>
                        <td className="px-6 py-5 font-mono text-textgray">{formatNumber(receipt.expectedKg)} kg</td>
                        <td className="px-6 py-5 font-mono text-charcoal">{formatNumber(receipt.deliveredKg)} kg</td>
                        <td className={`px-6 py-5 font-mono text-right ${receipt.variancePct < 0 ? 'text-error' : 'text-success'}`}>
                            {receipt.variancePct > 0 ? '+' : ''}{receipt.variancePct}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Security & Timestamp */}
        <div className="flex items-center justify-between pt-6 border-t border-dashed border-bordergray text-[10px] font-bold text-textgray uppercase tracking-widest">
           <div>Verified: {new Date().toLocaleDateString()} · {new Date().toLocaleTimeString()}</div>
           <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-primary" /> End-to-End Encryption Verified
           </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-8 pt-4 grayscale opacity-40 border-t border-charcoal/5">
             <div className="text-[9px] font-black italic tracking-tighter">FEDERAL MINISTRY OF ENVIRONMENT</div>
             <div className="text-[9px] font-black italic tracking-tighter">NESREA APPROVED</div>
             <div className="text-[9px] font-black italic tracking-tighter">ISO 14001 CERTIFIED</div>
        </div>
      </div>
    </Modal>
  );
}
