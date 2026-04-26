import { Award, Lock } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";

const BADGES = [
  { name: "First Drop", desc: "Made your first verified submission", xp: 50, unlocked: true },
  { name: "10 Kilo Club", desc: "Recovered 10 kg of any material", xp: 100, unlocked: true },
  { name: "Plastic Slayer", desc: "Recovered 50 kg of PET plastic", xp: 250, unlocked: true },
  { name: "Hub Hopper", desc: "Submitted at 3 different hubs", xp: 150, unlocked: true },
  { name: "Streak Master", desc: "14-day collection streak", xp: 300, unlocked: true },
  { name: "Gold Recycler", desc: "Recovered 250 kg total", xp: 500, unlocked: false },
  { name: "Naira Maker", desc: "Earned ₦500,000 lifetime", xp: 750, unlocked: false },
  { name: "Eco Warrior", desc: "Recovered 1,000 kg total", xp: 1000, unlocked: false },
];

export default function CollectorBadges() {
  const xp = BADGES.filter((b) => b.unlocked).reduce((s, b) => s + b.xp, 0);
  return (
    <>
      <PageHeader title="Badges & XP" subtitle="Level up by recovering more material — every badge unlocks a real reward." />
      <Section className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-textgray">Total XP</p>
            <p className="font-mono text-3xl font-extrabold text-accent">{xp.toLocaleString()}</p>
            <p className="text-sm text-textgray">Level 4 · Rising Star</p>
          </div>
          <div className="flex-1 sm:max-w-md">
            <div className="mb-2 flex justify-between text-xs text-textgray">
              <span>Progress to Level 5</span>
              <span>{xp} / 1,500 XP</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-bordergray">
              <div className="h-full bg-gradient-gold" style={{ width: `${Math.min(100, (xp / 1500) * 100)}%` }} />
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div key={b.name} className={`card text-center ${!b.unlocked && "opacity-60"}`}>
            <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${b.unlocked ? "bg-gradient-gold text-charcoal" : "bg-mint text-textgray"}`}>
              {b.unlocked ? <Award size={28} /> : <Lock size={20} />}
            </div>
            <h3 className="font-display font-bold">{b.name}</h3>
            <p className="mt-1 text-xs text-textgray">{b.desc}</p>
            <p className="mt-3 font-mono text-sm font-bold text-accent">+{b.xp} XP</p>
          </div>
        ))}
      </div>
    </>
  );
}
