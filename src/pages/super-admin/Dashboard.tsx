import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, Building2, CheckCircle2, ChevronRight, Coins, Cpu, Database, Globe, KeyRound, Layers, Recycle, Server, ShieldCheck, Sparkles, Truck, Users, Wallet, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut } from "@/components/charts";
import { formatKg, formatNaira, formatNumber } from "@/lib/cn";
import { useAdminDashboard, useAdminAnalytics } from "@/hooks/useAdmin";
import { useAuth } from "@/store/auth";

const REGIONS = [
  { state: "Lagos", admin: "Sade Ijeoma", collectors: 24820, hubs: 184, kg: 412800, gmv: 84200000, pct: 100 },
  { state: "Abuja", admin: "Hauwa Bala", collectors: 12410, hubs: 86, kg: 184400, gmv: 38400000, pct: 64 },
  { state: "Port Harcourt", admin: "Ibe Nwankwo", collectors: 8240, hubs: 54, kg: 102800, gmv: 21900000, pct: 48 },
  { state: "Ibadan", admin: "Tope Bello", collectors: 6840, hubs: 38, kg: 81200, gmv: 16800000, pct: 41 },
  { state: "Kano", admin: "Musa Adamu", collectors: 5120, hubs: 28, kg: 62400, gmv: 12200000, pct: 32 },
  { state: "Kaduna", admin: "— Hiring —", collectors: 2840, hubs: 14, kg: 28100, gmv: 5800000, pct: 18 },
];

const SERVICES = [
  { name: "API Gateway", status: "operational", uptime: "99.99%", p95: "184ms" },
  { name: "Postgres primary", status: "operational", uptime: "100%", p95: "21ms" },
  { name: "Redis cache", status: "operational", uptime: "100%", p95: "4ms" },
  { name: "Payment rails (Paystack)", status: "operational", uptime: "99.92%", p95: "412ms" },
  { name: "SMS provider (Termii)", status: "degraded", uptime: "98.4%", p95: "1.2s" },
  { name: "Object storage (S3)", status: "operational", uptime: "100%", p95: "82ms" },
  { name: "Fraud ML inference", status: "operational", uptime: "99.8%", p95: "240ms" },
  { name: "QR scanner edge", status: "operational", uptime: "99.97%", p95: "62ms" },
];

const ADMIN_FEED = [
  { time: "10:42", actor: "Sade Ijeoma", role: "Lagos Admin", action: "Updated PET pricing", target: "₦180 → ₦200/kg", severity: "info" },
  { time: "10:38", actor: "Hauwa Bala", role: "Abuja Admin", action: "Approved bulk payouts", target: "62 requests · ₦4.2M", severity: "info" },
  { time: "10:31", actor: "ML system", role: "System", action: "Flagged drop", target: "RX-2419 · weight anomaly", severity: "warning" },
  { time: "10:18", actor: "Sade Ijeoma", role: "Lagos Admin", action: "Suspended collector", target: "C-1882 · 4 prior flags", severity: "critical" },
  { time: "09:58", actor: "Olamide Adesanya", role: "Super Admin", action: "Granted permission", target: "Hauwa Bala · MANAGE_FINANCE", severity: "info" },
];

const TREASURY_LANES = [
  { label: "EPR brand wallets", value: 184_200_000, sub: "Coca-Cola, Nestlé, Unilever +6", icon: Building2, tone: "primary" as const },
  { label: "Collector payout pool", value: 42_800_000, sub: "Ready for next settlement", icon: Wallet, tone: "gold" as const },
  { label: "Reserve & float", value: 96_400_000, sub: "Liquidity for daily ops", icon: ShieldCheck, tone: "dark" as const },
  { label: "Settlement in transit", value: 18_900_000, sub: "Bank rails · clears tonight", icon: ArrowUpRight, tone: "default" as const },
];

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  if (statsLoading || analyticsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-textgray">Spinning up the platform overview…</p>
        </div>
      </div>
    );
  }

  const treasuryTotal = TREASURY_LANES.reduce((s, l) => s + l.value, 0);
  const overview = Array.isArray(analytics?.overview) ? analytics.overview : [
    { label: "W1", value: 1200000 }, { label: "W2", value: 1480000 },
    { label: "W3", value: 1620000 }, { label: "W4", value: 1840000 },
    { label: "W5", value: 1920000 }, { label: "W6", value: 2240000 },
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
        eyebrow={`Super Admin · ${user?.region ?? "HQ"}`}
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Olamide"}.`}
        subtitle="Platform-wide control across every region, every wallet and every line of code. You can do anything — be careful."
        actions={
          <>
            <Link to="/super_admin/system-health" className="btn-outline"><Activity size={14} /> System health</Link>
            <Link to="/super_admin/staff" className="btn-primary"><ShieldCheck size={14} /> Staff control</Link>
          </>
        }
      />

      {/* God-mode KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Treasury under management"
          value={formatNaira(treasuryTotal, { compact: true })}
          sub={`Across ${TREASURY_LANES.length} lanes`}
          icon={Wallet}
          variant="primary"
          trend={{ value: "+18.4% MoM", direction: "up" }}
        />
        <KPICard
          label="Lifetime GMV"
          value={formatNaira(stats?.revenue ?? 482_000_000, { compact: true })}
          sub={`MRR ${formatNaira(((stats?.revenue ?? 482_000_000) / 12), { compact: true })}`}
          icon={Coins}
          variant="gold"
          trend={{ value: "+28% MoM", direction: "up" }}
        />
        <KPICard
          label="Active admin team"
          value="14 / 18"
          sub="3 invites pending · 1 vacancy"
          icon={ShieldCheck}
          variant="dark"
        />
        <KPICard
          label="System uptime · 30d"
          value={stats?.uptime ?? "99.97%"}
          sub="1 degraded service"
          icon={Activity}
          trend={{ value: "+0.04%", direction: "up" }}
        />
      </div>

      {/* Treasury lanes */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bordergray bg-cream/40 p-5">
          <div>
            <h3 className="text-h4 flex items-center gap-2"><Wallet size={18} className="text-primary" /> Treasury lanes</h3>
            <p className="text-sm text-textgray">Real-time view of every naira on the platform — segregated by purpose.</p>
          </div>
          <Link to="/super_admin/treasury" className="text-xs font-bold text-primary hover:underline">
            Open treasury console →
          </Link>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {TREASURY_LANES.map((l) => (
            <KPICard key={l.label} label={l.label} value={formatNaira(l.value, { compact: true })} sub={l.sub} icon={l.icon} variant={l.tone} />
          ))}
        </div>
      </div>

      {/* Revenue + System Health */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Platform GMV · 6-week trend</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatNaira(stats?.revenue ?? 9_300_000, { compact: true })}</div>
                <span className="badge-success">+ 28% MoM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
              {["6W", "3M", "1Y", "All"].map((p, i) => (
                <button key={p} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-white text-charcoal shadow-soft" : "text-textgray"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-6"><AreaChart data={overview} height={220} /></div>
        </div>

        <div className="card overflow-hidden lg:col-span-4">
          <div className="flex items-center justify-between border-b border-bordergray p-5">
            <h3 className="text-h4 flex items-center gap-2"><Server size={16} className="text-primary" /> System health</h3>
            <span className="badge bg-warning-50 text-warning">1 degraded</span>
          </div>
          <div className="divide-y divide-bordergray max-h-[280px] overflow-auto">
            {SERVICES.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${s.status === "operational" ? "bg-success" : s.status === "degraded" ? "bg-warning" : "bg-error"}`} />
                  <div className="min-w-0">
                    <div className="truncate font-bold">{s.name}</div>
                    <div className="font-mono text-[10px] text-textgray">p95 {s.p95} · uptime {s.uptime}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-textgray">{s.status}</span>
              </div>
            ))}
          </div>
          <Link to="/super_admin/system-health" className="block border-t border-bordergray bg-cream/40 p-3 text-center text-xs font-bold text-primary hover:underline">
            Open system health console →
          </Link>
        </div>
      </div>

      {/* Regional performance */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bordergray bg-cream/40 p-5">
          <div>
            <h3 className="text-h4 flex items-center gap-2"><Globe size={18} className="text-primary" /> Regional performance</h3>
            <p className="text-sm text-textgray">Each region run by a regional admin. Click to drill in or reassign.</p>
          </div>
          <Link to="/super_admin/staff" className="text-xs font-bold text-primary hover:underline">Reassign regional admins →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Region</th>
                <th>Regional admin</th>
                <th className="text-right">Collectors</th>
                <th className="text-right">Hubs</th>
                <th className="text-right">KG · 30d</th>
                <th className="text-right">GMV · 30d</th>
                <th className="min-w-[140px]">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((r) => (
                <tr key={r.state}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-grad-primary text-[10px] font-extrabold text-white">{r.state.slice(0, 2).toUpperCase()}</span>
                      <span className="font-extrabold">{r.state}</span>
                    </div>
                  </td>
                  <td>
                    {r.admin.startsWith("—") ? (
                      <span className="badge bg-warning-50 text-warning">{r.admin}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar name={r.admin} size={22} />
                        <span className="text-sm font-bold">{r.admin}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-right font-mono">{formatNumber(r.collectors)}</td>
                  <td className="text-right font-mono">{r.hubs}</td>
                  <td className="text-right font-mono">{formatKg(r.kg, { compact: true })}</td>
                  <td className="text-right font-mono">{formatNaira(r.gmv, { compact: true })}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-charcoal/8">
                        <div className="h-full rounded-full bg-grad-primary" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="font-mono text-xs">{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mix + Admin feed */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material mix · platform-wide</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days · {formatKg(stats?.kgRecovered ?? 1_240_000, { compact: true })} total</p>
          <Donut centerValue={formatKg(stats?.kgRecovered ?? 1_240_000, { compact: true })} centerLabel="Recovered" data={wasteMix} />
        </div>

        <div className="card overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-bordergray p-5">
            <h3 className="text-h4 flex items-center gap-2"><Activity size={16} className="text-primary" /> Admin team activity</h3>
            <Link to="/super_admin/audit-logs" className="text-xs font-bold text-primary hover:underline">Open full audit log →</Link>
          </div>
          <div className="divide-y divide-bordergray max-h-[360px] overflow-auto">
            {ADMIN_FEED.map((f, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${f.severity === "critical" ? "bg-error" : f.severity === "warning" ? "bg-warning" : "bg-success"}`} />
                <Avatar name={f.actor} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-extrabold">{f.actor}</span>{" "}
                    <span className="text-textgray">· {f.role}</span>
                  </div>
                  <div className="text-sm text-charcoal">
                    {f.action} <span className="font-mono text-xs text-textgray">→</span> <span className="font-bold">{f.target}</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-textgray">{f.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="text-h4 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-primary" /> Super-admin quick actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction to="/super_admin/staff" icon={Users} title="Manage admin team" body="Add admins, assign permissions, reassign regions." tone="primary" />
          <QuickAction to="/super_admin/pricing" icon={Coins} title="Regional pricing" body="Set per-state, per-material payout rates." tone="gold" />
          <QuickAction to="/super_admin/treasury" icon={Wallet} title="Treasury console" body="Move money between lanes. Trigger settlements." tone="dark" />
          <QuickAction to="/super_admin/partners" icon={Truck} title="Onboard partner" body="Logistics fleets, satellite hubs, brand & factory tiers." tone="default" />
        </div>
      </div>
    </>
  );
}

function QuickAction({ to, icon: Icon, title, body, tone }: { to: string; icon: any; title: string; body: string; tone: "primary" | "gold" | "dark" | "default" }) {
  const toneCls = tone === "primary" ? "bg-primary/10 text-primary" : tone === "gold" ? "bg-gold/10 text-gold" : tone === "dark" ? "bg-charcoal/10 text-charcoal" : "bg-info-50 text-info";
  return (
    <Link to={to} className="group flex flex-col rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${toneCls}`}><Icon size={18} /></div>
      <div className="mt-4 font-extrabold text-charcoal">{title}</div>
      <div className="mt-1 flex-1 text-xs text-textgray">{body}</div>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-70 group-hover:opacity-100">
        Open <ChevronRight size={12} />
      </div>
    </Link>
  );
}
