import React from "react";
import { Modal } from "./Modal";
import { Printer, ShieldCheck, Truck, MapPin, Package, Download, Navigation } from "lucide-react";
import { formatKg } from "@/lib/cn";

interface WaybillModalProps {
  route: any;
  onClose: () => void;
}

export function WaybillModal({ route, onClose }: WaybillModalProps) {
  if (!route) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={!!route}
      onClose={onClose}
      title="Electronic Waybill (e-Waybill)"
      size="lg"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <button className="btn-outline flex items-center gap-2" onClick={onClose}>Close</button>
          <button className="btn-primary flex items-center gap-2" onClick={handlePrint}>
            <Printer size={16} /> Print Waybill
          </button>
        </div>
      }
    >
      <div className="p-8 bg-white border-2 border-charcoal/10 rounded-3xl space-y-8 print:p-0 print:border-0">
        {/* Logo & ID */}
        <div className="flex justify-between items-start border-b-2 border-charcoal/5 pb-6">
          <div>
            <div className="text-2xl font-black text-primary tracking-tighter italic">RECOVANG</div>
            <div className="text-[10px] font-bold text-textgray uppercase tracking-widest mt-1">Logistics & Supply Chain Division</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-textgray uppercase">Waybill Number</div>
            <div className="text-xl font-mono font-black text-charcoal">#{route.id.slice(0, 12).toUpperCase()}</div>
            <div className="text-[10px] font-bold text-success mt-1">VERIFIED BY RECOVANG HQ</div>
          </div>
        </div>

        {/* Route Info */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-textgray uppercase tracking-widest">
              <MapPin size={14} className="text-primary" /> Origin (Hub)
            </div>
            <div>
              <div className="text-lg font-black text-charcoal">{route.hub?.name}</div>
              <div className="text-sm text-textgray leading-relaxed">{route.hub?.address}</div>
              <div className="text-sm text-textgray">{route.hub?.lga}, {route.hub?.state}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-textgray uppercase tracking-widest">
              <Navigation size={14} className="text-gold" /> Destination (Factory)
            </div>
            <div>
              <div className="text-lg font-black text-charcoal">Recovang Central Factory</div>
              <div className="text-sm text-textgray leading-relaxed">Apapa Industrial Estate, Phase 2</div>
              <div className="text-sm text-textgray">Apapa, Lagos State</div>
            </div>
          </div>
        </div>

        {/* Cargo & Carrier */}
        <div className="grid grid-cols-2 gap-12 p-6 bg-cream/30 rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-textgray uppercase tracking-widest">
              <Package size={14} className="text-primary" /> Cargo Details
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold text-textgray uppercase">Material</div>
                <div className="text-sm font-black text-charcoal">{route.category?.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-textgray uppercase">Net Weight</div>
                <div className="text-sm font-black text-charcoal">{formatKg(route.weightKg)}</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-textgray uppercase tracking-widest">
              <Truck size={14} className="text-primary" /> Carrier Details
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold text-textgray uppercase">Driver</div>
                <div className="text-sm font-black text-charcoal">{route.partner?.user?.firstName} {route.partner?.user?.lastName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-textgray uppercase">Vehicle Reg</div>
                <div className="text-sm font-black text-charcoal">{route.partner?.vehicleRegNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* QR & Security */}
        <div className="flex items-center justify-between pt-6 border-t border-dashed border-bordergray">
          <div className="max-w-[300px] text-[10px] text-textgray leading-relaxed italic">
            This document serves as proof of authorization for material transport under Recovang's waste management license. Security personnel and factory gatekeepers must verify the Waybill ID against the live dashboard.
          </div>
          <div className="h-24 w-24 bg-charcoal/5 border border-bordergray rounded-xl flex items-center justify-center">
             <div className="text-[8px] font-bold text-textgray text-center px-2 uppercase">Scan to Verify Route Integrity</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] font-bold text-textgray uppercase tracking-[0.2em] pt-4">
          RECOVANG · CLEANER NIGERIA · SUSTAINABLE LOGISTICS
        </div>
      </div>
    </Modal>
  );
}
