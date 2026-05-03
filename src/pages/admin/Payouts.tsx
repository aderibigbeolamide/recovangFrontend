import { useState } from "react";
import { Wallet, CheckCircle2, Clock, Activity, ArrowUpRight, ArrowDownRight, Info, ShieldAlert, Download, X } from "lucide-react";
import { PageHeader, StatusPill, Avatar } from "@/components/ui";
import { useAdminPayouts, useWithdrawals, useTreasury, useExport } from "@/hooks/useAdmin";
import { DataTable, type Column } from "@/components/DataTable";
import { formatNaira } from "@/lib/cn";
import { useAuth } from "@/store/auth";
import PayoutDetailDrawer from "@/components/PayoutDetailDrawer";

export default function AdminPayouts() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const { mutate: bulkApprove, isPending } = useAdminPayouts();
  const { mutate: exportData, isPending: exporting } = useExport();
  const { data: withdrawals, isLoading } = useWithdrawals(activeTab);
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";

  const tabs = [
    { id: "pending", label: "Pending", icon: Clock, count: withdrawals?.length || 0 },
    { id: "flagged", label: "Flagged", icon: ShieldAlert, color: "text-warning" },
    { id: "rejected", label: "Rejected", icon: X, color: "text-error" },
    { id: "completed", label: "Completed", icon: CheckCircle2, color: "text-success" },
  ];

  const data = Array.isArray(withdrawals) ? withdrawals : [];

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    bulkApprove(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
      }
    });
  };

  const handleExport = () => {
    if (!data.length) return;
    const headers = ["ID", "Collector", "Amount", "Fee", "Tax", "Net", "Bank", "Account", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.id,
        `"${row.collector?.user?.firstName} ${row.collector?.user?.lastName}"`,
        row.grossAmount,
        row.feeAmount,
        row.taxAmount,
        row.amount,
        row.details?.bankName,
        `'${row.details?.accountNumber}`,
        row.status,
        new Date(row.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payouts_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSelectedAmount = Array.from(selectedIds).reduce((sum, id) => {
    const row = data.find(d => d.id === id);
    return sum + (Number(row?.amount) || 0);
  }, 0);

  const columns: Column<any>[] = [
    {
      key: "select",
      header: "",
      render: (row) => (
        <input 
          type="checkbox" 
          className="accent-primary w-4 h-4 rounded border-bordergray"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelect(row.id)}
        />
      ),
    },
    {
      key: "user",
      header: "User / Role",
      searchValue: (row) => {
        const user = row.collector?.user;
        return `${user?.firstName} ${user?.lastName}`;
      },
      render: (row) => {
        const user = row.collector?.user;
        const name = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
        return (
          <div className="flex items-center gap-3">
            <Avatar name={name} size={32} />
            <div>
              <div className="font-bold text-sm leading-tight">{name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black uppercase text-textgray tracking-tighter bg-cream/50 px-1 rounded">{user?.role || "Collector"}</span>
                {Number(row.amount) > 100000 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black text-error animate-pulse"><ShieldAlert size={10} /> HIGH VALUE</span>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: "breakdown",
      header: "Financial Breakdown",
      className: "text-right",
      render: (row) => (
        <div className="text-right">
          <div className="text-xs text-textgray line-through decoration-textgray/30">{formatNaira(Number(row.grossAmount) || Number(row.amount) * 1.06)}</div>
          <div className="font-black text-primary">{formatNaira(Number(row.amount))}</div>
          <div className="text-[9px] font-bold text-textgray/60 uppercase">incl. ₦{(Number(row.feeAmount) || Number(row.amount) * 0.05).toFixed(0)} fee</div>
        </div>
      )
    },
    {
      key: "bank",
      header: "Destination Bank",
      render: (row) => (
        <div>
          <div className="font-bold text-sm text-charcoal">{row.details?.bankName || "GTBank"}</div>
          <div className="text-[10px] font-mono text-textgray tracking-widest">{row.details?.accountNumber || "0123456789"}</div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const status = (row.status || "pending").toLowerCase();
        const colors: any = {
          pending: "warning",
          flagged: "warning",
          rejected: "error",
          completed: "success"
        };
        return (
          <div className="flex flex-col gap-1 items-start">
            <StatusPill status={colors[status] || "warning"} label={status} />
            {row.errorMessage && status === "rejected" && (
              <span className="text-[9px] text-error font-bold italic mt-1 max-w-[120px] truncate">{row.errorMessage}</span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Financial control"
        title="Payout Treasury"
        subtitle="Manage collector withdrawals, platform fees, and tax compliance."
        actions={
          <div className="flex gap-2">
            <button 
              className="btn-outline btn-sm font-bold text-[10px] uppercase tracking-widest"
              onClick={() => setActiveTab("completed")}
            >
              <Activity size={14} /> Settlement Logs
            </button>
            <button 
              className="btn-primary btn-sm font-bold text-[10px] uppercase tracking-widest"
              onClick={handleExport}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        }
      />

      {isSuperAdmin && <TreasuryOverview />}

      <div className="mt-8 flex gap-2 border-b border-bordergray overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedIds(new Set());
            }}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? "text-primary" : "text-textgray hover:text-charcoal"
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-primary" : "text-textgray/40"} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 card overflow-hidden border-2 border-primary/5 shadow-xl shadow-primary/5">
        <div className="p-4 border-b border-bordergray bg-cream/30 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="accent-primary w-4 h-4 rounded border-bordergray cursor-pointer"
              checked={selectedIds.size > 0 && selectedIds.size === data.length}
              onChange={toggleSelectAll}
            />
            <span className="text-xs font-black uppercase tracking-widest text-textgray">
              Select All {activeTab}
            </span>
          </div>

          {selectedIds.size > 0 && activeTab === "pending" && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
              <div className="text-xs font-bold px-3 py-1 bg-white rounded-full border border-bordergray shadow-sm">
                <span className="text-primary">{selectedIds.size}</span> Transactions | Total: <span className="text-charcoal font-black">{formatNaira(totalSelectedAmount)}</span>
              </div>
              <button 
                onClick={handleBulkApprove} 
                disabled={isPending}
                className="btn-primary py-2 px-6 shadow-lg shadow-primary/20 scale-105"
              >
                <CheckCircle2 size={18} /> 
                {isPending ? "Processing..." : "Authorize Bulk Payout"}
              </button>
            </div>
          )}
        </div>

        <DataTable
          data={data}
          columns={columns}
          rowKey={(row) => row.id}
          searchPlaceholder="Search by collector name..."
          onRowClick={(row) => setSelectedPayout(row)}
        />
      </div>

      <PayoutDetailDrawer 
        payout={selectedPayout}
        onClose={() => setSelectedPayout(null)}
      />
    </>
  );
}

function TreasuryOverview() {
  const { data: report, isLoading } = useTreasury();

  if (isLoading) return <div className="mt-6 h-48 animate-pulse rounded-3xl bg-charcoal/5" />;

  const stats = [
    { label: "Platform Revenue (Fees)", value: report?.totalRevenueNGN, icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Disbursed", value: report?.totalDisbursedNGN, icon: ArrowDownRight, color: "text-red-600", bg: "bg-red-50" },
    { label: "Tax Withheld (WHT)", value: report?.totalTaxWithheldNGN, icon: ShieldAlert, color: "text-gold", bg: "bg-gold/10" },
    { label: "Liquidity (Wallet)", value: report?.currentLiquidityNGN, icon: Wallet, color: (Number(report?.currentLiquidityNGN) || 0) > (Number(report?.pendingPayoutsNGN) || 0) ? "text-primary" : "text-error", bg: "bg-primary/5" },
  ];

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {stats.map((s) => (
        <div key={s.label} className="rounded-3xl border border-bordergray bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`grid h-10 w-10 place-items-center rounded-2xl ${s.bg} ${s.color}`}>
              <s.icon size={20} />
            </div>
            {s.label.includes("Revenue") && (
              <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-black text-success uppercase tracking-tighter">
                <CheckCircle2 size={10} /> Live Profit
              </div>
            )}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-textgray mb-1">{s.label}</div>
          <div className="font-mono text-xl font-black text-charcoal">{formatNaira(s.value || 0)}</div>
          {s.label === "Liquidity (Wallet)" && report?.pendingPayoutsNGN > 0 && (
            <div className="mt-2 text-[9px] font-bold text-textgray">
              LIABILITY: <span className="text-error">{formatNaira(report.pendingPayoutsNGN)}</span> PENDING
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
