import { Award, BadgeCheck, Crown, Droplets, Flame, Globe2, Leaf, Lock, Recycle, Sparkles, Star, Target, Trophy, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui";

const TIERS = [
  { name: "Bronze", color: "from-orange-300 to-orange-600", text: "text-orange-700", count: 8 },
  { name: "Silver", color: "from-slate-300 to-slate-500", text: "text-slate-700", count: 6 },
  { name: "Gold", color: "from-accent to-accent-700", text: "text-accent-700", count: 4, current: true },
  { name: "Platinum", color: "from-emerald-300 to-emerald-600", text: "text-emerald-700", count: 0 },
  { name: "Diamond", color: "from-cyan-300 to-cyan-600", text: "text-cyan-700", count: 0 },
];

const BADGES = [
  { name: "First drop", icon: Sparkles, tier: "Bronze", earned: true, desc: "Made your very first drop" },
  { name: "10 drops club", icon: Recycle, tier: "Bronze", earned: true, desc: "Recorded 10 verified drops" },
  { name: "PET pioneer", icon: Droplets, tier: "Silver", earned: true, desc: "Recovered 50kg of PET" },
  { name: "Cardboard champ", icon: Award, tier: "Silver", earned: true, desc: "Recovered 100kg of cardboard" },
  { name: "Streak starter", icon: Flame, tier: "Bronze", earned: true, desc: "7-day submission streak" },
  { name: "Streak master", icon: Flame, tier: "Gold", earned: false, progress: 47, desc: "30-day submission streak" },
  { name: "1 tonne club", icon: Trophy, tier: "Gold", earned: false, progress: 22, desc: "Recovered 1,000kg lifetime" },
  { name: "Top 100", icon: Crown, tier: "Gold", earned: true, desc: "Reached top 100 in your area" },
  { name: "Eco influencer", icon: Star, tier: "Silver", earned: true, desc: "Referred 5 active collectors" },
  { name: "City champion", icon: Globe2, tier: "Platinum", earned: false, progress: 8, desc: "Top 10 in your city for a month" },
  { name: "Diamond recycler", icon: BadgeCheck, tier: "Diamond", earned: false, progress: 4, desc: "Recovered 10,000kg lifetime" },
  { name: "Carbon hero", icon: Leaf, tier: "Platinum", earned: false, progress: 18, desc: "Saved 1 tonne of CO₂" },
];

import { useBadges } from "@/hooks/useCollector";

export default function CollectorBadges() {
  const { data: earnedBadges, isLoading } = useBadges();

  if (isLoading) return <div className="p-20 text-center font-bold">Loading badges...</div>;

  const earnedCount = earnedBadges?.length || 0;

  return (
    <>
      <PageHeader
        eyebrow="Badges & achievements"
        title="Your recycling milestones"
        subtitle={`You've unlocked ${earnedCount} badges. Keep dropping to climb the tiers.`}
      />

      {/* Tier strip */}
      <div className="card overflow-hidden p-2">
        <div className="grid gap-2 sm:grid-cols-5">
          {TIERS.map((t) => {
            const count = earnedBadges?.filter((b: any) => b.type === t.name.toUpperCase() || b.tier === t.name).length || 0;
            return (
              <div key={t.name} className={`relative overflow-hidden rounded-2xl p-5 ${t.current ? "ring-2 ring-accent" : ""}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-15`} />
                <div className="relative">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${t.text}`}>{t.name} tier</div>
                  <div className="mt-1 font-display text-2xl font-extrabold text-charcoal">{count}</div>
                  <div className="text-[11px] text-textgray">badges earned</div>
                  {t.current && <span className="absolute right-2 top-2 badge-gold">Current</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {earnedBadges?.map((b: any) => {
          const tier = TIERS.find((t) => t.name.toUpperCase() === b.type) || TIERS[0];
          return (
            <div key={b.id} className="card p-6 animate-lift">
              <div className="flex items-start gap-4">
                <div className={`relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${tier.color} text-white shadow-lift`}>
                  {b.iconUrl ? <img src={b.iconUrl} className="w-8 h-8 object-contain" /> : <Award size={26} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold">{b.name}</span>
                    <span className={`badge bg-charcoal/8 ${tier.text}`}>{b.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-textgray">{b.description}</p>
                </div>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-success-50 px-3 py-1 text-xs font-bold text-success">
                <BadgeCheck size={12} /> Awarded · {new Date(b.awardedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            );
        })}
        {(!earnedBadges || earnedBadges.length === 0) && (
          <div className="col-span-full p-20 text-center card border-dashed">
            <Lock size={48} className="mx-auto mb-4 text-textgray opacity-20" />
            <h3 className="text-h4">No badges earned yet</h3>
            <p className="text-textgray mt-2">Start dropping waste to unlock your first milestone!</p>
            <button className="btn-primary mt-6" onClick={() => window.location.href='/collector/submit'}>Submit waste</button>
          </div>
        )}
      </div>
    </>
  );
}
