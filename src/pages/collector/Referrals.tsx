import { Check, Copy, Gift, MessageCircle, Send, Share2, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { useState } from "react";
import { Coins, TrendingUp } from "lucide-react";
import { useReferrals } from "@/hooks/useCollector";

export default function CollectorReferrals() {
  const { data, isLoading } = useReferrals();
  const [copied, setCopied] = useState(false);
  
  const link = data?.link || "https://recovang.com/r/RECOV1";
  
  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isLoading) return <div className="p-20 text-center font-bold">Loading referrals...</div>;

  const friends = data?.friends || [];

  return (
    <>
      <PageHeader
        eyebrow="Referrals"
        title="Earn ₦500 per friend"
        subtitle="Invite friends, family or your network. They get ₦200 free credit. You earn ₦500 once they make their first 5 drops."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Friends invited" value={data?.totalReferrals || 0} sub={`${data?.activeReferrals || 0} active recyclers`} icon={Users} variant="primary" />
        <KPICard label="Bonus earned" value={formatNaira(data?.totalBonus || 0)} sub="Lifetime" icon={Coins} variant="gold" />
        <KPICard label="Avg. friend drops" value="0" sub="In their first 30 days" icon={TrendingUp} />
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
            <a href={`https://wa.me/?text=Join me on Recovang and earn money from waste! Use my link: ${link}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-success px-3 py-3 font-bold text-white hover:opacity-90">
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a href={`https://t.me/share/url?url=${link}&text=Join me on Recovang!`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-info px-3 py-3 font-bold text-white hover:opacity-90">
              <Send size={14} /> Telegram
            </a>
            <button onClick={copy} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 font-bold text-white hover:bg-white/15">
              <Share2 size={14} /> Copy link
            </button>
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
          <h3 className="mt-4 text-h3 text-charcoal">Referral status</h3>
          <p className="mt-2 text-sm text-charcoal/80">
            You earn <span className="font-extrabold">₦500</span> for every friend that joins and completes their first 5 drops.
          </p>
          <div className="mt-5 rounded-2xl bg-white/40 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Goal: 10 Referrals</span>
              <span className="font-mono">{data?.totalReferrals || 0} / 10</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-charcoal/10">
              <div className="h-full rounded-full bg-charcoal" style={{ width: `${Math.min((data?.totalReferrals || 0) * 10, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4">Your referrals</h3>
          <p className="text-sm text-textgray">People who joined Recovang through you</p>
        </div>
        <div className="tbl-container">
          <table className="tbl">
            <thead><tr><th>Friend</th><th>Joined</th><th>Drops</th><th className="text-right">You earned</th><th>Status</th></tr></thead>
            <tbody>
              {friends.map((r: any) => (
                <tr key={r.id}>
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
              {friends.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-textgray">
                    <Users size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No referrals yet. Share your link to start earning!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
