import { MapPin, Truck } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { DataTable, type Column } from "@/components/DataTable";
import { ProgressBar } from "@/components/charts";
import { useFactoryDashboard } from "@/hooks/useFactory";

export default function FactoryShipments() {
  const { data } = useFactoryDashboard();
  if (!data) return null;
  type Row = typeof data.shipments[number];

  const columns: Column<Row>[] = [
    { key: "id", header: "Shipment", className: "font-mono text-xs", render: (r) => r.id, searchValue: (r) => r.id },
    { key: "from", header: "Origin", render: (r) => <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {r.origin}</span>, searchValue: (r) => r.origin },
    { key: "to", header: "Destination", render: (r) => r.destination, searchValue: (r) => r.destination },
    { key: "carrier", header: "Carrier", render: (r) => <span className="inline-flex items-center gap-1.5"><Truck size={12} className="text-textgray" /> {r.carrier}</span>, searchValue: (r) => r.carrier },
    { key: "truck", header: "Truck", className: "font-mono text-xs", render: (r) => r.truck, searchValue: (r) => r.truck },
    { key: "kg", header: "Weight", className: "font-mono", render: (r) => `${r.kg.toLocaleString()} kg` },
    { key: "eta", header: "ETA", render: (r) => r.eta },
    { key: "progress", header: "Progress", render: (r) => <div className="min-w-[120px]"><ProgressBar value={r.progress} color={r.status === "delivered" ? "#27AE60" : r.status === "cancelled" ? "#E74C3C" : "#1A6B3C"} /></div> },
    { key: "status", header: "Status", render: (r) => (
      <StatusPill
        status={r.status === "delivered" ? "success" : r.status === "in-transit" ? "pending" : r.status === "loading" ? "warning" : "error"}
        label={r.status}
      />
    ) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Factory portal"
        title="Shipment tracking"
        subtitle="Live truck locations from the hub to your gate. Updated every 60 seconds."
      />

      <div className="card overflow-hidden">
        <DataTable
          data={data.shipments}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by shipment, truck or carrier…"
          filterOptions={[
            { label: "In-transit", value: "in-transit" },
            { label: "Loading", value: "loading" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          filterPredicate={(r, v) => r.status === v}
          pageSize={6}
        />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4">Live network map</h3>
          <p className="text-sm text-textgray">Hub-to-gate routes across Africa, starting with Nigeria.</p>
        </div>
        <div className="grid h-72 place-items-center bg-grad-mint">
          <div className="text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-soft">
              <Truck size={28} className="text-primary" />
            </div>
            <div className="mt-3 text-sm font-extrabold text-charcoal">Live map view</div>
            <div className="text-xs text-textgray">Map rendering enabled when geolocation provider key is set.</div>
          </div>
        </div>
      </div>
    </>
  );
}
