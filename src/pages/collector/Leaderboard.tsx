import { useState } from "react";
import { Crown, Flame, Trophy } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const ROWS = [
  { rank: 1, name: "Chioma O.", area: "Surulere · Lagos", weight: 412, earned: 248_000 },
  { rank: 2, name: "Tunde S.", area: "Yaba · Lagos", weight: 398, earned: 234_000 },
  { rank: 3, name: "Aisha B.", area: "Wuse · Abuja", weight: 372, earned: 221_000 },
  { rank: 4, name: "You — Adaeze", area: "Surulere · Lagos", weight: 218, earned: 130_000 },
  { rank: 5, name: "Emeka P.", area: "Trans-Amadi · PH", weight: 196, earned: 118_000 },
  { rank: 6, name: "Halima K.", area: "Kano Metro", weight: 184, earned: 110_000 },
  { rank: 7, name: "Femi R.", area: "Lekki · Lagos", weight: 172, earned: 103_000 },
];

export default function CollectorLeaderboard() {
  const [scope, setScope] = useState<"area" | "national">("area");
  return (
    <>
      <PageHeader
        title="Leaderboard"
        subtitle="See how you stack up against your neighborhood and the rest of Nigeria."
        action={
          <div className="inline-flex rounded-xl border border-bordergray bg-white p-1">
            {(["area", "national"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  scope === s ? "bg-primary text-white" : "text-textgray"
                }`}
              >
                {s === "area" ? "Neighborhood" : "National"}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {ROWS.slice(0, 3).map((r, i) => (
          <div
            key={r.name}
            className={`card relative overflow-hidden ${i === 0 ? "bg-gradient-gold text-charcoal" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 font-display font-extrabold">
                #{r.rank}
              </div>
              {i === 0 ? <Crown className="text-charcoal" /> : <Trophy className="text-primary" />}
            </div>
            <p className="mt-3 font-display text-lg font-bold">{r.name}</p>
            <p className="text-xs opacity-70">{r.area}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-mono">{r.weight} kg</span>
              <span className="font-mono font-bold">{formatNaira(r.earned)}</span>
            </div>
          </div>
        ))}
      </div>

      <Section>
        <div className="overflow-x-auto rounded-xl border border-bordergray">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Collector</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3 text-right">Kg recovered</th>
                <th className="px-4 py-3 text-right">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordergray bg-white">
              {ROWS.map((r) => (
                <tr key={r.rank} className={r.name.startsWith("You") ? "bg-mint" : "hover:bg-mint/40"}>
                  <td className="px-4 py-3 font-mono">#{r.rank}</td>
                  <td className="px-4 py-3 font-semibold">
                    {r.name.startsWith("You") && <Flame size={14} className="mr-1 inline text-accent" />}
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-textgray">{r.area}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.weight} kg</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{formatNaira(r.earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
