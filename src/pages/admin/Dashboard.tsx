import { Activity, AlertTriangle, ArrowRight, Building2, CheckCircle2, ChevronRight, Coins, Lock, MapPin, Package, Recycle, ShieldCheck, Sparkles, Truck, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut } from "@/components/charts";
import { formatKg, formatNaira, formatNumber } from "@/lib/cn";
import { useAdminDashboard, useAdminAnalytics } from "@/hooks/useAdmin";
import { useAuth } from "@/store/auth";
import { PERMISSION_LABELS, hasPermission, type Permission } from "@/lib/permissions";

const ALERTS = [
  { type: "fraud", text: "9 flagged drops awaiting review at Lekki Hub", priority: "high", action: "/admin/fraud", perm: "MANAGE_FRAUD" as Permission },
  { type: "logistics", text: "Hub LG-IK402 truck service overdue", priority: "high", action: "/admin/logistics", perm: "MANAGE_HUBS" as Permission },
  { type: "capacity", text: "Surulere Flagship Hub at 78% capacity", priority: "med", action: "/admin/management?tab=hubs", perm: "MANAGE_HUBS" as Permission },
  { type: "ops", text: "Pricing engine refresh scheduled for Monday 6am", priority: "low", action: "/admin/pricing", perm: "MANAGE_PRICING" as Permission },
];

const RECENT_ACTIONS = [
  { time: "12 min ago", what: "Suspended collector C-1882", target: "Joy Eze · 4 prior flags" },
  { time: "1h ago", what: "Approved pickup PK-2419", target: "Surulere → Apapa · 1.2t PET" },
  { time: "2h ago", what: "Verified satellite hub", target: "Yaba Tech Hub · 400kg/day" },
  { time: "Yesterday", what: "Suspended agent A-204", target: "After fraud team review" },
];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { user } = useAuth();
  const myPerms = (user?.permissions ?? []) as Permission[];

  if (statsLoading || analyticsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-textgray">Loading regional data…</p>
        </div>
      </div>
    );
  }

  const kpis = {
    activeCollectors: stats?.activeCollectors ?? 24820,
    kgRecovered: stats?.kgRecovered ?? 412800,
    payouts: stats?.payouts ?? 18_400_000,
    revenue: stats?.revenue ?? 84_200_000,
    hubs: stats?.hubs ?? 184,
    fleet: stats?.fleet ?? 42,
    uptime: stats?.uptime ?? "99.97%",
    fraud: stats?.fraud ?? 9,
  };

  const overview = Array.isArray(analytics?.overview) ? analytics.overview : [
    { label: "W1", value: 1200000 }, { label: "W2", value: 1480000 },
    { label: "W3", value: 1620000 }, { label: "W4", value: 1840000 },
  ];

  const wasteMix = Array.isArray(analytics?.waste) ? analytics.waste : [
    { label: "PET Plastic", value: 482, color: "#1A6B3C" },
    { label: "Cardboard", value: 318, color: "#D4A017" },
    { label: "Aluminium", value: 184, color: "#3F9264" },
    { label: "Paper", value: 142, color: "#1C1C2E" },
    { label: "Glass", value: 84, color: "#A0A4AB" },
    { label: "E-Waste", value: 30, color: "#E74C3C" },
  ];

  const ALL_PERMS: Permission[] = ["MANAGE_USERS", "MANAGE_HUBS", "MANAGE_FRAUD", "MANAGE_LOGISTICS", "MANAGE_FINANCE", "MANAGE_PRICING", "VIEW_AUDIT_LOGS"];
  const granted = ALL_PERMS.filter((p) => hasPermission(user, p));
  const denied = ALL_PERMS.filter((p) => !hasPermission(user, p));

  return (
    <>
      <PageHeader
        eyebrow={`Admin · ${user?.region ?? "Regional ops"}`}
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Admin"}.`}
        subtitle="This is your operational cockpit. Run the region, review the queue, keep the wheels turning."
        actions={
          <>
            <Link to="/admin/fraud" className="btn-outline"><ShieldCheck size={14} /> Fraud queue · {kpis.fraud}</Link>
            <Link to="/admin/management" className="btn-primary"><Users size={14} /> Manage users</Link>
          </>
        }
      />

      {/* Permissions banner */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck size={18} /></div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-h4">Your access level</h3>
                <span className="badge bg-mint text-primary">{granted.length} permission{granted.length === 1 ? "" : "s"}</span>
              </div>
              <p className="mt-1 text-sm text-textgray">Granted by Super Admin · {user?.region ?? "Regional scope"}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {granted.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-full bg-mint/60 px-2.5 py-1 text-[11px] font-bold text-primary">
                    <CheckCircle2 size={11} /> {PERMISSION_LABELS[p].label}
                  </span>
                ))}
                {denied.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-textgray/70" title="Permission not granted — contact Super Admin">
                    <Lock size={11} /> {PERMISSION_LABELS[p].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5 bg-grad-mint">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Need more powers?</div>
          <div className="mt-2 text-h4 font-extrabold text-charcoal">Request an upgrade</div>
          <p className="mt-1 text-sm text-charcoal/80">Only the Super Admin can change your permission scope. Send a request and they'll review within 24 hours.</p>
          <button className="btn-primary mt-4 w-full">Request permission</button>
        </div>
      </div>

      {/* Operational KPIs (regional) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active collectors · region" value={formatNumber(kpis.activeCollectors)} sub="+ 1,824 this week" icon={Users} variant="primary" trend={{ value: "+3.0%", direction: "up" }} />
        <KPICard label="KG recovered · 30d" value={formatKg(kpis.kgRecovered, { compact: true })} sub={`${formatNumber(kpis.kgRecovered / 1000)} tonnes`} icon={Recycle} trend={{ value: "+12% vs LM", direction: "up" }} />
        <KPICard label="Pending payouts" value={formatNaira(kpis.payouts, { compact: true })} sub="62 awaiting approval" icon={Wallet} variant="gold" />
        <KPICard label="Fraud queue" value={String(kpis.fraud)} sub="3 high-risk drops" icon={ShieldCheck} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Throughput chart */}
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Regional throughput · 4 weeks</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatKg(kpis.kgRecovered, { compact: true })}</div>
                <span className="badge-success">+ 12% vs LM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
              {["1M", "3M", "1Y"].map((p, i) => (
                <button key={p} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-white text-charcoal shadow-soft" : "text-textgray"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <AreaChart data={overview} height={220} />
          </div>
        </div>

        {/* Live alerts (gated) */}
        <div className="card overflow-hidden lg:col-span-4">
          <div className="flex items-center justify-between border-b border-bordergray p-5">
            <h3 className="text-h4 flex items-center gap-2"><AlertTriangle size={16} className="text-warning" /> Live alerts</h3>
            <span className="badge bg-error-50 text-error">{ALERTS.length}</span>
          </div>
          <div className="divide-y divide-bordergray">
            {ALERTS.map((a, i) => {
              const allowed = hasPermission(user, a.perm);
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-4">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.priority === "high" ? "bg-error" : a.priority === "med" ? "bg-warning" : "bg-info"}`} />
                  <div className="flex-1">
                    <div className="text-sm text-charcoal">{a.text}</div>
                    {!allowed && (
                      <div className="mt-1 text-[10px] text-textgray">
                        <Lock size={10} className="inline mb-0.5" /> Needs <span className="font-bold">{PERMISSION_LABELS[a.perm].label}</span>
                      </div>
                    )}
                  </div>
                  {allowed ? (
                    <Link to={a.action} className="btn-ghost btn-sm">View</Link>
                  ) : (
                    <button disabled className="btn-ghost btn-sm opacity-40 cursor-not-allowed">Locked</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hub utilization + material mix */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-h4">Hub utilization</h3>
              <p className="text-sm text-textgray">Capacity vs actual throughput · top hubs in your region</p>
            </div>
            <Link to="/admin/management?tab=hubs" className="text-xs font-bold text-primary hover:underline">Manage hubs →</Link>
          </div>
          <BarChart
            data={Array.isArray(analytics?.ecosystem) ? analytics.ecosystem : [
              { label: "Surulere", value: 78, secondary: 100 },
              { label: "Lekki", value: 92, secondary: 100 },
              { label: "Ikeja", value: 45, secondary: 100 },
              { label: "Ajah", value: 68, secondary: 100 },
              { label: "Wuse", value: 55, secondary: 100 },
            ]}
            height={240}
          />
        </div>

        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix · region</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days · {formatKg(kpis.kgRecovered, { compact: true })} total</p>
          <Donut centerValue={formatKg(kpis.kgRecovered, { compact: true })} centerLabel="Recovered" data={wasteMix} />
        </div>
      </div>

      {/* Footer KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active hubs" value={formatNumber(kpis.hubs)} sub="In your region" icon={Building2} />
        <KPICard label="Logistics fleet" value={`${kpis.fleet} trucks`} sub="3 partners" icon={Truck} />
        <KPICard label="System uptime" value={kpis.uptime} sub="30-day rolling" icon={CheckCircle2} variant="primary" />
        <KPICard label="Today's pickups" value="142" sub="38 in transit" icon={Package} variant="gold" />
      </div>

      {/* Recent actions */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-5">
          <h3 className="text-h4 flex items-center gap-2"><Activity size={16} className="text-primary" /> Your recent actions</h3>
          <Link to="/admin/audit-logs" className="text-xs font-bold text-primary hover:underline">Open audit log →</Link>
        </div>
        <div className="divide-y divide-bordergray">
          {RECENT_ACTIONS.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 text-sm">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream text-textgray"><Sparkles size={13} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold">{r.what}</div>
                <div className="text-[11px] text-textgray">{r.target}</div>
              </div>
              <span className="font-mono text-[11px] text-textgray">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
