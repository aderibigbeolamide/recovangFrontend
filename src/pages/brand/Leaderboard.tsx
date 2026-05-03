import { Award, Trophy, TrendingUp, ShieldCheck, Leaf } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { useBrandLeaderboard } from "@/hooks/useBrand";
import { formatKg } from "@/lib/cn";

export default function BrandLeaderboard() {
  const { data: leaderboard = [], isLoading } = useBrandLeaderboard();

  if (isLoading) return <div className="p-8 text-center font-bold text-primary">Loading standings…</div>;

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <>
      <PageHeader
        eyebrow="Ecosystem transparency"
        title="Eco-Compliance Leaderboard"
        subtitle="Ranking brands by their commitment to a plastic-free Nigeria. Transparency drives impact."
      />

      {/* Podium */}
      <div className="grid gap-6 sm:grid-cols-3">
        {top3.map((b: any, i: number) => {
          const isWinner = i === 0;
          return (
            <div key={b.id} className={`relative flex flex-col items-center rounded-3xl p-8 text-center transition-transform hover:scale-105 ${isWinner ? 'bg-grad-primary text-white shadow-xl lg:order-2' : 'bg-white border border-bordergray lg:order-1'}`}>
               {isWinner && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-black uppercase text-charcoal">Leader</div>}
               <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isWinner ? 'bg-white/20' : 'bg-cream text-primary'}`}>
                 <Trophy size={32} className={isWinner ? 'text-accent' : 'text-primary'} />
               </div>
               <h3 className="mt-4 text-xl font-black">{b.brand}</h3>
               <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${isWinner ? 'bg-white/20' : 'bg-mint text-primary'}`}>
                 <ShieldCheck size={14} /> {b.tier} Tier
               </div>
               <div className="mt-6">
                 <div className="text-4xl font-black tracking-tighter">{b.compliance}%</div>
                 <div className={`text-[10px] font-bold uppercase tracking-widest ${isWinner ? 'text-white/70' : 'text-textgray'}`}>Compliance Score</div>
               </div>
               <div className="mt-4 text-xs font-bold opacity-70">
                 {formatKg(b.recovered)} recovered
               </div>
            </div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4">Full Standings</h3>
          <p className="text-sm text-textgray">All brands ranked by verified recovery progress.</p>
        </div>
        <div className="tbl-container">
          <table className="tbl">
            <thead>
              <tr>
                <th className="w-16">Rank</th>
                <th>Brand</th>
                <th>Tier</th>
                <th className="text-center">Compliance</th>
                <th className="text-right">Recovered</th>
                <th className="text-right">Target</th>
              </tr>
            </thead>
            <tbody>
              {others.map((b: any, i: number) => (
                <tr key={b.id}>
                  <td className="font-mono font-bold text-textgray">#{i + 4}</td>
                  <td className="font-bold">{b.brand}</td>
                  <td><StatusPill status={b.tier === "Platinum" ? "success" : "warning"} label={b.tier} /></td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2 font-mono font-black">
                      {b.compliance}%
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-charcoal/5">
                        <div className="h-full bg-primary" style={{ width: `${b.compliance}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono font-bold">{formatKg(b.recovered)}</td>
                  <td className="text-right text-textgray font-mono">{formatKg(b.target)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="card p-6 bg-grad-mint">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-primary">
                <Leaf size={20} />
            </div>
            <h3 className="mt-4 text-lg font-black text-primary">How is this calculated?</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary/80">
                Compliance scores are calculated by dividing your <strong>verified recovery weight</strong> by your <strong>EPR financial target</strong>. We update these rankings every 24 hours as new drops are verified at our hubs.
            </p>
        </div>
        <div className="card p-6 bg-grad-primary-deep text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-accent">
                <Award size={20} />
            </div>
            <h3 className="mt-4 text-lg font-black text-accent">Gold & Platinum Rebates</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
                Brands that maintain a Gold or Platinum tier for three consecutive quarters are eligible for a <strong>5% rebate</strong> on their platform service fees. Stay consistent to earn your reward.
            </p>
        </div>
      </div>
    </>
  );
}
