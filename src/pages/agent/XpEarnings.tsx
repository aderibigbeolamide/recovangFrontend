import { Award, Coins, Crown, Gift, Sparkles, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { ProgressBar, AreaChart } from "@/components/charts";
import { formatNaira, formatNumber } from "@/lib/cn";

const XP_HISTORY = [
  { label: "M", value: 220 },
  { label: "T", value: 340 },
  { label: "W", value: 180 },
  { label: "T", value: 420 },
  { label: "F", value: 380 },
  { label: "S", value: 480 },
  { label: "S", value: 320 },
];

const PAYOUTS = [
  { period: "Apr 2026 (current)", drops: 4218, comm: 88420, bonus: 12500, status: "in-progress" },
  { period: "Mar 2026", drops: 4892, comm: 96440, bonus: 18200, status: "paid" },
  { period: "Feb 2026", drops: 4106, comm: 81920, bonus: 14600, status: "paid" },
  { period: "Jan 2026", drops: 3821, comm: 76800, bonus: 9400, status: "paid" },
  { period: "Dec 2025", drops: 4624, comm: 92100, bonus: 22000, status: "paid" },
];

const TIERS = [
  { name: "Sprout", min: 0, max: 1000, color: "from-emerald-300 to-emerald-500" },
  { name: "Verifier", min: 1000, max: 5000, color: "from-primary to-primary-700" },
  { name: "Steward", min: 5000, max: 12000, color: "from-accent to-accent-700", current: true },
  { name: "Champion", min: 12000, max: 30000, color: "from-orange-400 to-orange-600" },
  { name: "Legend", min: 30000, max: 100000, color: "from-charcoal to-charcoal-700" },
];

export default function AgentXpEarnings() {
  const xp = 8420;
  const tier = TIERS.find((t) => t.current)!;
  const pct = ((xp - tier.min) / (tier.max - tier.min)) * 100;

  return (
    <>
      <PageHeader
        eyebrow="XP & earnings"
        title="Your agent rewards"
        subtitle="Earn XP from verifications, capacity uptime and collector ratings. Higher tiers unlock higher commission rates."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Total XP" value={formatNumber(xp)} sub="Steward tier" icon={Sparkles} variant="gold" />
        <KPICard label="Lifetime commission" value="₦1.84M" sub="Across 18 months" icon={Coins} variant="primary" />
        <KPICard label="This month" value="₦100,920" sub="+ 12% vs last mo" icon={TrendingUp} trend={{ value: "+12%", direction: "up" }} />
        <KPICard label="Active rank" value="#12 / 412" sub="Top 3% in Lagos" icon={Trophy} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Tier card */}
        <div className="card-dark p-7 lg:col-span-7">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Current tier</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white">Steward · Level 3</h2>
          <p className="mt-2 text-sm text-white/70">8,420 / 12,000 XP to next tier (Champion · 9% commission unlocked)</p>

          <div className="mt-6 space-y-3">
            {TIERS.map((t) => (
              <div key={t.name} className={`flex items-center gap-3 ${t.current ? "" : "opacity-50"}`}>
                <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${t.color} text-white shadow-lift`}>
                  {t.current ? <Crown size={14} /> : <Star size={14} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white">{t.name}</span>
                    <span className="font-mono text-xs text-white/60">{formatNumber(t.min)} – {formatNumber(t.max)} XP</span>
                  </div>
                  {t.current && (
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-grad-gold" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP this week */}
        <div className="space-y-4 lg:col-span-5">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">XP this week</div>
                <div className="mt-1 font-display text-2xl font-extrabold">2,340 XP</div>
              </div>
              <span className="badge-success">+ 18% vs last</span>
            </div>
            <div className="mt-4">
              <AreaChart data={XP_HISTORY} height={120} />
            </div>
          </div>

          <div className="card-gold p-6">
            <Gift size={22} className="text-charcoal" />
            <div className="mt-3 text-sm font-extrabold text-charcoal">April performance bonus</div>
            <div className="mt-1 text-xs text-charcoal/70">
              Hit 4,500+ drops & 95%+ uptime to unlock a ₦20,000 bonus. You're at <span className="font-extrabold">94% complete</span>.
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-charcoal/10">
              <div className="h-full rounded-full bg-charcoal" style={{ width: "94%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-h4">How XP is earned</h3>
          <p className="mb-4 text-sm text-textgray">Live breakdown for this week</p>
          <ul className="space-y-3">
            {[
              { lbl: "Verifying drops", ico: Zap, n: "+1,184 XP", sub: "1 XP per drop · 1,184 drops" },
              { lbl: "Hub uptime > 95%", ico: Award, n: "+500 XP", sub: "98% uptime this week" },
              { lbl: "5-star ratings", ico: Star, n: "+420 XP", sub: "42 ratings of 5 stars" },
              { lbl: "Onboarded collectors", ico: Sparkles, n: "+180 XP", sub: "9 first-timers, 20 XP each" },
              { lbl: "On-time pickups", ico: Crown, n: "+56 XP", sub: "2 pickups, 28 XP each" },
            ].map((x) => (
              <li key={x.lbl} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-primary shadow-soft">
                  <x.ico size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{x.lbl}</div>
                  <div className="text-[11px] text-textgray">{x.sub}</div>
                </div>
                <span className="font-mono text-sm font-extrabold text-primary">{x.n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="border-b border-bordergray p-6">
            <h3 className="text-h4">Monthly payouts</h3>
            <p className="text-sm text-textgray">Commission + performance bonus</p>
          </div>
          <table className="tbl">
            <thead><tr><th>Period</th><th>Drops</th><th>Commission</th><th>Bonus</th><th>Status</th></tr></thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.period}>
                  <td className="font-bold">{p.period}</td>
                  <td className="font-mono">{formatNumber(p.drops)}</td>
                  <td className="font-mono">{formatNaira(p.comm)}</td>
                  <td className="font-mono money">{formatNaira(p.bonus)}</td>
                  <td><StatusPill status={p.status === "paid" ? "success" : "pending"} label={p.status === "paid" ? "Paid" : "In progress"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
