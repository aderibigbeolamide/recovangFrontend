import { Activity, AlertTriangle, CheckCircle2, Cpu, Database, Globe, Layers, Plug, Server, Zap } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart } from "@/components/charts";

const SERVICES = [
  { name: "API Gateway", group: "Edge", status: "operational", uptime: "99.99%", p95: "184ms", region: "Lagos · primary", incidents: 0 },
  { name: "API Gateway", group: "Edge", status: "operational", uptime: "99.96%", p95: "212ms", region: "Frankfurt · failover", incidents: 0 },
  { name: "Postgres primary", group: "Data", status: "operational", uptime: "100%", p95: "21ms", region: "Lagos", incidents: 0 },
  { name: "Postgres replica", group: "Data", status: "operational", uptime: "100%", p95: "26ms", region: "Frankfurt", incidents: 0 },
  { name: "Redis cache", group: "Data", status: "operational", uptime: "100%", p95: "4ms", region: "Lagos", incidents: 0 },
  { name: "Object storage (S3)", group: "Data", status: "operational", uptime: "100%", p95: "82ms", region: "AWS · af-south-1", incidents: 0 },
  { name: "Paystack", group: "Integrations", status: "operational", uptime: "99.92%", p95: "412ms", region: "Vendor", incidents: 0 },
  { name: "NIBSS direct debit", group: "Integrations", status: "operational", uptime: "99.86%", p95: "640ms", region: "Vendor", incidents: 0 },
  { name: "Termii (SMS)", group: "Integrations", status: "degraded", uptime: "98.4%", p95: "1.2s", region: "Vendor", incidents: 1 },
  { name: "Smile ID (KYC)", group: "Integrations", status: "operational", uptime: "99.94%", p95: "820ms", region: "Vendor", incidents: 0 },
  { name: "Fraud ML inference", group: "Workers", status: "operational", uptime: "99.8%", p95: "240ms", region: "Lagos · GPU pool", incidents: 0 },
  { name: "Webhook dispatcher", group: "Workers", status: "operational", uptime: "99.95%", p95: "94ms", region: "Lagos", incidents: 0 },
  { name: "Email (Postmark)", group: "Integrations", status: "operational", uptime: "99.9%", p95: "180ms", region: "Vendor", incidents: 0 },
  { name: "Push notifications", group: "Workers", status: "operational", uptime: "99.7%", p95: "320ms", region: "FCM + APNs", incidents: 0 },
];

const QUEUES = [
  { name: "submissions.verify", depth: 142, lag: "0.4s", workers: 12 },
  { name: "payouts.dispatch", depth: 38, lag: "0.2s", workers: 6 },
  { name: "fraud.scoring", depth: 24, lag: "1.1s", workers: 8 },
  { name: "notifications.outbound", depth: 412, lag: "0.7s", workers: 16 },
  { name: "webhooks.outbound", depth: 96, lag: "0.3s", workers: 8 },
  { name: "analytics.rollup", depth: 4, lag: "—", workers: 2 },
];

const LATENCY = [
  { label: "00", value: 142 }, { label: "04", value: 138 }, { label: "08", value: 162 },
  { label: "12", value: 184 }, { label: "16", value: 196 }, { label: "20", value: 174 },
  { label: "24", value: 152 },
];

const INCIDENTS = [
  { id: "INC-2419", time: "Today · 09:42 WAT", title: "Termii SMS provider degraded", impact: "OTPs delivered with 8s avg delay", status: "monitoring", severity: "minor" },
  { id: "INC-2412", time: "23 Apr · 14:18", title: "Postgres failover drill", impact: "Read-replica promoted for 4 minutes — no user impact", status: "resolved", severity: "info" },
  { id: "INC-2401", time: "18 Apr · 02:04", title: "AWS af-south-1 brief network blip", impact: "Object uploads queued for 6 minutes", status: "resolved", severity: "minor" },
];

const STATUS_TONE: Record<string, "success" | "warning" | "error"> = {
  operational: "success",
  degraded: "warning",
  outage: "error",
  resolved: "success",
  monitoring: "warning",
};

export default function SuperAdminSystemHealth() {
  const groups = Array.from(new Set(SERVICES.map((s) => s.group)));
  const opCount = SERVICES.filter((s) => s.status === "operational").length;

  return (
    <>
      <PageHeader
        eyebrow="Super Admin · Operations"
        title="System health"
        subtitle="Live status of every service powering Recovang. Triggers, queues and integrations — one screen."
        actions={
          <>
            <button className="btn-outline"><AlertTriangle size={14} /> Open incident</button>
            <button className="btn-primary"><Plug size={14} /> Maintenance window</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Overall uptime · 30d" value="99.97%" sub="SLA target 99.9%" icon={Activity} variant="primary" trend={{ value: "+0.04%", direction: "up" }} />
        <KPICard label="Services operational" value={`${opCount} / ${SERVICES.length}`} sub="1 degraded" icon={CheckCircle2} variant="dark" />
        <KPICard label="Open incidents" value="1" sub="Termii SMS · monitoring" icon={AlertTriangle} variant="gold" />
        <KPICard label="Avg API p95" value="184ms" sub="Edge · 24h" icon={Zap} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Latency chart */}
        <div className="card p-6 lg:col-span-7">
          <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Edge latency · last 24h</div>
          <div className="mt-2 flex items-baseline gap-3">
            <div className="font-mono text-3xl font-extrabold">184<span className="text-base text-textgray"> ms p95</span></div>
            <span className="badge-success">- 8% vs yesterday</span>
          </div>
          <div className="mt-6"><AreaChart data={LATENCY} height={220} /></div>
        </div>

        {/* Queues */}
        <div className="card overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-bordergray p-5">
            <h3 className="text-h4 flex items-center gap-2"><Layers size={16} className="text-primary" /> Worker queues</h3>
            <span className="badge-success text-[10px]">All draining</span>
          </div>
          <div className="divide-y divide-bordergray">
            {QUEUES.map((q) => (
              <div key={q.name} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold">{q.name}</div>
                  <div className="text-[10px] text-textgray">{q.workers} workers · lag {q.lag}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-extrabold">{q.depth}</div>
                  <div className="text-[10px] text-textgray">in queue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services by group */}
      {groups.map((g) => (
        <div key={g} className="mt-6 card overflow-hidden">
          <div className="flex items-center justify-between border-b border-bordergray bg-cream/40 p-5">
            <h3 className="text-h4 flex items-center gap-2">
              {g === "Edge" ? <Globe size={16} className="text-primary" /> : g === "Data" ? <Database size={16} className="text-primary" /> : g === "Integrations" ? <Plug size={16} className="text-primary" /> : <Cpu size={16} className="text-primary" />}
              {g}
            </h3>
            <span className="text-xs font-bold text-textgray">{SERVICES.filter((s) => s.group === g).length} services</span>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Service</th><th>Region</th><th>Uptime · 30d</th><th>p95</th><th>Incidents</th><th>Status</th></tr></thead>
              <tbody>
                {SERVICES.filter((s) => s.group === g).map((s, i) => (
                  <tr key={`${s.name}-${i}`}>
                    <td className="font-extrabold">{s.name}</td>
                    <td className="text-sm text-textgray">{s.region}</td>
                    <td className="font-mono">{s.uptime}</td>
                    <td className="font-mono">{s.p95}</td>
                    <td className="font-mono">{s.incidents}</td>
                    <td><StatusPill status={STATUS_TONE[s.status]} label={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Incidents */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-5">
          <h3 className="text-h4 flex items-center gap-2"><AlertTriangle size={16} className="text-primary" /> Incidents · last 14 days</h3>
          <button className="btn-outline btn-sm">Status page</button>
        </div>
        <div className="divide-y divide-bordergray">
          {INCIDENTS.map((i) => (
            <div key={i.id} className="flex items-start gap-4 px-5 py-4">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i.status === "monitoring" ? "bg-warning" : "bg-success"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-primary">{i.id}</span>
                  <span className="text-sm font-extrabold">{i.title}</span>
                  <StatusPill status={STATUS_TONE[i.status]} label={i.status} />
                </div>
                <div className="mt-1 text-sm text-textgray">{i.impact}</div>
              </div>
              <span className="font-mono text-[11px] text-textgray">{i.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
