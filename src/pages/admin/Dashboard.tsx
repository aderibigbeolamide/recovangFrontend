import { AlertTriangle, ArrowRight, Building2, CheckCircle2, Coins, Globe, Package, Recycle, ShieldCheck, TrendingUp, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut, ProgressRing } from "@/components/charts";
import { formatNaira } from "@/lib/cn";

import { useAdminDashboard, useAdminAnalytics, useSystemHealth } from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";
import { useAuth } from "@/store/auth";
import { Activity, Database, Server, Zap, RefreshCw } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

const ALERTS = [
  { type: "fraud", text: "9 flagged drops awaiting review at Lekki Hub", priority: "high" },
  { type: "logistics", text: "Hub LG-IK402 truck service overdue", priority: "high" },
  { type: "capacity", text: "Surulere Flagship Hub at 78% capacity", priority: "med" },
  { type: "ops", text: "Pricing engine refresh scheduled for Monday 6am", priority: "low" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";
  const portalBase = isSuperAdmin ? "/super_admin" : "/admin";
  const permissions = user?.permissions || [];
  const has = (p: string) => isSuperAdmin || permissions.includes(p) || permissions.includes("ALL");

  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  


  if (statsLoading || analyticsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-textgray">Loading ecosystem data...</p>
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
  return (
    <>
      <PageHeader
        eyebrow="Admin · Recovang HQ · Lagos"
        title="Platform overview"
        subtitle="Real-time across 412 hubs, 9 cities, 8 logistics partners and 62,418 active collectors."
        actions={
          <>
            <button className="btn-outline"><Activity size={14} /> System health</button>
            <button className="btn-primary"><ShieldCheck size={14} /> Operations console</button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active collectors" value={formatNumber(kpis.activeCollectors)} sub="+ 1,824 this week" icon={Users} variant="primary" trend={{ value: "+3.0%", direction: "up" }} />
        <KPICard label="KG recovered" value={formatKg(kpis.kgRecovered, { compact: true })} sub={`${formatNumber(kpis.kgRecovered / 1000)} tonnes`} icon={Recycle} variant="default" trend={{ value: "+12% vs LM", direction: "up" }} />
        <KPICard label="Paid to collectors" value={formatNaira(kpis.payouts)} sub={`₦${formatNumber(kpis.payouts / 1_000_000, { compact: true })}M lifetime`} icon={Coins} variant="gold" />
        <KPICard label="Platform revenue" value={formatNaira(kpis.revenue)} sub={`MRR ₦${formatNumber(kpis.revenue / 1_000_000, { compact: true })}M`} icon={TrendingUp} variant="dark" trend={{ value: "+28% MoM", direction: "up" }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Revenue */}
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Monthly revenue</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatNaira(kpis.revenue, { compact: true })}</div>
                <span className="badge-success">+ 28% MoM</span>
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

        {/* Alerts & Context */}
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

          <div className="card p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Regional Activity</div>
            <div className="mt-6 space-y-4">
              {[
                { city: "Lekki, Lagos", val: 84, color: "bg-primary" },
                { city: "Ikeja, Lagos", val: 62, color: "bg-gold" },
                { city: "Port Harcourt", val: 45, color: "bg-charcoal" },
                { city: "Abuja FCT", val: 32, color: "bg-textgray" },
              ].map((region) => (
                <div key={region.city} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{region.city}</span>
                    <span>{region.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-cream overflow-hidden">
                    <div className={`h-full ${region.color}`} style={{ width: `${region.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Hub Utilization (Ecosystem) */}
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-h4">Hub utilization</h3>
              <p className="text-sm text-textgray">Capacity vs Actual throughput</p>
            </div>
            <Link to={`${portalBase}/management?tab=hubs`} className="text-xs font-bold text-primary hover:underline">Manage hubs</Link>
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

        {/* Material mix */}
        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix · platform-wide</h3>
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
        <KPICard label="Active hubs" value={formatNumber(kpis.hubs)} sub="Across 9 cities" icon={Building2} />
        <KPICard label="Logistics fleet" value={`${kpis.fleet} trucks`} sub="8 active partners" icon={Truck} />
        <KPICard label="System uptime" value={kpis.uptime} sub="30-day rolling" icon={CheckCircle2} variant="primary" />
        <KPICard label="Fraud queue" value={formatNumber(kpis.fraud)} sub="9 flagged drops" icon={ShieldCheck} variant="dark" />
      </div>

      {(isSuperAdmin || permissions.length > 0) && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-h4">Quick Admin Actions</h3>
            <span className="text-xs font-bold text-textgray">{isSuperAdmin ? "Super Admin" : "Restricted Access"}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {isSuperAdmin && (
              <Link to={`${portalBase}/management?tab=staff`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Users size={20} /></div>
                <div>
                  <div className="font-extrabold text-charcoal">Staff Control</div>
                  <div className="text-xs text-textgray">Manage admin roles</div>
                </div>
              </Link>
            )}
            {has(PERMISSIONS.USERS_VIEW) && (
              <Link to={`${portalBase}/management?tab=collectors`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Users size={20} /></div>
                <div>
                  <div className="font-extrabold text-charcoal">User Management</div>
                  <div className="text-xs text-textgray">Manage collectors & agents</div>
                </div>
              </Link>
            )}
            {has(PERMISSIONS.PRICING_MANAGE) && (
              <Link to={`${portalBase}/pricing`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 text-gold"><Coins size={20} /></div>
                <div>
                  <div className="font-extrabold text-charcoal">Pricing Engine</div>
                  <div className="text-xs text-textgray">Adjust payout rates</div>
                </div>
              </Link>
            )}
            {isSuperAdmin && (
              <Link to={`${portalBase}/audit-logs`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lift hover:shadow-soft transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-charcoal/10 text-charcoal"><Activity size={20} /></div>
                <div>
                  <div className="font-extrabold text-charcoal">Audit Logs</div>
                  <div className="text-xs text-textgray">Track all system actions</div>
                </div>
              </Link>
            )}
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
        <span className="text-[10px] text-white/40">Last check: {new Date(health?.timestamp).toLocaleTimeString()}</span>
        <span className="text-[10px] font-bold text-accent">ALL SYSTEMS OPERATIONAL</span>
      </div>
    </div>
  );
}
