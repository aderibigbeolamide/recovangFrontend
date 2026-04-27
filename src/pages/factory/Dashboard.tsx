import { Link } from "react-router-dom";
import { ArrowRight, Boxes, ClipboardCheck, Coins, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart } from "@/components/charts";
import { useFactoryDashboard } from "@/hooks/useFactory";
import { formatNaira, formatKg } from "@/lib/cn";

export default function FactoryDashboard() {
  const { data } = useFactoryDashboard();
  if (!data) return null;

  const totalKg = data.supply.reduce((s: number, x: any) => s + x.kg, 0);
  const ordersValue = data.orders.reduce((s: number, x: any) => s + x.total, 0);
  const inTransit = data.shipments.filter((s: any) => s.status === "in-transit" || s.status === "loading").length;
  const pendingReceipts = data.receipts.filter((r: any) => r.status === "pending").length;

  const monthly = [
    { label: "W1", value: 22000 },
    { label: "W2", value: 28400 },
    { label: "W3", value: 31200 },
    { label: "W4", value: 36800 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Factory portal · Indorama PET Recyclers"
        title="Inventory & purchasing overview"
        subtitle="Live stock across every Recovang hub on the African continent."
        actions={
          <>
            <Link to="/factory/marketplace" className="btn-outline"><ShoppingCart size={14} /> Browse marketplace</Link>
            <Link to="/factory/orders" className="btn-primary"><Boxes size={14} /> View orders</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Available stock" value={formatKg(totalKg, { compact: true })} sub={`${data.supply.length} categories live`} icon={Boxes} variant="primary" />
        <KPICard label="Orders value (30d)" value={formatNaira(ordersValue, { compact: true })} sub={`${data.orders.length} orders`} icon={Coins} variant="gold" trend={{ value: "+18% MoM", direction: "up" }} />
        <KPICard label="In-transit shipments" value={`${inTransit}`} sub={`${data.shipments.length} total this week`} icon={Truck} />
        <KPICard label="Pending receipts" value={`${pendingReceipts}`} sub="Awaiting QA verification" icon={ClipboardCheck} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Weekly intake (kg)</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatKg(monthly[3].value, { compact: true })}</div>
                <span className="badge-success">+ 18% WoW</span>
              </div>
            </div>
          </div>
          <div className="mt-6"><AreaChart data={monthly} height={220} /></div>
        </div>
        <div className="card p-6 lg:col-span-4">
          <h3 className="text-h4">Top suppliers (by kg)</h3>
          <ul className="mt-4 space-y-3">
            {[
              { hub: "Lagos Aggregator", kg: 32400 },
              { hub: "Wuse Hub · Abuja", kg: 14200 },
              { hub: "Port Harcourt Hub", kg: 12800 },
              { hub: "Bodija Hub · Ibadan", kg: 8200 },
              { hub: "Sabo Hub · Kano", kg: 6400 },
            ].map((h) => (
              <li key={h.hub} className="flex items-center justify-between text-sm">
                <span className="font-bold">{h.hub}</span>
                <span className="font-mono text-textgray">{formatKg(h.kg, { compact: true })}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Recent orders */}
        <div className="card overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Recent orders</h3>
              <p className="text-sm text-textgray">Tap any row to open in the order workspace.</p>
            </div>
            <Link to="/factory/orders" className="text-sm font-bold text-primary">All orders <ArrowRight size={12} className="inline" /></Link>
          </div>
          <table className="tbl">
            <thead><tr><th>Order</th><th>Material</th><th>Weight</th><th className="text-right">Total</th><th>Status</th></tr></thead>
            <tbody>
              {data.orders.slice(0, 5).map((o: any) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">{o.id}</td>
                  <td className="font-bold">{o.category}</td>
                  <td className="font-mono">{o.kg.toLocaleString()} kg</td>
                  <td className="text-right"><span className="money">{formatNaira(o.total)}</span></td>
                  <td><StatusPill status={o.status === "delivered" ? "success" : o.status === "in-transit" || o.status === "processing" ? "pending" : "error"} label={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending receipts */}
        <div className="card overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <h3 className="text-h4 flex items-center gap-2"><PackageCheck size={16} /> Awaiting receipt</h3>
            <Link to="/factory/receipts" className="text-sm font-bold text-primary">Verify <ArrowRight size={12} className="inline" /></Link>
          </div>
          <ul className="divide-y divide-bordergray">
            {data.receipts.filter((r: any) => r.status === "pending").map((r: any) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="text-sm font-extrabold">{r.orderId}</div>
                  <div className="text-xs text-textgray">QA score {r.qaScore} · variance {r.variancePct > 0 ? "+" : ""}{r.variancePct}%</div>
                </div>
                <Link to="/factory/receipts" className="btn-primary btn-sm">Verify</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
