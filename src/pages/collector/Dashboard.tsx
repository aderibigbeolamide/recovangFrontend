import { Link } from "react-router-dom";
import { ArrowRight, Award, BadgeCheck, Coins, Flame, Lock, Plus, Recycle, Sparkles, Target, TrendingUp, Upload, Wallet } from "lucide-react";
import { KPICard, PageHeader, StatusPill, DashboardSkeleton } from "@/components/ui";
import { AreaChart, Donut, ProgressRing, Sparkline } from "@/components/charts";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";
import { useDashboard } from "@/hooks/useCollector";
import { useAuth } from "@/store/auth";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
});

export default function CollectorDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const weeklyGoal = data?.weeklyGoal || { current: 0, target: 50, percentage: 0 };
  const balance = data?.balance || 0;
  const totalEarned = data?.totalEarned || 0;
  const totalVolume = data?.totalVolume || 0;
  const streakDays = data?.streakDays || 0;
  const weekTotal = (data?.weeklyEarnings || []).reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow={`Collector portal · ${user?.email}`}
        title={`Welcome back, ${user?.firstName || "Collector"}.`}
        subtitle={
          weeklyGoal.percentage >= 100
            ? "You've crushed your weekly goal — every extra kg is a bonus."
            : `${Math.max(0, weeklyGoal.target - weeklyGoal.current)} kg away from your weekly goal. You've got this.`
        }
        actions={
          <>
            <Link to="/collector/withdraw" className="btn-outline"><Wallet size={14} /> Withdraw</Link>
            <Link to="/collector/submit" className="btn-primary"><Upload size={14} /> Submit waste</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard index={0} label="Wallet balance" value={formatNaira(balance / 100)} sub="Available for withdrawal" icon={Wallet} variant="primary" />
        <KPICard index={1} label="Lifetime earned" value={formatNaira(totalEarned / 100)} sub="Total earnings to date" icon={Coins} variant="gold" />
        <KPICard index={2} label="KG recovered" value={`${totalVolume} kg`} sub="Last 30 days" icon={Recycle} />
        <KPICard index={3} label="Current streak" value={`${streakDays} days`} sub="Keep dropping to grow" icon={Flame} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Earnings chart */}
        <motion.div {...fadeUp(0.15)} className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Last 7 days · Earnings (₦)</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">{formatNaira(weekTotal)}</div>
                {weekTotal > 0 && <span className="badge-success">Active week</span>}
              </div>
            </div>
            <Link to="/collector/history" className="btn-ghost btn-sm text-primary">History <ArrowRight size={12} /></Link>
          </div>
          <div className="mt-6">
            <AreaChart data={data?.weeklyEarnings || []} height={220} />
          </div>
        </motion.div>

        {/* Weekly goal + quick actions */}
        <div className="space-y-4 lg:col-span-4">
          <motion.div {...fadeUp(0.2)} className="card-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Weekly goal</div>
              <span className="badge bg-white/10 text-white/60 text-[10px]">
                {weeklyGoal.percentage >= 100 ? "🏆 Done!" : `${weeklyGoal.percentage}%`}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <ProgressRing value={weeklyGoal.percentage} color="#D4A017" label={`of ${weeklyGoal.target}kg`} />
              <div className="flex-1">
                <div className="font-display text-2xl font-extrabold text-white">{weeklyGoal.current} / {weeklyGoal.target} kg</div>
                <p className="mt-1.5 text-xs text-white/65 leading-snug">
                  {weeklyGoal.percentage >= 100
                    ? "Goal achieved! Every extra kg helps the planet."
                    : `${Math.max(0, weeklyGoal.target - weeklyGoal.current)} kg to hit your weekly target.`}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="card p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Quick actions</div>
            <div className="grid gap-2">
              <QuickAction to="/collector/submit" icon={Upload} title="New submission" sub="Drop waste at any hub" disabled={!user?.isApproved} />
              <QuickAction to="/collector/withdraw" icon={Wallet} title="Withdraw" sub="Bank, airtime, bills" disabled={!user?.isApproved} />
              <QuickAction to="/collector/leaderboard" icon={Award} title="Leaderboard" sub="Climb the rankings" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Recent submissions */}
        <motion.div {...fadeUp(0.3)} className="card overflow-hidden lg:col-span-8">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Recent submissions</h3>
              <p className="text-sm text-textgray">Your last verified drops</p>
            </div>
            <Link to="/collector/history" className="text-sm font-bold text-primary hover:text-primary-700">
              View all <ArrowRight size={12} className="inline" />
            </Link>
          </div>
          <div className="tbl-container">
            <table className="tbl">
              <thead>
                <tr><th>Date</th><th>Hub</th><th>Material</th><th>Weight</th><th className="text-right">Earned</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data?.recentSubmissions?.map((r: any, i: number) => (
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
                    <td><StatusPill status={r.status === "verified" ? "success" : r.status === "pending" ? "pending" : "error"} label={r.status} /></td>
                  </tr>
                ))}
                {(!data?.recentSubmissions || data.recentSubmissions.length === 0) && (
                  <tr><td colSpan={6} className="py-12 text-center text-textgray">No submissions yet — make your first drop!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Material mix */}
        <motion.div {...fadeUp(0.35)} className="card p-6 lg:col-span-4">
          <h3 className="text-h4">Material mix</h3>
          <p className="mb-5 text-sm text-textgray">Last 30 days</p>
          <Donut
            centerValue={`${data?.totalVolume || 0} kg`}
            centerLabel="Total"
            data={data?.materialMix || []}
          />
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div {...fadeUp(0.4)} className="mt-6 card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-h4 flex items-center gap-2">
            <Sparkles size={18} className="text-accent" /> Achievements
          </h3>
          <Link to="/collector/badges" className="text-sm font-bold text-primary">All badges <ArrowRight size={12} className="inline" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "Gold Recycler", req: "Submit 50 drops", progress: 96, icon: BadgeCheck, color: "#D4A017" },
            { name: "Streak Master", req: "30-day streak", progress: 47, icon: Flame, color: "#E74C3C" },
            { name: "1 Tonne Club", req: "1,000kg lifetime", progress: 22, icon: Target, color: "#1A6B3C" },
          ].map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.4 }}
              className="rounded-2xl border border-bordergray bg-cream p-4 transition hover:border-accent/30 hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft" style={{ color: b.color }}>
                  <b.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold truncate">{b.name}</div>
                  <div className="text-[11px] text-textgray">{b.req}</div>
                </div>
                <div className="font-mono text-sm font-bold tabular-nums">{b.progress}%</div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/8">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${b.progress}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  style={{ background: b.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function QuickAction({ to, icon: Icon, title, sub, disabled }: { to: string; icon: any; title: string; sub: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-cream/50 px-3 py-3 cursor-not-allowed opacity-60">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-textgray shadow-soft">
          <Icon size={15} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-textgray">{title}</div>
          <div className="text-[11px] text-textgray/60">{sub}</div>
        </div>
        <Lock size={13} className="text-textgray/35" />
      </div>
    );
  }
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl border border-transparent bg-cream px-3 py-3 transition hover:border-primary/20 hover:bg-mint">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-primary shadow-soft transition group-hover:bg-primary group-hover:text-white">
        <Icon size={15} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-charcoal">{title}</div>
        <div className="text-[11px] text-textgray">{sub}</div>
      </div>
      <ArrowRight size={13} className="text-textgray/50 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
