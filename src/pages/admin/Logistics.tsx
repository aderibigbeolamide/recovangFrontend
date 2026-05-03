import { useState, useEffect } from "react";
import { Activity, AlertCircle, Building2, ChevronDown, FileText, Filter, Fuel, MapPin, Navigation, Package, Plus, Route, Search, ShieldCheck, Star, Truck, User as UserIcon } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar } from "@/components/charts";
import { CategoryIcon } from "@/components/illustrations";
import { formatKg, formatNumber, formatNaira } from "@/lib/cn";
import { useHubs, useLogistics, useActiveRoutes, useManualDispatch, useWasteCategories, useVerifyDelivery, useAdminAnalytics, useTodayLogisticsStats, useSystemHealth } from "@/hooks/useAdmin";
import { LogisticsMap } from "@/components/LogisticsMap";
import { LogisticsDetailDrawer } from "@/components/LogisticsDetailDrawer";
import { WaybillModal } from "@/components/WaybillModal";
import { Modal } from "@/components/Modal";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";
import { toast } from "react-hot-toast";
import api from "@/services/api";

// Mock logs for when API is empty
const MOCK_LOGS = [
  { id: "1", action: "DISPATCHED_TRUCK", entityType: "LOGISTICS", admin: "Super Admin", details: "Assigned TR-092 to Ikorodu Hub", createdAt: new Date().toISOString() },
  { id: "2", action: "VERIFIED_KYC", entityType: "USER", admin: "Ops Manager", details: "Approved documents for Olamide J.", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", action: "UPDATED_PRICING", entityType: "FINANCE", admin: "Super Admin", details: "Changed PET rate to ₦145/kg", createdAt: new Date(Date.now() - 7200000).toISOString() },
];

// Mock data removed in favor of real hooks

export default function AdminLogistics() {
  const [activeView, setActiveView] = useState<"fleet" | "logs">("fleet");
  const { data: partners, isLoading: partnersLoading } = useLogistics();
  const { data: hubs, isLoading: hubsLoading } = useHubs();
  const { data: routes, isLoading: routesLoading } = useActiveRoutes();
  const { data: categories } = useWasteCategories();
  const dispatchMutation = useManualDispatch();
  const verifyMutation = useVerifyDelivery();
  const { data: todayStats } = useTodayLogisticsStats();
  const { data: health } = useSystemHealth();

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedWaybill, setSelectedWaybill] = useState<any>(null);
  const [dispatchModal, setDispatchModal] = useState<any>(null);
  const [dispatchForm, setDispatchForm] = useState({ partnerId: "", categoryId: "", weightKg: 0, notes: "" });

  useEffect(() => {
    if (activeView === "logs") {
      api.get("/admin/audit-logs").then(res => {
        const logs = res.data?.data || [];
        setAuditLogs(logs);
        setFilteredLogs(logs);
      });
    }
  }, [activeView]);

  useEffect(() => {
    let filtered = auditLogs.filter(log => {
      const adminName = log.admin?.firstName ? `${log.admin.firstName} ${log.admin.lastName}` : (log.admin || "System");
      const matchesSearch = 
        searchTerm === "" || 
        adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
      
      return matchesSearch && matchesAction;
    });
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, actionFilter, auditLogs]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const actionTypes = Array.from(new Set(auditLogs.map(l => l.action)));

  const handleDispatch = async () => {
    if (!dispatchForm.partnerId || !dispatchForm.categoryId || !dispatchForm.weightKg) {
      return toast.error("Please fill all required fields");
    }

    try {
      await dispatchMutation.mutateAsync({
        hubId: dispatchModal.id,
        ...dispatchForm
      });
      toast.success("Manual dispatch successful!");
      setDispatchModal(null);
    } catch (err) {
      toast.error("Failed to dispatch");
    }
  };

  const isLoading = partnersLoading || hubsLoading || routesLoading;



  return (
    <>
      <PageHeader
        eyebrow="Logistics & Governance"
        title={activeView === "fleet" ? "Fleet & route control" : "System Audit Logs"}
        subtitle={activeView === "fleet" ? "Live view of every truck, partner and route across Recovang." : "Full chronological record of all administrative and platform actions."}
        actions={
          <div className="flex bg-white/50 p-1 rounded-xl border border-bordergray shadow-inner">
            <button 
              className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${activeView === "fleet" ? "bg-white shadow-sm text-primary" : "text-textgray"}`}
              onClick={() => setActiveView("fleet")}
            >
              Fleet View
            </button>
            <button 
              className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${activeView === "logs" ? "bg-white shadow-sm text-primary" : "text-textgray"}`}
              onClick={() => setActiveView("logs")}
            >
              Audit Logs
            </button>
          </div>
        }
      />

      {activeView === "fleet" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-4 mt-6">
            <KPICard label="Active partners" value={formatNumber(partners?.length || 0)} sub="Across all regions" icon={Truck} variant="primary" />
            <KPICard label="Total Hubs" value={formatNumber(hubs?.length || 0)} sub="Lagos · Abuja · Port Harcourt" icon={Building2} />
            <KPICard label="Today's tonnage" value={todayStats?.todayTonnageFormatted || "0.0 t"} sub="Across all hubs" icon={Package} variant="gold" />
            <KPICard label="System health" value={health?.status === "UP" ? "100%" : "Critical"} sub={health?.status === "UP" ? "Operational" : "Check logs"} icon={ShieldCheck} variant="dark" />
          </div>

      {/* Live routes map */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Live fleet tracking</h3>
            <p className="text-sm text-textgray">{routes?.length || 0} active trucks moving material right now</p>
          </div>
          <span className="badge-success inline-flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live</span>
        </div>

        <div className="relative h-[400px] bg-cream/10 border-y border-bordergray overflow-hidden">
          <LogisticsMap routes={routes || []} hubs={hubs || []} />
        </div>

        <table className="tbl">
          <thead>
            <tr><th>Route</th><th>From → To</th><th>Load</th><th>Driver / partner</th><th>Progress</th><th>Status</th></tr>
          </thead>
          <tbody>
            {routes?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-textgray italic text-xs">No active pickups in transit at the moment.</td>
              </tr>
            ) : (
              routes?.map((r: any) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-bold text-primary">{r.id.slice(0, 8)}</td>
                  <td>
                    <div className="font-bold">{r.hub?.name || "N/A"}</div>
                    <div className="text-[11px] text-textgray">→ {r.status === "ARRIVED_AT_FACTORY" ? "Factory" : "In Transit"}</div>
                  </td>
                  <td className="font-mono">{formatKg(r.weightKg)} {r.category?.name}</td>
                  <td>
                    <div className="font-bold">{r.partner?.user?.firstName} {r.partner?.user?.lastName}</div>
                    <div className="text-[11px] text-textgray">{r.partner?.vehicleRegNumber}</div>
                  </td>
                  <td className="min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-charcoal/8">
                        <div 
                          className={`h-full rounded-full ${r.status === "ARRIVED_AT_FACTORY" ? "bg-success" : "bg-grad-primary"}`} 
                          style={{ width: r.status === "ARRIVED_AT_FACTORY" ? "100%" : "50%" }} 
                        />
                      </div>
                      <span className="font-mono text-xs">{r.status === "ARRIVED_AT_FACTORY" ? "100%" : "50%"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {r.status === "ARRIVED_AT_FACTORY" ? (
                        <PermissionGuard permissions={[PERMISSIONS.LOGISTICS_MANAGE]}>
                          <button 
                            className="btn-primary btn-sm !py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const weight = prompt(`Confirm final weight at Factory for ${r.category?.name} (Hub said ${r.weightKg}kg):`, r.weightKg.toString());
                              if (weight) {
                                verifyMutation.mutate({ id: r.id, data: { factoryWeightKg: Number(weight) } });
                              }
                            }}
                          >
                            Verify Delivery
                          </button>
                        </PermissionGuard>
                      ) : (
                        <StatusPill status={r.status === "IN_TRANSIT" ? "info" : "success"} label={r.status.replace(/_/g, " ")} />
                      )}
                      <button 
                        className="btn-ghost btn-sm p-1.5" 
                        title="Print Waybill"
                        onClick={(e) => { e.stopPropagation(); setSelectedWaybill(r); }}
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Partners */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
          <h3 className="text-h4">Logistics partners</h3>
          <div className="flex-1" />
          <button className="btn-outline btn-sm"><Filter size={12} /> All types</button>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input h-9 pl-9 text-sm" placeholder="Search partners" />
          </div>
        </div>
        <table className="tbl">
          <thead><tr><th>Partner</th><th>Vehicle Info</th><th>Performance</th><th>ROI / Profit</th><th>Status</th><th className="text-right">Action</th></tr></thead>
          <tbody>
            {(partners || []).map((p: any) => {
              const earnings = Number(p.totalEarningsNGN || 0);
              const expenses = Number(p.totalExpensesNGN || 0);
              const profit = earnings - expenses;
              const roi = expenses > 0 ? (profit / expenses) * 100 : 0;
              
              return (
                <tr key={p.id} className="cursor-pointer hover:bg-cream/20 transition-colors" onClick={() => setSelectedPartner(p)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-grad-primary text-white"><Truck size={14} /></div>
                      <div>
                        <span className="font-bold">{p.user?.firstName} {p.user?.lastName}</span>
                        <div className="text-[10px] text-textgray">{p.tripsCompleted || 0} trips completed</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">
                    <div className="font-bold">{p.vehicleType}</div>
                    <div className="text-textgray">{p.vehicleRegNumber}</div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-charcoal">{formatNaira(earnings)} <span className="text-[10px] text-textgray font-normal">earned</span></div>
                    <div className="text-[10px] text-textgray">{formatNaira(expenses)} expenses</div>
                  </td>
                  <td>
                    <div className={`text-sm font-black ${profit >= 0 ? "text-success" : "text-error"}`}>
                      {profit >= 0 ? "+" : ""}{formatNaira(profit)}
                    </div>
                    <div className={`text-[10px] font-bold ${roi >= 20 ? "text-success" : "text-textgray"}`}>
                      {roi.toFixed(1)}% ROI
                    </div>
                  </td>
                  <td><StatusPill status={p.isOnline ? "success" : "error"} label={p.isOnline ? "Online" : "Offline"} /></td>
                  <td className="text-right">
                    <button className="btn-ghost btn-sm">Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      <Modal 
        open={!!dispatchModal} 
        onClose={() => setDispatchModal(null)} 
        title={`Dispatch Truck to ${dispatchModal?.name}`}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button className="btn-outline" onClick={() => setDispatchModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleDispatch} disabled={dispatchMutation.isPending}>
              {dispatchMutation.isPending ? "Dispatching..." : "Confirm Dispatch"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Source Hub</div>
            <div className="text-sm font-bold text-charcoal">{dispatchModal?.name}</div>
            <div className="text-[10px] text-primary/60">{dispatchModal?.address}</div>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-[11px] font-bold text-textgray uppercase ml-1">Select Logistics Partner</span>
                <select 
                  className="input mt-1" 
                  value={dispatchForm.partnerId} 
                  onChange={(e) => setDispatchForm(prev => ({ ...prev, partnerId: e.target.value }))}
                >
                  <option value="">Select a partner...</option>
                  {(partners || [])
                    .filter((p: any) => p.isOnline)
                    .sort((a: any, b: any) => {
                      if (!dispatchModal?.lat || !a.currentLat) return 0;
                      const distA = Math.sqrt(Math.pow(a.currentLat - dispatchModal.lat, 2) + Math.pow(a.currentLng - dispatchModal.lng, 2));
                      const distB = Math.sqrt(Math.pow(b.currentLat - dispatchModal.lat, 2) + Math.pow(b.currentLng - dispatchModal.lng, 2));
                      return distA - distB;
                    })
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.user?.firstName} {p.user?.lastName} ({p.vehicleType} · {formatKg(p.capacityKg)})
                      </option>
                    ))}
                </select>
                {partners?.filter((p: any) => p.isOnline).length === 0 && (
                  <div className="text-[10px] text-error mt-1 ml-1">No online partners available right now.</div>
                )}
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-bold text-textgray uppercase ml-1">Material</span>
                  <select 
                    className="input mt-1" 
                    value={dispatchForm.categoryId} 
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="">Select material...</option>
                    {categories?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-textgray uppercase ml-1">Weight (Kg)</span>
                  <input 
                    type="number" 
                    className="input mt-1" 
                    placeholder="0.00"
                    value={dispatchForm.weightKg || ""} 
                    onChange={(e) => setDispatchForm(prev => ({ ...prev, weightKg: Number(e.target.value) }))}
                  />
                </label>
              </div>

              {dispatchForm.weightKg > 0 && (
                <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-between animate-fadeIn">
                  <div>
                    <div className="text-[10px] font-bold text-gold uppercase tracking-widest">Est. Partner Payout</div>
                    <div className="text-sm font-black text-charcoal">₦{formatNumber(dispatchForm.weightKg * 15)}</div>
                  </div>
                  <div className="text-[10px] text-gold/60 font-bold italic">Base Rate: ₦15/kg</div>
                </div>
              )}

            <label className="block">
              <span className="text-[11px] font-bold text-textgray uppercase ml-1">Administrative Notes</span>
              <textarea 
                className="input mt-1 h-20 py-2" 
                placeholder="Specific instructions for the driver..."
                value={dispatchForm.notes} 
                onChange={(e) => setDispatchForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </label>
          </div>
        </div>
      </Modal>

      {/* Hubs */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
          <h3 className="text-h4">Processing Hubs</h3>
          <div className="flex-1" />
          <button className="btn-primary btn-sm"><Plus size={12} /> New Hub</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Hub Name</th><th>Address</th><th>Capacity</th><th>Activity</th><th className="text-right">Status</th></tr></thead>
          <tbody>
            {(hubs || []).map((h: any) => (
              <tr key={h.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-charcoal text-white"><Building2 size={14} /></div>
                    <span className="font-bold">{h.name}</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm">{h.address}</div>
                  <div className="text-[10px] text-textgray">{h.lga}, {h.state}</div>
                </td>
                <td className="font-mono">{formatKg(h.capacityKg)}</td>
                <td className="font-mono text-xs">{(h.currentLoadKg || 0) / (h.capacityKg || 5000) > 0.8 ? (
                  <span className="flex items-center gap-1.5 text-error font-bold animate-pulse">
                    <AlertCircle size={12} /> Critical ({(h.currentLoadKg || 0)}kg)
                  </span>
                ) : `${h.currentLoadKg || 0}kg / ${h.capacityKg || 5000}kg`}</td>
                <td className="text-right">
                  <PermissionGuard permissions={[PERMISSIONS.LOGISTICS_MANAGE]}>
                    <button 
                      className={`btn-sm ${(h.currentLoadKg || 0) / (h.capacityKg || 5000) > 0.8 ? "btn-primary !bg-error" : "btn-primary"}`} 
                      onClick={() => setDispatchModal(h)}
                    >
                      {(h.currentLoadKg || 0) / (h.capacityKg || 5000) > 0.8 ? "Dispatch Urgent" : "Dispatch"}
                    </button>
                  </PermissionGuard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      ) : (
        <div className="mt-6 card overflow-hidden animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-bordergray p-6 bg-cream/20 gap-4">
            <h3 className="text-h4 font-black whitespace-nowrap">System Activity Ledger</h3>
            <div className="flex flex-1 max-w-2xl gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
                <input 
                  type="text" 
                  placeholder="Search admin, action or details..."
                  className="inp pl-10 h-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="inp h-10 text-sm w-44"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="ALL">All Actions</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
                ))}
              </select>
              <button className="btn-primary btn-sm font-bold text-[10px] uppercase tracking-widest px-4"><Filter size={14} /> Filter</button>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Timestamp</th><th>Action</th><th>Target</th><th>Admin</th><th>Details</th></tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-cream/10">
                  <td className="font-mono text-[10px] text-textgray">{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="badge-primary !text-[10px] font-black tracking-tighter">{log.action.replace(/_/g, " ")}</span>
                  </td>
                  <td className="text-[11px] font-black uppercase text-charcoal">{log.entityType}</td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center shadow-sm"><UserIcon size={12} /></div>
                      {log.admin?.firstName ? `${log.admin.firstName} ${log.admin.lastName}` : (log.admin || "System")}
                    </div>
                  </td>
                  <td className="text-xs text-textgray max-w-xs truncate" title={log.details || log.action}>{log.details || log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-6 border-t border-bordergray bg-cream/10">
            <span className="text-xs font-bold text-textgray uppercase tracking-widest">
              Showing {Math.min(filteredLogs.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredLogs.length, currentPage * itemsPerPage)} of {filteredLogs.length} logs
            </span>
            <div className="flex gap-2">
              <button 
                className="btn-outline btn-sm px-4" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${currentPage === page ? "bg-primary text-cream shadow-lg shadow-primary/20" : "hover:bg-cream"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                className="btn-outline btn-sm px-4" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPartner && (
        <>
          <div className="fixed inset-0 z-[105] bg-charcoal/20 backdrop-blur-sm" onClick={() => setSelectedPartner(null)} />
          <LogisticsDetailDrawer partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
        </>
      )}

      {selectedWaybill && (
        <WaybillModal route={selectedWaybill} onClose={() => setSelectedWaybill(null)} />
      )}
    </>
  );
}
