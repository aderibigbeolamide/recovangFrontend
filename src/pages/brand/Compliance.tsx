import { Recycle } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar } from "@/components/charts";
import { DataTable, type Column } from "@/components/DataTable";
import { useBrandDashboard } from "@/hooks/useBrand";
import { formatNaira } from "@/lib/cn";

export default function BrandCompliance() {
  const { data } = useBrandDashboard();
  if (!data) return null;

  type Row = typeof data.recentRecoveries[number];

  const columns: Column<Row>[] = [
    { key: "id", header: "Drop ID", className: "font-mono text-xs", render: (r) => r.id, searchValue: (r) => r.id },
    { key: "date", header: "Date", render: (r) => <span className="text-textgray">{r.date}</span>, searchValue: (r) => r.date },
    { key: "hub", header: "Hub", render: (r) => <span className="font-bold">{r.hub}</span>, searchValue: (r) => r.hub },
    {
      key: "cat",
      header: "Category",
      render: (r) => <span className="inline-flex items-center gap-1.5"><Recycle size={12} className="text-primary" /> {r.category}</span>,
      searchValue: (r) => r.category,
    },
    { key: "kg", header: "Weight", className: "font-mono", render: (r) => `${r.kg.toLocaleString()} kg`, searchValue: (r) => `${r.kg}` },
    { key: "value", header: "EPR value", className: "text-right", render: (r) => <span className="money">{formatNaira(r.value)}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Brand portal"
        title="Compliance reporting"
        subtitle="Real-time tracking of every kilogram recovered against your EPR commitments."
      />

      <div className="card overflow-hidden">
        <div className="grid gap-5 border-b border-bordergray p-6 sm:grid-cols-2 lg:grid-cols-5">
          {data.byCategory.map((c: any) => {
            const pct = Math.round((c.recovered / c.target) * 100);
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold">{c.name}</div>
                  <StatusPill status={pct >= 75 ? "success" : pct >= 50 ? "warning" : "error"} label={`${pct}%`} />
                </div>
                <ProgressBar value={c.recovered} max={c.target} color={c.color} />
                <div className="mt-1 text-[10px] text-textgray">{c.recovered.toLocaleString()} / {c.target.toLocaleString()} kg</div>
              </div>
            );
          })}
        </div>
        <DataTable
          data={data.recentRecoveries}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search by hub, category or drop ID…"
          filterOptions={[
            { label: "PET Plastic", value: "PET" },
            { label: "Aluminium", value: "Aluminium" },
            { label: "Cardboard", value: "Cardboard" },
            { label: "Glass", value: "Glass" },
            { label: "Mixed Paper", value: "Mixed Paper" },
          ]}
          filterPredicate={(r, v) => r.category === v}
          pageSize={6}
        />
      </div>
    </>
  );
}
