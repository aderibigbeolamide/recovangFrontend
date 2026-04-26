import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Coins, Flame, Recycle, Trophy, Upload, Wallet } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

export default function CollectorDashboard() {
  return (
    <>
      <PageHeader
        title="Welcome back, Adaeze 👋"
        subtitle="You're 2 submissions away from unlocking the Gold Recycler badge."
        action={
          <Link to="/collector/submit" className="btn-primary">
            <Upload size={16} /> Submit waste
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          tone="green"
          label="Wallet balance"
          value={formatNaira(48750)}
          delta="+₦12,400 this week"
          icon={<Wallet size={18} />}
        />
        <StatCard
          tone="gold"
          label="Lifetime earned"
          value={formatNaira(312_400)}
          delta="across 47 submissions"
          icon={<Coins size={18} />}
        />
        <StatCard label="Kg recovered" value="218.4 kg" delta="+18.2 kg this month" icon={<Recycle size={18} />} />
        <StatCard label="Current streak" value="14 days" delta="Top 3% in Lagos" icon={<Flame size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section
          title="Recent submissions"
          description="Your last 5 verified drops"
          action={
            <Link to="/collector/history" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="overflow-hidden rounded-xl border border-bordergray">
            <table className="min-w-full text-sm">
              <thead className="bg-offwhite text-left text-xs uppercase text-textgray">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Hub</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3 text-right">Weight</th>
                  <th className="px-4 py-3 text-right">Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordergray bg-white">
                {RECENT.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-textgray">{r.date}</td>
                    <td className="px-4 py-3 font-semibold">{r.hub}</td>
                    <td className="px-4 py-3">{r.material}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.weight}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-success">
                      +{formatNaira(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Quick actions">
          <div className="grid gap-3">
            {QUICK.map((q) => (
              <Link
                key={q.label}
                to={q.to}
                className="flex items-center justify-between rounded-xl border border-bordergray p-4 transition-colors hover:border-primary hover:bg-mint"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-primary">
                    {q.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold">{q.label}</div>
                    <div className="text-xs text-textgray">{q.desc}</div>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-textgray" />
              </Link>
            ))}
          </div>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Nearby hubs" description="Verified drop-off points near you">
          <div className="space-y-3">
            {NEARBY.map((h) => (
              <div key={h.name} className="flex items-center justify-between rounded-xl border border-bordergray p-3">
                <div>
                  <div className="font-semibold">{h.name}</div>
                  <div className="text-xs text-textgray">{h.address} · {h.distance}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-textgray">Capacity</div>
                  <div className="font-mono text-sm font-semibold">{h.capacity}%</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Earnings goal — May 2026">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-textgray">Saving towards</p>
              <p className="font-display text-xl font-bold">School fees · ₦80,000</p>
            </div>
            <p className="font-mono text-xl font-bold text-accent">61%</p>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-bordergray">
            <div className="h-full bg-gradient-gold" style={{ width: "61%" }} />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-textgray">
            <Trophy size={14} className="text-accent" /> ₦48,750 saved · ₦31,250 to go
          </div>
          <Link to="/collector/withdraw" className="btn-outline mt-4 w-full">
            Withdraw to bank <ArrowRight size={14} />
          </Link>
        </Section>
      </div>
    </>
  );
}

const RECENT = [
  { id: "1", date: "Apr 24", hub: "Surulere Hub", material: "PET Bottles", weight: "4.2 kg", amount: 840 },
  { id: "2", date: "Apr 22", hub: "Surulere Hub", material: "Cardboard", weight: "8.0 kg", amount: 480 },
  { id: "3", date: "Apr 19", hub: "Yaba Centre", material: "Aluminium Cans", weight: "1.1 kg", amount: 660 },
  { id: "4", date: "Apr 16", hub: "Surulere Hub", material: "Mixed Paper", weight: "5.6 kg", amount: 280 },
  { id: "5", date: "Apr 13", hub: "Lekki Hub", material: "PET Bottles", weight: "3.2 kg", amount: 640 },
];

const QUICK = [
  { to: "/collector/submit", label: "New submission", desc: "Drop waste at any hub", icon: <Upload size={18} /> },
  { to: "/collector/withdraw", label: "Withdraw", desc: "Bank, airtime, bills", icon: <Wallet size={18} /> },
  { to: "/collector/leaderboard", label: "Leaderboard", desc: "Climb the rankings", icon: <Trophy size={18} /> },
];

const NEARBY = [
  { name: "Surulere Hub", address: "12 Bode Thomas", distance: "1.2 km", capacity: 68 },
  { name: "Yaba Recovery Centre", address: "Herbert Macaulay Way", distance: "3.7 km", capacity: 45 },
  { name: "Lekki Phase 1 Hub", address: "Admiralty Road", distance: "8.4 km", capacity: 82 },
];
