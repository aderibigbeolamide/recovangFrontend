import { useState } from "react";
import { Coins, Download, ShieldCheck, Wallet } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { DataTable, type Column } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useBrandDashboard } from "@/hooks/useBrand";
import { formatNaira, formatNumber } from "@/lib/cn";

export default function BrandPayments() {
  const { data } = useBrandDashboard();
  const [pay, setPay] = useState(false);
  const [success, setSuccess] = useState(false);
  if (!data) return null;

  type Row = typeof data.payments[number];
  const columns: Column<Row>[] = [
    { key: "ref", header: "Reference", className: "font-mono text-xs", render: (r) => r.ref, searchValue: (r) => r.ref },
    { key: "date", header: "Date", render: (r) => r.date, searchValue: (r) => r.date },
    { key: "qtr", header: "Quarter", render: (r) => <span className="badge bg-mint text-primary">{r.quarter}</span>, searchValue: (r) => r.quarter },
    { key: "amount", header: "Amount", className: "text-right font-mono font-extrabold", render: (r) => formatNaira(r.amount) },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status === "paid" ? "success" : "pending"} label={r.status} /> },
    { key: "act", header: "", className: "text-right", render: () => <button className="btn-ghost btn-sm"><Download size={12} /> Receipt</button> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Brand portal"
        title="Compliance payments"
        subtitle="Pay quarterly EPR fees through Paystack and pull every receipt for your auditors."
        actions={<button onClick={() => setPay(true)} className="btn-primary"><Coins size={14} /> Pay outstanding</button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Outstanding (Q2 2026)" value={formatNaira(data.outstandingFee)} sub="Due May 30, 2026" icon={Wallet} variant="gold" />
        <KPICard label="Paid year to date" value={formatNaira(data.payments.reduce((s: number, p: any) => s + p.amount, 0))} sub={`${data.payments.length} payments`} icon={Coins} variant="primary" />
        <KPICard label="Next certificate" value="Jul 2026" sub="Auto-issued at 100%" icon={ShieldCheck} variant="dark" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4">Payment history</h3>
          <p className="text-sm text-textgray">Searchable, filterable and exportable.</p>
        </div>
        <DataTable
          data={data.payments}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by reference or quarter…"
          filterOptions={[
            { label: "Paid", value: "paid" },
            { label: "Pending", value: "pending" },
          ]}
          filterPredicate={(r, v) => r.status === v}
          pageSize={6}
        />
      </div>

      <Modal
        open={pay}
        onClose={() => setPay(false)}
        title="Initiate compliance payment"
        description="Paystack will issue a secure card form to your finance team."
        footer={
          <>
            <button onClick={() => setPay(false)} className="btn-outline">Cancel</button>
            <button onClick={() => { setPay(false); setSuccess(true); }} className="btn-primary">Continue to Paystack</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Quarter</label>
            <select className="input">
              <option>Q2 2026 — outstanding {formatNaira(data.outstandingFee)}</option>
            </select>
          </div>
          <div>
            <label className="label">Email receipt to</label>
            <input className="input" defaultValue="finance@coca-cola.ng" />
          </div>
          <div>
            <label className="label">Amount</label>
            <input className="input font-mono text-lg font-extrabold" defaultValue={formatNumber(data?.outstandingFee ?? 0)} />
          </div>
        </div>
      </Modal>

      <Modal
        open={success}
        onClose={() => setSuccess(false)}
        title="Payment initiated"
        description="A secure Paystack tab opens in production. Auditor receipt is auto-generated."
        footer={<button onClick={() => setSuccess(false)} className="btn-primary">Done</button>}
      >
        <div className="rounded-2xl bg-success-50 p-4 text-sm text-success">
          ✓ Reference TX-CCN-{Math.floor(Math.random() * 9000 + 1000)} created.
        </div>
      </Modal>
    </>
  );
}
