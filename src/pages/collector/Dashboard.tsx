import { Link } from "react-router-dom";
import { ArrowRight, Award, BadgeCheck, Coins, Flame, Plus, Recycle, Sparkles, Target, TrendingUp, Upload, Wallet } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, Donut, ProgressRing, Sparkline } from "@/components/charts";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const RECENT = [
  { date: "Apr 24", hub: "Surulere Hub", cat: "PET Bottles", kg: 4.2, amt: 840, status: "verified" },
  { date: "Apr 22", hub: "Surulere Hub", cat: "Cardboard", kg: 8.0, amt: 480, status: "verified" },
  { date: "Apr 19", hub: "Yaba Centre", cat: "Aluminium Cans", kg: 1.1, amt: 660, status: "verified" },
  { date: "Apr 16", hub: "Surulere Hub", cat: "Mixed Paper", kg: 5.6, amt: 280, status: "verified" },
  { date: "Apr 13", hub: "Lekki Hub", cat: "PET Bottles", kg: 3.2, amt: 640, status: "pending" },
];

const WEEKLY = [
  { label: "M", value: 1200 }, { label: "T", value: 1800 },
  { label: "W", value: 980 }, { label: "T", value: 2400 },
  { label: "F", value: 2100 }, { label: "S", value: 3200 }, { label: "S", value: 2700 },
];

export default function CollectorDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Collector portal · Surulere · Lagos"
        title="Welcome back, Adaeze 👋"
        subtitle="You're 2 submissions away from unlocking the Gold Recycler badge. Strong week so far."
        actions={
          <>
            <Link to="/collector/withdraw" className="btn-outline"><Wallet size={14} /> Withdraw</Link>
            <Link to="/collector/submit" className="btn-primary"><Upload size={14} /> Submit waste</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Wallet balance" value={<><span className="text-accent">₦</span>48,750</>} sub="+₦12,400 this week" icon={Wallet} variant="primary" />
        <KPICard label="Lifetime earned" value="₦312,400" sub="across 47 submissions" icon={Coins} variant="gold" />
        <KPICard label="KG recovered" value="218.4 kg" sub="+18.2 kg this month" icon={Recycle} trend={{ value: "+12% vs last mo", direction: "up" }} />
        <KPICard label="Current streak" value="14 days" sub="Top 3% in Lagos" icon={Flame} trend={{ value: "+3 vs last week", direction: "up" }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Earnings chart */}
        <div className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Last 7 days · Earnings</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatNaira(14380)}</div>
                <span className="badge-success">+ 28%</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
              {["7D", "30D", "All"].map((p, i) => (
                <button key={p} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-white text-charcoal shadow-soft" : "text-textgray"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <AreaChart data={WEEKLY} height={220} />
          </div>
        </div>

        {/* Quick actions + Goal */}
        <div className="space-y-6 lg:col-span-4">
          <div className="card-dark p-6">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">This week's goal</div>
              <span className="text-[10px] font-bold uppercase text-white/60">Weekly</span>
            </div>
            <div className="mt-4 flex items-center gap-5">
              <ProgressRing value={62} color="#D4A017" label="of 25kg" />
              <div className="flex-1">
                <div className="font-display text-2xl font-extrabold">15.5 / 25 kg</div>
                <p className="mt-1 text-xs text-white/70">9.5 kg to hit your weekly target. Drop today and earn the +₦500 streak bonus.</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Quick actions</div>
            <div className="mt-3 grid gap-2">
              <QuickAction to="/collector/submit" icon={Upload} title="New submission" sub="Drop waste at any hub" />
              <QuickAction to="/collector/withdraw" icon={Wallet} title="Withdraw" sub="Bank, airtime, bills" />
              <QuickAction to="/collector/leaderboard" icon={Award} title="Leaderboard" sub="Climb the rankings" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Recent submissions */}
        <div className="card overflow-hidden lg:col-span-8">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Recent submissions</h3>
              <p className="text-sm text-textgray">Your last 5 verified drops</p>
            </div>
            <Link to="/collector/history" className="text-sm font-bold text-primary hover:text-primary-700">View all <ArrowRight size={12} className="inline" /></Link>
          </div>
          <div className="tbl-container">
            <table className="tbl">
              <thead>
                <tr><th>Date</th><th>Hub</th><th>Material</th><th>Weight</th><th className="text-right">Earned</th><th>Status</th></tr>
              </thead>
              <tbody>
                {RECENT.map((r, i) => (
                  <tr key={i}>
                    <td className="text-textgray">{r.date}</td>
                    <td className="font-bold">{r.hub}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={r.cat} size={26} />
                        {r.cat}
                      </div>
                    </td>
                    <td className="font-mono">{r.kg} kg</td>
                    <td className="text-right"><span className="money text-success">+{formatNaira(r.amt)}</span></td>
                    <td><StatusPill status={r.status === "verified" ? "success" : "pending"} label={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category mix */}
        <div className="card p-6 lg:col-span-4">
          <h3 className="text-h4">Material mix</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days</p>
          <Donut
            centerValue="218 kg"
            centerLabel="Total"
            data={[
              { label: "PET Plastic", value: 96, color: "#1A6B3C" },
              { label: "Cardboard", value: 52, color: "#D4A017" },
              { label: "Aluminium", value: 38, color: "#3F9264" },
              { label: "Paper", value: 32, color: "#1C1C2E" },
            ]}
          />
        </div>
      </div>

      {/* Achievements row */}
      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-h4 flex items-center gap-2"><Sparkles size={18} className="text-accent" /> Achievements unlocking soon</h3>
          <Link to="/collector/badges" className="text-sm font-bold text-primary">All badges <ArrowRight size={12} className="inline" /></Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { name: "Gold Recycler", req: "Submit 50 drops", progress: 96, icon: BadgeCheck, color: "#D4A017" },
            { name: "Streak Master", req: "30-day streak", progress: 47, icon: Flame, color: "#E74C3C" },
            { name: "1 Tonne Club", req: "1,000kg lifetime", progress: 22, icon: Target, color: "#1A6B3C" },
          ].map((b) => (
            <div key={b.name} className="rounded-2xl border border-bordergray bg-cream p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft" style={{ color: b.color }}>
                  <b.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{b.name}</div>
                  <div className="text-[11px] text-textgray">{b.req}</div>
                </div>
                <div className="font-mono text-sm font-bold">{b.progress}%</div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/8">
                <div className="h-full rounded-full" style={{ width: `${b.progress}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function QuickAction({ to, icon: Icon, title, sub }: { to: string; icon: any; title: string; sub: string }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl border border-transparent bg-cream px-3 py-3 transition hover:border-primary hover:bg-mint">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary shadow-soft">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-charcoal">{title}</div>
        <div className="text-[11px] text-textgray">{sub}</div>
      </div>
      <ArrowRight size={14} className="text-textgray group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
