import { Check, Copy, Gift, MessageCircle, Send, Share2, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { useState } from "react";
import { Coins, TrendingUp } from "lucide-react";

const REFS = [
  { name: "Tunde Bello", date: "Apr 22, 2026", drops: 14, earned: 2400, status: "active" },
  { name: "Maryam Sani", date: "Apr 18, 2026", drops: 9, earned: 1800, status: "active" },
  { name: "Chinedu Okeke", date: "Apr 11, 2026", drops: 22, earned: 4400, status: "active" },
  { name: "Joy Eze", date: "Apr 04, 2026", drops: 3, earned: 600, status: "pending" },
  { name: "Wale Aboderin", date: "Mar 28, 2026", drops: 31, earned: 6200, status: "active" },
];

export default function CollectorReferrals() {
  const [copied, setCopied] = useState(false);
  const link = "recovang.com/r/ADAEZE-N";
  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <PageHeader
        eyebrow="Referrals"
        title="Earn ₦500 per friend"
        subtitle="Invite friends, family or your network. They get ₦200 free credit. You earn ₦500 once they make their first 5 drops."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Friends invited" value="14" sub="5 active recyclers" icon={Users} variant="primary" />
        <KPICard label="Bonus earned" value="₦15,400" sub="Lifetime" icon={Coins} variant="gold" />
        <KPICard label="Avg. friend drops" value="11.2" sub="In their first 30 days" icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card-dark p-7 lg:col-span-7">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Your unique link</div>
          <h3 className="mt-2 text-h3 text-white">Share this and start earning</h3>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
            <span className="flex-1 truncate px-3 font-mono text-sm text-white">{link}</span>
            <button onClick={copy} className="btn-gold btn-sm">
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <a className="flex items-center justify-center gap-2 rounded-xl bg-success px-3 py-3 font-bold text-white hover:opacity-90">
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a className="flex items-center justify-center gap-2 rounded-xl bg-info px-3 py-3 font-bold text-white hover:opacity-90">
              <Send size={14} /> Telegram
            </a>
            <a className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 font-bold text-white hover:bg-white/15">
              <Share2 size={14} /> More
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { n: "1", t: "Share your link" },
              { n: "2", t: "Friend signs up" },
              { n: "3", t: "You both earn" },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white/5 p-4">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-charcoal font-extrabold">{s.n}</div>
                <div className="mt-2 text-sm font-bold text-white">{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-gold flex flex-col p-7 lg:col-span-5">
          <Gift size={28} className="text-charcoal" />
          <h3 className="mt-4 text-h3 text-charcoal">April referral promo</h3>
          <p className="mt-2 text-sm text-charcoal/80">
            Invite 10+ friends in April and unlock the <span className="font-extrabold">Eco Influencer</span> badge plus a ₦5,000 bonus.
          </p>
          <div className="mt-5 rounded-2xl bg-white/40 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Progress</span>
              <span className="font-mono">14 / 10 ✓</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-charcoal/10">
              <div className="h-full w-full rounded-full bg-charcoal" />
            </div>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-extrabold text-white">
              <Check size={12} /> Bonus claimed
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4">Your referrals</h3>
          <p className="text-sm text-textgray">People who joined Recovang through you</p>
        </div>
        <table className="tbl">
          <thead><tr><th>Friend</th><th>Joined</th><th>Drops</th><th className="text-right">You earned</th><th>Status</th></tr></thead>
          <tbody>
            {REFS.map((r) => (
              <tr key={r.name}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} size={32} />
                    <span className="font-bold">{r.name}</span>
                  </div>
                </td>
                <td className="text-textgray">{r.date}</td>
                <td className="font-mono">{r.drops}</td>
                <td className="text-right"><span className="money text-success">+{formatNaira(r.earned)}</span></td>
                <td><StatusPill status={r.status === "active" ? "success" : "pending"} label={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
