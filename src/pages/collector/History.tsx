import { useState } from "react";
import { ArrowDown, Calendar, ChevronDown, Download, Filter, Search, Trash2, History as HistoryIcon, Wallet, Recycle, Coins, Loader2 } from "lucide-react";
import { PageHeader, StatusPill, KPICard } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira, cn } from "@/lib/cn";
import { CollectorSubmissionDrawer } from "@/components/CollectorSubmissionDrawer";
import { useSubmissions, useDashboard, useWithdrawalHistory, useDeleteWithdrawal } from "@/hooks/useCollector";

export default function CollectorHistory() {
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"submissions" | "payouts">("submissions");
  
  const { data: submissions, isLoading: loadingSubs } = useSubmissions();
  const { data: withdrawals, isLoading: loadingWiths } = useWithdrawalHistory();
  const { data: dashboard, isLoading: loadingDash } = useDashboard();
  const deleteMutation = useDeleteWithdrawal();

  if (loadingSubs || loadingWiths || loadingDash) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-bold text-textgray">Loading history...</p>
      </div>
    );
  }

  const totalKg = submissions?.reduce((acc: number, s: any) => acc + Number(s.totalWeightKg), 0) || 0;

  const handleDeletePayout = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hide this transaction from history?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        import("react-hot-toast").then(m => m.default.error("Failed to hide transaction"));
      }
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="Track your progress"
        subtitle="Every drop, photo, agent and naira — searchable, filterable, exportable."
        actions={<><button className="btn-outline"><Download size={14} /> Export CSV</button></>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Total submissions" value={submissions?.length || 0} sub="Lifetime drops" icon={Recycle} />
        <KPICard label="Total recovered" value={`${totalKg.toFixed(1)} kg`} sub={`${(totalKg / 1000).toFixed(2)} tonnes lifetime`} icon={Recycle} />
        <KPICard label="Total earned" value={formatNaira(dashboard?.totalEarned / 100)} sub={`Avg ${formatNaira((dashboard?.totalEarned / 100) / (submissions?.length || 1))}/drop`} icon={Coins} variant="gold" />
      </div>

      <div className="mt-8 flex gap-1 rounded-2xl bg-cream p-1.5 w-fit">
        <button 
          onClick={() => setTab("submissions")}
          className={cn("flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition", tab === "submissions" ? "bg-white shadow-sm text-primary" : "text-textgray hover:text-charcoal")}
        >
          <Recycle size={16} /> Submissions
        </button>
        <button 
          onClick={() => setTab("payouts")}
          className={cn("flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition", tab === "payouts" ? "bg-white shadow-sm text-primary" : "text-textgray hover:text-charcoal")}
        >
          <Wallet size={16} /> Payouts
        </button>
      </div>

      <div className="mt-6 card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-10" placeholder={`Search ${tab === "submissions" ? "drop ID, hub, agent" : "reference, method"}…`} />
          </div>
          <button className="btn-outline btn-sm"><Filter size={13} /> Filters</button>
          <button className="btn-outline btn-sm"><Calendar size={13} /> Last 30 days</button>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <table className="tbl">
          {tab === "submissions" ? (
            <>
              <thead>
                <tr><th>Drop ID</th><th>Date</th><th>Hub / Agent</th><th>Material</th><th>Weight</th><th className="text-right">Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {submissions?.map((s: any) => (
                  <tr key={s.id} className="cursor-pointer transition hover:bg-cream/30" onClick={() => setOpen(s.id)}>
                    <td className="font-mono text-xs font-bold text-primary">{s.id.slice(0, 8).toUpperCase()}</td>
                    <td className="text-textgray text-sm">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <div className="font-bold text-sm">{s.hub?.name || "Mobile Agent"}</div>
                      <div className="text-[11px] text-textgray">{s.agent?.user?.firstName || "Pending Verification"}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <CategoryIcon category={s.items[0]?.wasteCategory?.name || "Mixed"} size={26} />
                        {s.items[0]?.wasteCategory?.name || "Mixed"}
                      </div>
                    </td>
                    <td className="font-mono text-sm">{s.totalWeightKg} kg</td>
                    <td className="text-right"><span className="money text-success">+{formatNaira(s.totalAmount / 100)}</span></td>
                    <td>
                      <StatusPill 
                        status={
                          s.status === "VERIFIED" || s.status === "verified" ? "success" :
                          s.status === "PENDING" || s.status === "pending" ? "pending" :
                          "error"
                        } 
                        label={s.status.toLowerCase()} 
                      />
                    </td>
                  </tr>
                ))}
                {(!submissions || submissions.length === 0) && (
                  <tr><td colSpan={7} className="py-20 text-center text-textgray">No submissions found.</td></tr>
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr><th>Reference</th><th>Date</th><th>Method</th><th>Details</th><th className="text-right">Amount</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {withdrawals?.map((w: any) => (
                  <tr key={w.id} className="group transition hover:bg-cream/30">
                    <td className="font-mono text-xs font-bold text-primary">{(w.reference || w.id.slice(0, 8)).toUpperCase()}</td>
                    <td className="text-textgray text-sm">{new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="text-sm font-bold capitalize">{w.type.replace('_', ' ').toLowerCase()}</td>
                    <td className="text-xs text-textgray">
                      {w.type === 'BANK_TRANSFER' ? (
                        <>GTBank · {w.details?.accountNumber || "****"}</>
                      ) : (
                        <>{w.details?.network || 'Telecom'} · {w.details?.phoneNumber || "****"}</>
                      )}
                    </td>
                    <td className="text-right font-bold text-red-500">-{formatNaira(w.amount)}</td>
                    <td>
                      <StatusPill 
                        status={
                          w.status === "COMPLETED" ? "success" :
                          w.status === "PENDING" ? "pending" :
                          w.status === "FAILED" || w.status === "REJECTED" ? "error" :
                          "warning"
                        } 
                        label={w.status.toLowerCase()} 
                      />
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={(e) => handleDeletePayout(w.id, e)}
                        className="p-2 text-textgray hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!withdrawals || withdrawals.length === 0) && (
                  <tr><td colSpan={7} className="py-20 text-center text-textgray">No payout history found.</td></tr>
                )}
              </tbody>
            </>
          )}
        </table>
        
        <div className="flex items-center justify-between border-t border-bordergray bg-cream/40 px-6 py-4 text-sm">
          <div className="text-textgray">
            Showing <span className="font-bold text-charcoal">
              {tab === "submissions" ? submissions?.length || 0 : withdrawals?.length || 0}
            </span> items
          </div>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm disabled:opacity-50">Previous</button>
            <button className="btn-outline btn-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
      
      <CollectorSubmissionDrawer submissionId={open} onClose={() => setOpen(null)} />
    </>
  );
}
