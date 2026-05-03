import { Calendar, Check, Coins, Flame, Gift, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { KPICard, PageHeader } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const HEATMAP = Array.from({ length: 91 }).map((_, i) => {
  const v = Math.random();
  return v > 0.7 ? 4 : v > 0.55 ? 3 : v > 0.4 ? 2 : v > 0.25 ? 1 : 0;
});

const REWARDS = [
  { day: 7, label: "Streak Starter", reward: "+₦200 bonus", done: true },
  { day: 14, label: "Two Week Champ", reward: "+₦500 bonus", done: true },
  { day: 21, label: "Three Week Hero", reward: "+₦1,000 + 1GB data", done: false, current: true, progress: 67 },
  { day: 30, label: "Streak Master", reward: "+₦2,500 + Gold badge", done: false, progress: 47 },
  { day: 60, label: "Eco Warrior", reward: "+₦7,500 + Recovang tee", done: false, progress: 23 },
  { day: 100, label: "Centurion", reward: "+₦15,000 + Free hub training", done: false, progress: 14 },
];

function shade(v: number) {
  return [
    "bg-charcoal/8",
    "bg-primary/30",
    "bg-primary/55",
    "bg-primary/80",
    "bg-primary",
  ][v];
}

import { useStreak, useDashboard } from "@/hooks/useCollector";

export default function CollectorStreaks() {
  const { data: streakData, isLoading: loadingStreak } = useStreak();
  const { data: dashboard, isLoading: loadingDash } = useDashboard();

  if (loadingStreak || loadingDash) return <div className="p-20 text-center font-bold">Loading streaks...</div>;

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || currentStreak;

  return (
    <>
      <PageHeader
        eyebrow="Streaks"
        title="Keep your momentum"
        subtitle="Drop waste at least once every 7 days to extend your streak. Bigger streaks = bigger bonuses."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Current streak" value={<><Flame size={26} className="inline text-error" /> {currentStreak} d</>} sub="Keep it going!" icon={Flame} />
        <KPICard label="Longest streak" value={`${longestStreak} days`} sub="Personal record" icon={Trophy} variant="gold" />
        <KPICard label="Bonus earned" value={formatNaira((dashboard?.totalEarned || 0) * 0.05 / 100)} sub="Est. streak bonuses" icon={Coins} variant="primary" />
        <KPICard label="Lifetime Active" value={dashboard?.totalVolume?.toFixed(1) + " kg"} sub="Total recovered" icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-h4">Activity heatmap</h3>
            <span className="badge bg-charcoal/8 text-charcoal/70 inline-flex items-center gap-1"><Calendar size={11} /> Last 90 days</span>
          </div>
          <div className="mt-5 grid grid-cols-13 gap-1.5" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
            {HEATMAP.map((v, i) => (
              <div key={i} className={`aspect-square rounded ${shade(v)}`} title={`${v} drops`} />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-[11px] text-textgray">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((v) => <div key={v} className={`h-3 w-3 rounded ${shade(v)}`} />)}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="card-dark p-6 lg:col-span-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-error/15">
              <Flame size={22} className="text-error" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">You're on fire</div>
              <div className="font-display text-2xl font-extrabold text-white">{currentStreak}-day streak</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            You've maintained your momentum. Drop again before the next deadline to extend your streak to <span className="font-extrabold text-accent">{currentStreak + 1} days</span>.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Streak Status</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-extrabold text-accent">{currentStreak > 0 ? "ACTIVE" : "INACTIVE"}</span>
              <span className="text-xs font-bold text-white/60">Update: Weekly</span>
            </div>
          </div>
          <button className="btn-gold mt-5 w-full" onClick={() => window.location.href='/collector/submit'}>Submit a drop now</button>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4 flex items-center gap-2"><Gift size={18} className="text-accent" /> Streak rewards</h3>
          <p className="text-sm text-textgray">Hit each milestone, claim each reward.</p>
        </div>
        <div className="divide-y divide-bordergray">
          {REWARDS.map((r) => {
            const isDone = currentStreak >= r.day;
            const isCurrent = currentStreak < r.day && (currentStreak >= (REWARDS[REWARDS.indexOf(r)-1]?.day || 0));
            const progress = Math.min(Math.round((currentStreak / r.day) * 100), 100);
            
            return (
              <div key={r.day} className={`flex items-center gap-5 p-5 ${isCurrent ? "bg-mint/40" : ""}`}>
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold ${
                  isDone ? "bg-success text-white" : isCurrent ? "bg-grad-gold text-charcoal" : "bg-cream text-charcoal/50"
                }`}>
                  {isDone ? <Check size={20} /> : r.day}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-charcoal">{r.label}</div>
                  <div className="text-xs text-textgray">Day {r.day} streak · {r.reward}</div>
                  {!isDone && (
                    <div className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-charcoal/8">
                      <div className={`h-full rounded-full ${isCurrent ? "bg-grad-gold" : "bg-primary"}`} style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
                {isDone ? (
                  <span className="badge-success">Achieved</span>
                ) : isCurrent ? (
                  <span className="badge-gold">{progress}% complete</span>
                ) : (
                  <span className="badge bg-charcoal/8 text-charcoal/60">{progress}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
