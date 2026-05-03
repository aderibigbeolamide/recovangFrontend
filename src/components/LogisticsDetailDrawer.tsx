import React, { useState } from "react";
import { 
  X, Truck, MapPin, ShieldCheck, FileText, History, 
  User, Phone, Mail, Navigation, Package, Star, 
  ExternalLink, CheckCircle2, AlertCircle, Clock, Ban, Power, Wrench
} from "lucide-react";
import { useTogglePartnerAvailability } from "@/hooks/useAdmin";
import { Modal } from "./Modal";
import { StatusPill } from "./ui";
import { formatKg, formatNumber, formatNaira } from "@/lib/cn";

interface LogisticsDetailDrawerProps {
  partner: any;
  onClose: () => void;
}

export function LogisticsDetailDrawer({ partner, onClose }: LogisticsDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "docs" | "trips">("overview");
  const toggleMutation = useTogglePartnerAvailability();

  if (!partner) return null;

  const TABS = [
    { id: "overview", label: "Fleet Overview", icon: Truck },
    { id: "financials", label: "Financials & ROI", icon: Star },
    { id: "docs", label: "Compliance Docs", icon: ShieldCheck },
    { id: "trips", label: "Trip History", icon: History },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-lg bg-white shadow-2xl animate-slideLeft flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bordergray p-6 bg-cream/20">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-grad-primary text-white shadow-lg">
            <Truck size={24} />
          </div>
          <div>
            <h2 className="text-h4 font-black">{partner.user?.firstName} {partner.user?.lastName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${partner.isOnline ? "bg-success animate-pulse" : "bg-textgray/30"}`} />
              <span className="text-[10px] font-bold text-textgray uppercase tracking-widest">
                {partner.isOnline ? "Online & Tracking" : "Offline"}
              </span>
              <span className="text-textgray/20 mx-1">|</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${partner.isAvailable !== false ? "text-success" : "text-error"}`}>
                {partner.isAvailable !== false ? "Road Worthy" : "Under Maintenance"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            className={`btn-sm flex items-center gap-2 ${partner.isAvailable !== false ? "btn-outline border-error text-error hover:bg-error/5" : "btn-primary !bg-success"}`}
            onClick={() => toggleMutation.mutate(partner.id)}
            disabled={toggleMutation.isPending}
          >
            {partner.isAvailable !== false ? <Wrench size={14} /> : <Power size={14} />}
            {partner.isAvailable !== false ? "Mark Breakdown" : "Mark Available"}
          </button>
          <button 
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="flex border-b border-bordergray px-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 py-4 px-4 text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-textgray hover:text-charcoal"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === "financials" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {/* ROI Card */}
            <div className="p-6 rounded-3xl bg-charcoal text-cream relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Star size={80} /></div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-cream/50 mb-1">Estimated Asset ROI</div>
                <div className="text-3xl font-black mb-4">
                  {((Number(partner.totalEarningsNGN || 0) - Number(partner.totalExpensesNGN || 0)) / (Number(partner.totalExpensesNGN) || 1) * 100).toFixed(1)}%
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-cream/40 uppercase mb-1">Total Profit</div>
                    <div className="text-sm font-black text-success">{formatNaira(Number(partner.totalEarningsNGN || 0) - Number(partner.totalExpensesNGN || 0))}</div>
                  </div>
                  <div className="h-8 w-[1px] bg-cream/10" />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-cream/40 uppercase mb-1">Efficiency</div>
                    <div className="text-sm font-black text-gold">High</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-bordergray bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg bg-success/10 text-success grid place-items-center"><CheckCircle2 size={12} /></div>
                  <span className="text-[10px] font-black uppercase text-textgray">Gross Earnings</span>
                </div>
                <div className="text-xl font-black text-charcoal">{formatNaira(partner.totalEarningsNGN || 0)}</div>
              </div>
              <div className="p-4 rounded-2xl border border-bordergray bg-error/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg bg-error/10 text-error grid place-items-center"><Ban size={12} /></div>
                  <span className="text-[10px] font-black uppercase text-textgray">Total Expenses</span>
                </div>
                <div className="text-xl font-black text-charcoal">{formatNaira(partner.totalExpensesNGN || 0)}</div>
              </div>
            </div>

            {/* Expense Logger */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-textgray border-b pb-2">Log New Vehicle Expense</h3>
              <div className="p-4 rounded-2xl border-2 border-dashed border-bordergray bg-cream/5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select className="inp text-[11px] font-bold h-9">
                    <option>FUEL PURCHASE</option>
                    <option>MAINTENANCE / REPAIR</option>
                    <option>DRIVER SALARY</option>
                    <option>INSURANCE / RENEWAL</option>
                  </select>
                  <input className="inp text-[11px] font-bold h-9" placeholder="Amount (₦)" type="number" />
                </div>
                <button className="btn-primary w-full btn-sm font-black uppercase tracking-widest">Record Expense</button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                <div className="text-[10px] font-bold text-primary uppercase mb-1">Rating</div>
                <div className="flex items-center justify-center gap-1 text-h4 font-black text-charcoal">
                  {partner.rating || "5.0"} <Star size={14} className="fill-gold text-gold" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 text-center">
                <div className="text-[10px] font-bold text-gold uppercase mb-1">Trips</div>
                <div className="text-h4 font-black text-charcoal">{partner.tripsCompleted || 0}</div>
              </div>
              <div className="p-4 rounded-2xl bg-charcoal/5 border border-charcoal/10 text-center">
                <div className="text-[10px] font-bold text-textgray uppercase mb-1">Status</div>
                <div className="mt-1 flex justify-center">
                  <StatusPill status={partner.isOnline ? "success" : "error"} label={partner.isOnline ? "Online" : "Offline"} />
                </div>
              </div>
            </div>

            {/* Driver Profile */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-textgray border-b pb-2">Driver Contact</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-bordergray/50 hover:bg-cream/20 transition-colors">
                  <Phone size={14} className="text-primary" />
                  <span className="text-sm font-bold">{partner.user?.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-bordergray/50 hover:bg-cream/20 transition-colors">
                  <Mail size={14} className="text-primary" />
                  <span className="text-sm font-bold">{partner.user?.email}</span>
                </div>
              </div>
            </section>

            {/* Vehicle Details */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-textgray border-b pb-2">Vehicle Specification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-bordergray bg-cream/5">
                  <div className="text-[10px] text-textgray font-bold uppercase mb-1">Capacity</div>
                  <div className="text-lg font-black text-charcoal">{formatKg(partner.capacityKg)}</div>
                  <div className="text-[10px] text-primary font-bold">MAX LOAD</div>
                </div>
                <div className="p-4 rounded-2xl border border-bordergray bg-cream/5">
                  <div className="text-[10px] text-textgray font-bold uppercase mb-1">Registration</div>
                  <div className="text-lg font-black text-charcoal">{partner.vehicleRegNumber}</div>
                  <div className="text-[10px] text-primary font-bold">VERIFIED</div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "docs" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-info/5 border border-info/20 flex gap-4">
              <AlertCircle className="text-info shrink-0" size={20} />
              <div className="text-xs text-info/80 leading-relaxed">
                Ensure all documents are current. Expired licenses or insurance will automatically suspend the driver's ability to accept pickups.
              </div>
            </div>

            <div className="grid gap-6">
              {/* Driver's License */}
              <div className="p-5 rounded-3xl border border-bordergray bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center"><FileText size={16} /></div>
                    <span className="text-sm font-black">Driver's License</span>
                  </div>
                  <StatusPill status={partner.licenseUrl ? "success" : "warning"} label={partner.licenseUrl ? "Verified" : "Missing"} />
                </div>
                {partner.licenseUrl ? (
                  <div className="aspect-video rounded-2xl bg-charcoal/5 border border-bordergray relative group overflow-hidden">
                    <img src={partner.licenseUrl} className="w-full h-full object-cover" alt="License" />
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                      <button className="btn-primary btn-sm gap-2"><ExternalLink size={14} /> View Document</button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl border-2 border-dashed border-bordergray flex flex-col items-center justify-center text-textgray gap-2">
                    <AlertCircle size={24} />
                    <span className="text-[10px] font-bold uppercase">No Document Uploaded</span>
                  </div>
                )}
              </div>

              {/* Vehicle Insurance */}
              <div className="p-5 rounded-3xl border border-bordergray bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center"><ShieldCheck size={16} /></div>
                    <span className="text-sm font-black">Vehicle Insurance</span>
                  </div>
                  <StatusPill status={partner.insuranceUrl ? "success" : "warning"} label={partner.insuranceUrl ? "Verified" : "Missing"} />
                </div>
                {partner.insuranceUrl ? (
                  <div className="aspect-video rounded-2xl bg-charcoal/5 border border-bordergray relative group overflow-hidden">
                    <img src={partner.insuranceUrl} className="w-full h-full object-cover" alt="Insurance" />
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                      <button className="btn-primary btn-sm gap-2"><ExternalLink size={14} /> View Document</button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl border-2 border-dashed border-bordergray flex flex-col items-center justify-center text-textgray gap-2">
                    <AlertCircle size={24} />
                    <span className="text-[10px] font-bold uppercase">No Document Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "trips" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black text-textgray uppercase tracking-widest">Recent Activity</span>
              <span className="text-[10px] font-bold text-primary">View All</span>
            </div>
            
            {/* Trip List */}
            <div className="space-y-3">
              {(partner.trips || []).slice(0, 10).map((trip: any) => (
                <div key={trip.id} className="p-4 rounded-2xl border border-bordergray bg-white hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-mono font-bold text-primary">#{trip.id.slice(0, 8).toUpperCase()}</div>
                    <StatusPill status={trip.status === "COMPLETED" ? "success" : "info"} label={trip.status.replace(/_/g, " ")} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="w-0.5 h-4 bg-bordergray" />
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-bold text-charcoal">{trip.hub?.name || "Source Hub"}</div>
                      <div className="text-xs font-bold text-charcoal">{trip.status === "ARRIVED_AT_FACTORY" ? "Factory" : "In Transit"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-charcoal">{formatKg(trip.weightKg)}</div>
                      <div className="text-[10px] text-textgray uppercase font-bold">{trip.category?.name}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-bordergray/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-textgray font-bold">
                      <Clock size={12} /> {new Date(trip.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-black text-primary">{formatNaira(trip.estimatedPayoutNGN)}</div>
                  </div>
                </div>
              ))}
              {(partner.trips || []).length === 0 && (
                <div className="text-center py-10 text-textgray italic text-xs">No historical trips found for this partner.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-bordergray bg-cream/20 flex gap-3">
        <button 
          className="btn-outline flex-1 border-error/20 text-error hover:bg-error/5"
          onClick={() => {
            if (confirm("Suspend this partner? They will not be able to accept any more pickups.")) {
              // Suspend logic
            }
          }}
        >
          Suspend Partner
        </button>
        <button 
          className={`btn-primary flex-1 ${partner.isVerified ? "bg-charcoal" : ""}`}
          onClick={() => {
            // Verify logic
          }}
        >
          {partner.isVerified ? "Verified Partner" : "Verify Documents"}
        </button>
      </div>
    </div>
  );
}
