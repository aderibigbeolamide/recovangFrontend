import { Copy, Share2, Users } from "lucide-react";
import { PageHeader, Section, StatCard } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

export default function CollectorReferrals() {
  const code = "ADAEZE-2026";
  return (
    <>
      <PageHeader title="Refer & earn" subtitle="Invite friends — earn ₦500 the first time they make a verified submission." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard tone="green" label="Friends invited" value="12" delta="3 this month" icon={<Users size={18} />} />
        <StatCard tone="gold" label="Total earned" value={formatNaira(4_500)} delta="9 active" />
        <StatCard label="Pending payouts" value={formatNaira(1_500)} delta="3 friends to verify" />
      </div>

      <Section className="mt-6" title="Your referral code" description="Share with friends and family — they get ₦200 bonus on signup, you get ₦500 on their first drop.">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-primary bg-mint p-5">
          <span className="font-mono text-2xl font-extrabold text-charcoal">{code}</span>
          <div className="ml-auto flex gap-2">
            <button className="btn-outline"><Copy size={14} /> Copy</button>
            <button className="btn-primary"><Share2 size={14} /> Share</button>
          </div>
        </div>
      </Section>

      <Section className="mt-6" title="Recent referrals">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-textgray">
            <tr><th className="py-2">Friend</th><th>Joined</th><th>Status</th><th className="text-right">Reward</th></tr>
          </thead>
          <tbody className="divide-y divide-bordergray">
            {[
              { n: "Chika E.", d: "Apr 22", s: "Active · 4 submissions", r: 500 },
              { n: "Tope M.", d: "Apr 19", s: "Active · 2 submissions", r: 500 },
              { n: "Yusuf O.", d: "Apr 14", s: "Pending first submission", r: 0 },
            ].map((r) => (
              <tr key={r.n}>
                <td className="py-3 font-semibold">{r.n}</td>
                <td className="py-3 text-textgray">{r.d}</td>
                <td className="py-3">{r.s}</td>
                <td className="py-3 text-right font-mono font-semibold text-success">{r.r ? `+${formatNaira(r.r)}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}
