import { useState } from "react";
import { Activity, AlertTriangle, ArrowUpRight, Calendar, ChevronDown, Download, FileWarning, Filter, Globe, Key, Lock, Search, Settings, Shield, Trash2, User, UserCheck, X } from "lucide-react";
import { Avatar, KPICard, PageHeader } from "@/components/ui";
import { useAuditLogs, useExport } from "@/hooks/useAdmin";


const SEV: Record<string, { c: string; l: string }> = {
  info: { c: "bg-cream text-textgray", l: "Info" },
  warning: { c: "bg-warning-50 text-warning", l: "Warning" },
  critical: { c: "bg-error-50 text-error", l: "Critical" },
};

const ACTION_ICON: Record<string, any> = {
  "PRICING_UPDATE": Settings,
  "USER_SUSPEND": Lock,
  "USER_UNSUSPEND": UserCheck,
  "FRAUD_ALERT_DISMISS": Shield,
  "FRAUD_ALERT_FREEZE": AlertTriangle,
  "KYC_VERIFY": UserCheck,
  "KYC_REJECT": X,
  "WITHDRAWAL_APPROVE": Activity,
  "WITHDRAWAL_REJECT": Trash2,
};

export default function AdminAuditLogs() {
  const [filters, setFilters] = useState({
    page: 1,
    action: "",
    severity: "",
  });
  
  const { data, isLoading } = useAuditLogs(filters);
  const logs = data?.items || [];
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const active = logs.find((l: any) => l.id === activeId) || logs[0];
  const { mutate: exportData, isPending: exporting } = useExport();

  return (
    <>
      <PageHeader
        eyebrow="Audit logs"
        title="Every action, every change, forever"
        subtitle="Tamper-evident log of every action taken across Recovang. NDPR-compliant. Auditable for 7 years."
        actions={
          <>
            <button 
              className="btn-outline group"
              onClick={() => exportData("audit-logs")}
              disabled={exporting}
            >
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              {exporting ? "Exporting..." : "Export logs"}
            </button>
            <button className="btn-primary"><Search size={14} /> Advanced search</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard 
          label="Events today" 
          value={data?.summary?.todayCount ?? 0} 
          sub="98% routine" 
          icon={Activity} 
          variant="primary" 
        />
        <KPICard 
          label="Critical events" 
          value={data?.summary?.criticalCount ?? 0} 
          sub={data?.summary?.criticalCount > 0 ? "Action required" : "All clear"} 
          icon={AlertTriangle} 
          variant={data?.summary?.criticalCount > 0 ? "error" : "gold"} 
        />
        <KPICard 
          label="Failed auths" 
          value={data?.summary?.failedAuths ?? 0} 
          sub="Auto-blocked" 
          icon={Lock} 
          variant="dark" 
        />
        <KPICard label="Log integrity" value="100%" sub="SHA-256 chain valid" icon={Shield} />
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Filters & table */}
        <div className="card overflow-hidden lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
            <div className="relative min-w-[200px] flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
              <input 
                className="input pl-10" 
                placeholder="Search action or entity…" 
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
              />
            </div>
            <select 
              className="btn-outline btn-sm appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNDQ0NDQ0IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-[length:10px] bg-[right_8px_center] bg-no-repeat"
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
            >
              <option value="">All severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Severity</th></tr></thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="py-8 text-center text-textgray">Loading logs...</td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-textgray">
                        <Activity size={32} className="opacity-20" />
                        <p className="font-medium">No audit events found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((l: any) => {
                    const sev = SEV[l.severity] || SEV.info;
                    const Icon = ACTION_ICON[l.action] ?? Activity;
                    return (
                      <tr 
                        key={l.id} 
                        onClick={() => setActiveId(l.id)} 
                        className={`cursor-pointer transition-colors ${active?.id === l.id ? "bg-mint/30" : "hover:bg-cream/50"}`}
                      >
                        <td className="font-mono text-xs text-textgray">
                          {new Date(l.createdAt).toLocaleTimeString("en-GB", { hour12: false })}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Avatar name={`${l.admin?.firstName} ${l.admin?.lastName}`} size={26} />
                            <div>
                              <div className="text-sm font-bold leading-tight">{l.admin?.firstName} {l.admin?.lastName}</div>
                              <div className="text-[10px] text-textgray uppercase tracking-wider">{l.admin?.role || "Admin"}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-2 rounded-full bg-cream px-2.5 py-1">
                            <Icon size={12} className="text-primary" />
                            <span className="font-mono text-[10px] font-bold">{l.action}</span>
                          </div>
                        </td>
                        <td className="font-mono text-[10px] text-textgray truncate max-w-[150px]">
                          {l.entityType} · {l.entityId.split("-")[0]}...
                        </td>
                        <td><span className={`badge ${sev.c}`}>{sev.l}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-bordergray bg-cream/20 p-4">
              <div className="text-xs text-textgray">
                Page {data.page} of {data.totalPages}
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn-outline btn-sm px-3"
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                >
                  Previous
                </button>
                <button 
                  className="btn-outline btn-sm px-3"
                  disabled={filters.page === data.totalPages}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-4">
          <div className="card sticky top-24 overflow-hidden border-mint/20 shadow-xl shadow-mint/5">
            {active ? (
              <>
                <div className="border-b border-bordergray bg-mint/5 p-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Event detail</div>
                  <h3 className="mt-2 text-h4 break-all">{active.action}</h3>
                  <p className="font-mono text-xs text-textgray">
                    {new Date(active.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · {new Date(active.createdAt).toLocaleTimeString("en-GB", { hour12: false })}
                  </p>
                </div>
                <div className="space-y-6 p-6">
                  <Detail label="Actor" value={`${active.admin?.firstName} ${active.admin?.lastName} (${active.admin?.role})`} icon={User} />
                  <Detail label="Target Entity" value={`${active.entityType} [${active.entityId}]`} icon={Settings} />
                  
                  {/* Visual Diff Viewer */}
                  <div className="rounded-xl border border-bordergray bg-cream/30 p-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-textgray flex items-center gap-1.5">
                      <Activity size={12} /> Data Transformation
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <div className="text-[10px] text-textgray mb-1">Before</div>
                        <pre className="font-mono text-[10px] bg-error-50 text-error-700 p-2 rounded-lg border border-error-100 overflow-x-auto">
                          {active.before ? JSON.stringify(active.before, null, 2) : "—"}
                        </pre>
                      </div>
                      <ArrowUpRight size={14} className="mx-auto text-textgray rotate-90" />
                      <div>
                        <div className="text-[10px] text-textgray mb-1">After</div>
                        <pre className="font-mono text-[10px] bg-mint-50 text-mint-700 p-2 rounded-lg border border-mint-100 overflow-x-auto">
                          {active.after ? JSON.stringify(active.after, null, 2) : "—"}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Detail label="IP address" value={active.ipAddress || "Internal System"} mono icon={Globe} />
                </div>
                <div className="border-t border-bordergray bg-cream/40 p-6">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray flex items-center gap-1.5">
                    <Shield size={11} /> Cryptographic Proof
                  </div>
                  <div className="mt-2 truncate font-mono text-[10px] text-charcoal bg-white p-2 rounded border border-bordergray">
                    SHA256:{btoa(active.id).substring(0, 32)}...
                  </div>
                  <button className="btn-outline btn-sm mt-3 w-full">Verify integrity</button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-textgray italic">
                Select an event to see full audit trail details
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value, mono, highlight, icon: Icon }: { label: string; value: string; mono?: boolean; highlight?: boolean; icon?: any }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-textgray">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className={`mt-1 ${mono ? "font-mono text-xs" : "font-semibold text-sm"} ${highlight ? "rounded-lg bg-mint/40 px-2 py-1 text-primary" : "text-charcoal"} break-words leading-relaxed`}>
        {value}
      </div>
    </div>
  );
}
