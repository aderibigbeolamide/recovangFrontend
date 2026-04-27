import { useState } from "react";
import { Eye, X } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { DataTable, type Column } from "@/components/DataTable";
import { Modal, ConfirmModal } from "@/components/Modal";
import { useFactoryDashboard, FACTORY_MOCK } from "@/hooks/useFactory";
import { formatNaira } from "@/lib/cn";

export default function FactoryOrders() {
  const { data } = useFactoryDashboard();
  const [view, setView] = useState<any | null>(null);
  const [cancel, setCancel] = useState<any | null>(null);
  const [orders, setOrders] = useState(data?.orders ?? FACTORY_MOCK.orders);

  function doCancel() {
    if (!cancel) return;
    setOrders((os) => os.map((o) => (o.id === cancel.id ? { ...o, status: "cancelled", eta: "—" } : o)));
  }

  type Row = (typeof orders)[number];

  const columns: Column<Row>[] = [
    { key: "id", header: "Order", className: "font-mono text-xs", render: (r) => r.id, searchValue: (r) => r.id },
    { key: "date", header: "Date", render: (r) => r.date, searchValue: (r) => r.date },
    { key: "cat", header: "Material", render: (r) => <span className="font-bold">{r.category}</span>, searchValue: (r) => r.category },
    { key: "kg", header: "Weight", className: "font-mono", render: (r) => `${r.kg.toLocaleString()} kg` },
    { key: "hub", header: "Origin", render: (r) => r.hub, searchValue: (r) => r.hub },
    { key: "total", header: "Total", className: "font-mono text-right", render: (r) => formatNaira(r.total) },
    { key: "status", header: "Status", render: (r) => (
      <StatusPill
        status={r.status === "delivered" ? "success" : r.status === "in-transit" || r.status === "processing" ? "pending" : "error"}
        label={r.status}
      />
    ) },
    { key: "act", header: "", className: "text-right", render: (r) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => setView(r)} className="btn-ghost btn-sm" aria-label="View"><Eye size={12} /></button>
        {(r.status === "in-transit" || r.status === "processing") && (
          <button onClick={() => setCancel(r)} className="btn-ghost btn-sm text-error" aria-label="Cancel"><X size={12} /></button>
        )}
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Factory portal"
        title="Order management"
        subtitle="Place, track and cancel purchase orders. Search, filter or export — your choice."
      />

      <div className="card overflow-hidden">
        <DataTable
          data={orders}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by order ID, material or hub…"
          filterOptions={[
            { label: "In-transit", value: "in-transit" },
            { label: "Processing", value: "processing" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          filterPredicate={(r, v) => r.status === v}
          pageSize={8}
        />
      </div>

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={`Order ${view?.id ?? ""}`}
        description={view?.category}
        size="lg"
        footer={<button onClick={() => setView(null)} className="btn-primary">Close</button>}
      >
        {view && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Order ID" value={view.id} />
            <Detail label="Date" value={view.date} />
            <Detail label="Origin hub" value={view.hub} />
            <Detail label="ETA" value={view.eta} />
            <Detail label="Weight" value={`${view.kg.toLocaleString()} kg`} />
            <Detail label="Total" value={formatNaira(view.total)} />
            <Detail label="Status" value={<StatusPill status={view.status === "delivered" ? "success" : view.status === "cancelled" ? "error" : "pending"} label={view.status} />} />
            <Detail label="Carrier" value="RCL Logistics" />
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!cancel}
        onClose={() => setCancel(null)}
        onConfirm={doCancel}
        tone="danger"
        title={`Cancel ${cancel?.id ?? ""}?`}
        description="The hub will be notified and any prepared stock returned to inventory."
        confirmLabel="Cancel order"
      />
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-cream p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">{label}</div>
      <div className="mt-1.5 font-bold text-charcoal">{value}</div>
    </div>
  );
}
