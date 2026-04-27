import { useState } from "react";
import { Boxes, Building2, ShoppingCart } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { DataTable, type Column } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useFactoryDashboard } from "@/hooks/useFactory";
import { formatNaira, formatKg } from "@/lib/cn";

export default function FactoryMarketplace() {
  const { data } = useFactoryDashboard();
  const [order, setOrder] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderKg, setOrderKg] = useState<number>(1000);

  if (!data) return null;
  type Row = typeof data.supply[number];

  const columns: Column<Row>[] = [
    { key: "cat", header: "Category", render: (r) => <span className="font-bold">{r.category}</span>, searchValue: (r) => r.category },
    { key: "grade", header: "Grade", render: (r) => <StatusPill status={r.grade === "A" ? "success" : "info"} label={`Grade ${r.grade}`} />, searchValue: (r) => r.grade },
    { key: "kg", header: "Available", className: "font-mono", render: (r) => formatKg(r.kg, { compact: true }), searchValue: (r) => `${r.kg}` },
    { key: "hubs", header: "Hubs", render: (r) => <span className="inline-flex items-center gap-1"><Building2 size={12} className="text-textgray" /> {r.hubs}</span>, searchValue: (r) => `${r.hubs}` },
    { key: "price", header: "Rate / kg", className: "font-mono text-right", render: (r) => formatNaira(r.pricePerKg) },
    { key: "act", header: "", className: "text-right", render: (r) => (
      <button onClick={() => { setOrder(r); setOrderKg(Math.min(1000, r.kg)); }} className="btn-primary btn-sm"><ShoppingCart size={12} /> Order</button>
    ) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Factory portal"
        title="Supply marketplace"
        subtitle="Browse processed raw material across every hub on the network. Place an order in two clicks."
      />

      <div className="card overflow-hidden">
        <DataTable
          data={data.supply}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by material or grade…"
          filterOptions={[
            { label: "Grade A only", value: "A" },
            { label: "Grade B only", value: "B" },
          ]}
          filterPredicate={(r, v) => r.grade === v}
          pageSize={6}
        />
      </div>

      <Modal
        open={!!order}
        onClose={() => setOrder(null)}
        title={`Order · ${order?.category ?? ""}`}
        description={`Available: ${order ? formatKg(order.kg) : ""} · ${order ? formatNaira(order.pricePerKg) : ""} / kg`}
        footer={
          <>
            <button onClick={() => setOrder(null)} className="btn-outline">Cancel</button>
            <button onClick={() => { setOrder(null); setSuccess(true); }} className="btn-primary">Place order</button>
          </>
        }
      >
        {order && (
          <div className="space-y-4">
            <div>
              <label className="label">Quantity (kg)</label>
              <input
                type="number"
                className="input font-mono"
                value={orderKg}
                onChange={(e) => setOrderKg(Math.min(order.kg, Math.max(0, +e.target.value || 0)))}
                max={order.kg}
                min={0}
              />
              <input
                type="range"
                min={0}
                max={order.kg}
                value={orderKg}
                onChange={(e) => setOrderKg(+e.target.value)}
                className="mt-3 w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-[11px] text-textgray">
                <span>0 kg</span>
                <span>{formatKg(order.kg)} max</span>
              </div>
            </div>
            <div>
              <label className="label">Deliver to</label>
              <select className="input">
                <option>Indorama Onne Plant — Port Harcourt</option>
                <option>Indorama Lagos Depot</option>
              </select>
            </div>
            <div className="rounded-2xl bg-mint p-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Subtotal</span>
                <span className="font-mono">{formatNaira(orderKg * order.pricePerKg)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-textgray">
                <span>Logistics estimate</span>
                <span className="font-mono">{formatNaira(orderKg * 18)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-primary/15 pt-3 font-extrabold">
                <span>Total</span>
                <span className="font-mono text-lg">{formatNaira(orderKg * (order.pricePerKg + 18))}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={success}
        onClose={() => setSuccess(false)}
        title="Order placed"
        description="The hub has been notified. You'll see a shipment update within 4 hours."
        footer={<button onClick={() => setSuccess(false)} className="btn-primary">Done</button>}
      >
        <div className="rounded-2xl bg-success-50 p-4 text-sm text-success">
          ✓ Order ord_{Math.floor(Math.random() * 9000 + 1000)} confirmed — ETA 48–72 hours.
        </div>
      </Modal>
    </>
  );
}
