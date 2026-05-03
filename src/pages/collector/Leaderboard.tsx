import { Award, Crown, Flame, Medal, TrendingUp, Trophy } from "lucide-react";
import { PageHeader, Avatar } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { useState } from "react";

const TOP3 = [
  { name: "Kunle Bakare", area: "Ikeja", kg: 412, n: 84210, avatar: "KB" },
  { name: "Adaeze Nwosu (you)", area: "Surulere", kg: 218, n: 48750, avatar: "AN", you: true },
  { name: "Folake Adeola", area: "Lekki", kg: 186, n: 41360, avatar: "FA" },
];

const TABLE = [
  { rank: 4, name: "Tunde Bello", area: "Yaba", kg: 178, n: 39400, streak: 21 },
  { rank: 5, name: "Maryam Sani", area: "Ikoyi", kg: 162, n: 35820, streak: 18 },
  { rank: 6, name: "Chinedu Okeke", area: "Ajah", kg: 154, n: 32100, streak: 14 },
  { rank: 7, name: "Aisha Yusuf", area: "Apapa", kg: 142, n: 29800, streak: 24 },
  { rank: 8, name: "Segun Olu", area: "Surulere", kg: 138, n: 28910, streak: 9 },
  { rank: 9, name: "Joy Eze", area: "Ojota", kg: 124, n: 26400, streak: 12 },
  { rank: 10, name: "Ibrahim Lawal", area: "Lekki", kg: 118, n: 24800, streak: 7 },
  { rank: 11, name: "Ngozi Eze", area: "Maryland", kg: 112, n: 23800, streak: 11 },
  { rank: 12, name: "Wale Aboderin", area: "Magodo", kg: 108, n: 22600, streak: 8 },
];

const RANGES = ["This week", "This month", "All time"];
const SCOPES = ["Lagos", "Abuja", "PH", "All Nigeria"];

import { useLeaderboard } from "@/hooks/useCollector";

export default function CollectorLeaderboard() {
  const [range, setRange] = useState(RANGES[0]);
  const [scope, setScope] = useState(SCOPES[0]);
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) return <div className="p-20 text-center font-bold">Loading rankings...</div>;

  const top3 = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title="Top recyclers in your area"
        subtitle="Climb the ranks. Top 100 each month win cash bonuses, free data and Recovang merch."
      />

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
          {RANGES.map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`rounded-full px-3 py-1.5 ${range === r ? "bg-charcoal text-white" : "text-textgray"}`}>{r}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <button key={s} onClick={() => setScope(s)} className={`chip ${scope === s ? "chip-active" : ""}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="card relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-grad-mint opacity-50" />
        <div className="relative grid items-end gap-4 sm:grid-cols-3">
          {/* Reorder for podium look: 2nd, 1st, 3rd */}
          {[
            top3[1] ? { ...top3[1], rank: 2, h: 160, color: "bg-charcoal/8 text-charcoal", trophy: <Medal size={20} className="text-charcoal/60" /> } : null,
            top3[0] ? { ...top3[0], rank: 1, h: 200, color: "bg-grad-gold text-charcoal", trophy: <Crown size={22} className="text-charcoal" /> } : null,
            top3[2] ? { ...top3[2], rank: 3, h: 140, color: "bg-orange-100 text-orange-700", trophy: <Medal size={20} className="text-orange-600" /> } : null,
          ].filter(Boolean).map((p: any) => (
            <div key={p.rank} className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <Avatar name={p.name} size={68} />
                <div className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow-soft">{p.trophy}</div>
              </div>
              <div className="font-extrabold text-charcoal">{p.name}</div>
              <div className="text-xs text-textgray">Area Rank #{p.rank}</div>
              <div className="mt-2 flex items-center justify-center gap-3 text-xs text-textgray">
                <span className="font-mono font-extrabold text-charcoal">{p.points} points</span>
              </div>
              <div className={`mt-3 grid w-full place-items-end rounded-t-2xl px-4 pb-3 pt-4 font-display text-3xl font-extrabold ${p.color}`} style={{ height: p.h }}>
                #{p.rank}
              </div>
            </div>
          ))}
        </div>
        {(!leaderboard || leaderboard.length === 0) && <div className="relative py-20 text-center text-textgray font-bold">No active leaderboard data for this period.</div>}
      </div>

      <div className="mt-6 card overflow-hidden">
        <table className="tbl">
          <thead>
            <tr><th className="w-16">Rank</th><th>Collector</th><th>Status</th><th>Score</th><th>Recent activity</th></tr>
          </thead>
          <tbody>
            {rest.map((r: any) => (
              <tr key={r.rank}>
                <td><span className="font-mono text-sm font-extrabold text-charcoal/70">#{r.rank}</span></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} size={32} />
                    <span className="font-bold">{r.name}</span>
                  </div>
                </td>
                <td><span className="badge-mint">Active</span></td>
                <td className="font-mono">{r.points}</td>
                <td>
                  <span className="text-textgray text-xs">Last drop today</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
