import { useState } from "react";
import { Wallet, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, StatusPill, Avatar } from "@/components/ui";
import { useAdminPayouts, useWithdrawals } from "@/hooks/useAdmin";
import { DataTable, type Column } from "@/components/DataTable";
import { formatNaira } from "@/lib/cn";

// Mock data for the table until useQuery is fully connected
const MOCK_PAYOUTS = [
  { id: "wd-101", user: "Adaeze Nwosu", role: "Collector", amount: 45000, bank: "GTBank", accountNo: "0123456789", status: "pending", date: "2 mins ago" },
  { id: "wd-102", user: "Tunde Bello", role: "Collector", amount: 12500, bank: "Access Bank", accountNo: "0698765432", status: "pending", date: "15 mins ago" },
  { id: "wd-103", user: "Folake Adeola", role: "Agent", amount: 150000, bank: "Zenith Bank", accountNo: "1002003004", status: "pending", date: "1 hour ago" },
  { id: "wd-104", user: "Kunle Bakare", role: "Collector", amount: 8400, bank: "First Bank", accountNo: "3021456987", status: "pending", date: "3 hours ago" },
];

export default function AdminPayouts() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { mutate: bulkApprove, isPending } = useAdminPayouts();
  const { data: withdrawals, isLoading } = useWithdrawals("pending");

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
      searchValue: (row) => `${row.user?.firstName} ${row.user?.lastName}`,
      render: (row) => {
        const name = `${row.user?.firstName} ${row.user?.lastName}`;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={name} size={32} />
            <div>
              <div className="font-bold text-sm">{name}</div>
              <div className="text-xs text-textgray">{row.user?.role}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "amount",
      header: "Amount",
      className: "text-right",
      render: (row) => <span className="font-bold">{formatNaira(row.amount)}</span>
    },
    {
      key: "bank",
      header: "Destination Bank",
      render: (row) => (
        <div>
          <div className="font-medium text-sm">{row.bankName || "N/A"}</div>
          <div className="text-xs font-mono text-textgray">{row.accountNumber || "N/A"}</div>
        </div>
      )
    },
    {
      key: "date",
      header: "Requested",
      render: (row) => <span className="text-sm text-textgray">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusPill status="warning" label={row.status || "pending"} />
    }
  ];

  const totalSelectedAmount = Array.from(selectedIds).reduce((sum, id) => {
    const row = data.find(d => d.id === id);
    return sum + (row?.amount || 0);
  }, 0);

  return (
    <>
      <PageHeader
        eyebrow="Financial control"
        title="Payout Queue"
        subtitle="Review and bulk approve withdrawal requests from collectors and agents."
      />

      <div className="mt-6 card overflow-hidden">
        <div className="p-4 border-b border-bordergray bg-cream/30 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="accent-primary w-4 h-4 rounded border-bordergray"
              checked={selectedIds.size > 0 && selectedIds.size === data.length}
              onChange={toggleSelectAll}
            />
            <span className="text-sm font-bold">Select All</span>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
              <div className="text-sm">
                <span className="font-bold">{selectedIds.size}</span> selected 
                (<span className="font-bold text-primary">{formatNaira(totalSelectedAmount)}</span>)
              </div>
              <button 
                onClick={handleBulkApprove} 
                disabled={isPending}
                className="btn-primary py-1.5"
              >
                <CheckCircle2 size={16} /> 
                {isPending ? "Approving..." : "Approve Selected"}
              </button>
            </div>
          )}
        </div>

        <DataTable
          data={data}
          columns={columns}
          rowKey={(row) => row.id}
          searchPlaceholder="Search by name..."
        />
      </div>
    </>
  );
}
