import { 
  AlertTriangle, ArrowRight, Building2, CheckCircle2, Coins, Globe, Package, Recycle, 
  ShieldCheck, TrendingUp, Truck, Users, Activity, Database, Server, Zap, RefreshCw, Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut, ProgressRing } from "@/components/charts";
import { formatNaira, formatKg, formatNumber } from "@/lib/cn";
import { useAdminDashboard, useAdminAnalytics, useSystemHealth } from "@/hooks/useAdmin";
import { useAuth } from "@/store/auth";
import { hasPermission, PERMISSION_LABELS, type Permission } from "@/lib/permissions";

const ALERTS = [
  { type: "fraud", text: "9 flagged drops awaiting review at Lekki Hub", priority: "high", action: "/admin/fraud", perm: "MANAGE_FRAUD" as Permission },
  { type: "logistics", text: "Hub LG-IK402 truck service overdue", priority: "high", action: "/admin/logistics", perm: "MANAGE_HUBS" as Permission },
  { type: "capacity", text: "Surulere Flagship Hub at 78% capacity", priority: "med", action: "/admin/management?tab=hubs", perm: "MANAGE_HUBS" as Permission },
  { type: "ops", text: "Pricing engine refresh scheduled for Monday 6am", priority: "low", action: "/admin/pricing", perm: "MANAGE_PRICING" as Permission },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";
  const portalBase = isSuperAdmin ? "/super_admin" : "/admin";

  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  
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
    activeCollectors: stats?.activeCollectors ?? 0,
    kgRecovered: stats?.kgRecovered ?? 0,
    payouts: stats?.payouts ?? 0,
    revenue: stats?.revenue ?? 0,
    hubs: stats?.hubs ?? 0,
    fleet: stats?.fleet ?? 0,
    uptime: stats?.uptime ?? "99.9%",
    fraud: stats?.fraud ?? 0
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active collectors · region" value={formatNumber(kpis.activeCollectors)} sub="+ 1,824 this week" icon={Users} variant="primary" trend={{ value: "+3.0%", direction: "up" }} />
        <KPICard label="KG recovered · 30d" value={formatKg(kpis.kgRecovered, { compact: true })} sub={`${formatNumber(kpis.kgRecovered / 1000)} tonnes`} icon={Recycle} trend={{ value: "+12% vs LM", direction: "up" }} />
        <KPICard label="Pending payouts" value={formatNaira(kpis.payouts, { compact: true })} sub="62 awaiting approval" icon={Coins} variant="gold" />
        <KPICard label="Fraud queue" value={String(kpis.fraud)} sub="3 high-risk drops" icon={ShieldCheck} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
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
          <div className="mt-6 min-h-[220px]">
            <AreaChart data={overview} height={220} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          {isSuperAdmin && <HealthWidget />}
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Critical Alerts</div>
              <span className="badge-error">{ALERTS.filter(a => a.priority === "high").length} High</span>
            </div>
            <div className="mt-6 space-y-4">
              {ALERTS.map((alert, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${alert.priority === "high" ? "bg-error" : alert.priority === "med" ? "bg-gold" : "bg-textgray"}`} />
                  <div className="flex-1 text-sm leading-tight text-charcoal">{alert.text}</div>
                </div>
              ))}
            </div>
            <button className="btn-ghost mt-6 w-full gap-2 text-xs font-bold text-primary">
              View response queue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-h4">Hub utilization</h3>
              <p className="text-sm text-textgray">Capacity vs actual throughput · top hubs in your region</p>
            </div>
            <Link to="/admin/management?tab=hubs" className="text-xs font-bold text-primary hover:underline">Manage hubs →</Link>
          </div>
          <div className="min-h-[240px]">
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
        </div>

        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix · region</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days · {formatKg(kpis.kgRecovered, { compact: true })} total</p>
          <div className="min-h-[220px]">
            <Donut
              centerValue={formatKg(kpis.kgRecovered, { compact: true })}
              centerLabel="Recovered"
              data={wasteMix}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active hubs" value={formatNumber(kpis.hubs)} sub="In your region" icon={Building2} />
        <KPICard label="Logistics fleet" value={`${kpis.fleet} trucks`} sub="3 partners" icon={Truck} />
        <KPICard label="System uptime" value={kpis.uptime} sub="30-day rolling" icon={CheckCircle2} variant="primary" />
        <KPICard label="Today's pickups" value="142" sub="38 in transit" icon={Package} variant="gold" />
      </div>

      {isSuperAdmin && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-h4">Quick Admin Actions</h3>
            <span className="text-xs font-bold text-textgray">Super Admin Only</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link to="/super_admin/management?tab=staff" className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Users size={20} /></div>
              <div>
                <div className="font-extrabold text-charcoal">Staff Control</div>
                <div className="text-xs text-textgray">Manage admin roles</div>
              </div>
            </Link>
            <Link to="/super_admin/pricing" className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 text-gold"><Coins size={20} /></div>
              <div>
                <div className="font-extrabold text-charcoal">Pricing Engine</div>
                <div className="text-xs text-textgray">Adjust payout rates</div>
              </div>
            </Link>
            <Link to="/super_admin/audit-logs" className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-charcoal/10 text-charcoal"><Activity size={20} /></div>
              <div>
                <div className="font-extrabold text-charcoal">Audit Logs</div>
                <div className="text-xs text-textgray">Track all system actions</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function HealthWidget() {
  const { data: health, isLoading, refetch, isRefetching } = useSystemHealth();

  if (isLoading) return <div className="h-48 animate-pulse rounded-3xl bg-charcoal/5" />;

  const items = [
    { name: "PostgreSQL Database", status: health?.database, icon: Database },
    { name: "Paystack Payments", status: health?.paystack, icon: Zap },
    { name: "Cloud Assets (S3)", status: "healthy", icon: Server },
  ];

  return (
    <div className="card border-charcoal/10 bg-charcoal p-6 text-white overflow-hidden relative">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Platform Health</span>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className={`text-white/40 hover:text-white transition-all ${isRefetching ? "animate-spin" : ""}`}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-white/70">
                <item.icon size={16} />
              </div>
              <span className="text-xs font-bold">{item.name}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-tighter ${
              item.status === "healthy" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${item.status === "healthy" ? "bg-green-400 shadow-[0_0_8px_#4ade80]" : "bg-red-400"}`} />
              {item.status}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
        <span className="text-[10px] text-white/40">Last check: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : "N/A"}</span>
        <span className="text-[10px] font-bold text-accent">ALL SYSTEMS OPERATIONAL</span>
      </div>
    </div>
  );
}
