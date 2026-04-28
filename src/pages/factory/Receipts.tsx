import { useState } from "react";
import { Camera, CheckCircle2, X } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { DataTable, type Column } from "@/components/DataTable";
import { Modal, ConfirmModal } from "@/components/Modal";
import { useFactoryDashboard, FACTORY_MOCK } from "@/hooks/useFactory";
import { formatNumber } from "@/lib/cn";

export default function FactoryReceipts() {
  const { data } = useFactoryDashboard();
  const [receipts, setReceipts] = useState(data?.receipts ?? FACTORY_MOCK.receipts);
  const [verify, setVerify] = useState<any | null>(null);
  const [reject, setReject] = useState<any | null>(null);
  const [actualKg, setActualKg] = useState<number>(0);
  const [qaScore, setQaScore] = useState<number>(95);

  function open(r: any) {
    setVerify(r);
    setActualKg(r.deliveredKg);
    setQaScore(r.qaScore);
  }

  function confirmVerify() {
    if (!verify) return;
    setReceipts((rs) => rs.map((x) => (x.id === verify.id ? { ...x, status: "verified", deliveredKg: actualKg, qaScore } : x)));
    setVerify(null);
  }

  function doReject() {
    if (!reject) return;
    setReceipts((rs) => rs.map((x) => (x.id === reject.id ? { ...x, status: "rejected" } : x)));
  }

  type Row = (typeof receipts)[number];
  const columns: Column<Row>[] = [
    { key: "id", header: "Receipt", className: "font-mono text-xs", render: (r) => r.id, searchValue: (r) => r.id },
    { key: "ord", header: "Order", className: "font-mono text-xs", render: (r) => r.orderId, searchValue: (r) => r.orderId },
    { key: "exp", header: "Expected", className: "font-mono", render: (r) => `${formatNumber(r.expectedKg)} kg` },
    { key: "del", header: "Delivered", className: "font-mono", render: (r) => `${formatNumber(r.deliveredKg)} kg` },
    { key: "var", header: "Variance", render: (r) => (
      <span className={r.variancePct < -1 ? "font-mono font-bold text-error" : "font-mono font-bold text-success"}>
        {r.variancePct > 0 ? "+" : ""}{r.variancePct}%
      </span>
    ) },
    { key: "qa", header: "QA score", className: "font-mono", render: (r) => `${r.qaScore} / 100` },
    { key: "status", header: "Status", render: (r) => (
      <StatusPill status={r.status === "verified" ? "success" : r.status === "rejected" ? "error" : "pending"} label={r.status} />
    ) },
    { key: "act", header: "", className: "text-right", render: (r) => (
      r.status === "pending" ? (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => open(r)} className="btn-primary btn-sm"><CheckCircle2 size={12} /> Verify</button>
          <button onClick={() => setReject(r)} className="btn-ghost btn-sm text-error"><X size={12} /></button>
        </div>
      ) : null
    ) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Factory portal"
        title="Receipt verification"
        subtitle="Confirm weight and quality on every load arriving at your gate."
      />

      <div className="card overflow-hidden">
        <DataTable
          data={receipts}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by receipt or order…"
          filterOptions={[
            { label: "Pending", value: "pending" },
            { label: "Verified", value: "verified" },
            { label: "Rejected", value: "rejected" },
          ]}
          filterPredicate={(r, v) => r.status === v}
          pageSize={6}
        />
      </div>

      <Modal
        open={!!verify}
        onClose={() => setVerify(null)}
        title="Verify receipt"
        description="Adjust the actual delivered weight and QA score, then confirm."
        footer={
          <>
            <button onClick={() => setVerify(null)} className="btn-outline">Cancel</button>
            <button onClick={confirmVerify} className="btn-primary"><CheckCircle2 size={14} /> Confirm receipt</button>
          </>
        }
      >
        {verify && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Expected</div>
                <div className="mt-1 font-mono text-lg font-extrabold">{formatNumber(verify.expectedKg)} kg</div>
              </div>
              <div className="rounded-2xl bg-mint p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">On the scale</div>
                <input
                  type="number"
                  value={actualKg}
                  onChange={(e) => setActualKg(+e.target.value || 0)}
                  className="mt-1 w-full bg-transparent font-mono text-lg font-extrabold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="label">QA score: {qaScore}</label>
              <input type="range" min={0} max={100} value={qaScore} onChange={(e) => setQaScore(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="btn-outline btn-sm"><Camera size={12} /> Scale photo</button>
              <button className="btn-outline btn-sm"><Camera size={12} /> Load photo</button>
              <button className="btn-outline btn-sm"><Camera size={12} /> QA sample</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!reject}
        onClose={() => setReject(null)}
        onConfirm={doReject}
        tone="danger"
        title={`Reject ${reject?.id ?? ""}?`}
        description="A dispute will be opened with the hub. Shipment fee will be reversed."
        confirmLabel="Reject load"
      />
    </>
  );
}
