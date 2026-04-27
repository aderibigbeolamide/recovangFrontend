import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, ReceiptText, Smartphone, Wallet as WalletIcon, Zap } from "lucide-react";
import { useState } from "react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { Sparkline } from "@/components/charts";
import { formatNaira } from "@/lib/cn";
import { Coins, TrendingUp } from "lucide-react";

const TX = [
  { id: "TX-9281", type: "in", label: "PET drop · Surulere Hub", date: "Apr 24, 10:42", amt: 840, status: "completed" },
  { id: "TX-9275", type: "out", label: "Withdraw to GTBank ****8821", date: "Apr 23, 18:02", amt: -10000, status: "completed" },
  { id: "TX-9272", type: "out", label: "MTN airtime ·  ****1129", date: "Apr 23, 14:55", amt: -1000, status: "completed" },
  { id: "TX-9268", type: "in", label: "Cardboard drop · Surulere Hub", date: "Apr 22, 14:18", amt: 480, status: "completed" },
  { id: "TX-9261", type: "in", label: "Streak bonus · 14 days", date: "Apr 22, 09:00", amt: 500, status: "completed" },
  { id: "TX-9255", type: "out", label: "Eko Disco bill payment", date: "Apr 20, 19:30", amt: -3500, status: "completed" },
  { id: "TX-9248", type: "in", label: "Aluminium drop · Yaba Centre", date: "Apr 19, 09:08", amt: 660, status: "completed" },
];

export default function CollectorWallet() {
  const [hide, setHide] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Your Recovang wallet"
        subtitle="Hold, withdraw, top up airtime, pay bills — all from one balance."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card-dark p-7 lg:col-span-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Available balance</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-4xl font-extrabold text-white sm:text-5xl">
                  <span className="text-accent">₦</span>{hide ? "•••••" : "48,750"}
                </div>
                <button onClick={() => setHide(!hide)} className="text-white/50 hover:text-white">
                  {hide ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <div className="mt-1 text-xs text-white/60">≈ $32.50 USD</div>
            </div>
            <span className="badge bg-success/15 text-success">+ ₦12,400 this week</span>
          </div>

          <div className="mt-6">
            <Sparkline data={[42, 41, 43, 44, 46, 45, 48]} height={48} stroke="#D4A017" fill="rgba(212,160,23,.2)" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <Link to="/collector/withdraw" className="rounded-xl bg-accent px-3 py-3 text-center font-bold text-charcoal hover:bg-accent-600">
              <ArrowUp size={14} className="mx-auto mb-0.5" />Withdraw
            </Link>
            <Link to="/collector/submit" className="rounded-xl bg-white/10 px-3 py-3 text-center font-bold text-white hover:bg-white/15">
              <Plus size={14} className="mx-auto mb-0.5" />Add funds
            </Link>
            <Link to="/collector/withdraw" className="rounded-xl bg-white/10 px-3 py-3 text-center font-bold text-white hover:bg-white/15">
              <Zap size={14} className="mx-auto mb-0.5" />Airtime
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2">
          <KPICard label="Lifetime earned" value="₦312,400" sub="Since Aug 2024" icon={Coins} variant="gold" />
          <KPICard label="This month" value="₦42,180" sub="+ 28% vs last mo" icon={TrendingUp} trend={{ value: "+28%", direction: "up" }} />
          <KPICard label="Total withdrawn" value="₦263,650" sub="Across 41 payouts" icon={ArrowUp} />
          <KPICard label="Avg. per drop" value="₦6,646" sub="₦1,430 / kg avg" icon={WalletIcon} variant="primary" />
        </div>
      </div>

      {/* Linked accounts + Quick top-up */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-h4">Linked accounts</h3>
            <button className="btn-outline btn-sm"><Plus size={12} /> Add</button>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { bank: "GTBank", acct: "****8821", name: "Adaeze Nwosu", default: true, color: "bg-orange-500" },
              { bank: "Opay", acct: "****1129", name: "Adaeze Nwosu", default: false, color: "bg-emerald-500" },
            ].map((a) => (
              <div key={a.acct} className="flex items-center gap-4 rounded-2xl border border-bordergray bg-cream p-4">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${a.color} text-white font-extrabold`}>
                  {a.bank[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{a.bank} <span className="font-mono text-textgray">{a.acct}</span></div>
                  <div className="text-[11px] text-textgray">{a.name}</div>
                </div>
                {a.default && <span className="badge-mint">Default</span>}
                <button className="btn-ghost btn-sm">Manage</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-gold p-6 lg:col-span-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal/70">Recovang debit card</div>
          <div className="mt-3 rounded-2xl bg-charcoal p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Recovang · Verve</div>
              <ReceiptText size={16} className="text-accent" />
            </div>
            <div className="mt-12 font-mono text-lg tracking-widest">5021 •••• •••• 4297</div>
            <div className="mt-3 flex justify-between text-[10px] uppercase">
              <span className="text-white/60">Adaeze Nwosu</span>
              <span className="text-white/60">12 / 28</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-charcoal/80">Spend your wallet directly at any POS. Apply free, ships in 5 working days.</p>
          <button className="btn-dark btn-sm mt-3">Activate physical card</button>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Recent transactions</h3>
            <p className="text-sm text-textgray">All movements on your wallet</p>
          </div>
          <Link to="/collector/history" className="text-sm font-bold text-primary">View all</Link>
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Description</th><th>Date</th><th className="text-right">Amount</th><th>Status</th></tr></thead>
          <tbody>
            {TX.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-xs text-textgray">{t.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-xl ${t.type === "in" ? "bg-success-50 text-success" : "bg-warning-50 text-warning"}`}>
                      {t.type === "in" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                    </div>
                    <span className="font-bold">{t.label}</span>
                  </div>
                </td>
                <td className="text-textgray">{t.date}</td>
                <td className="text-right">
                  <span className={`money ${t.amt > 0 ? "text-success" : "text-error"}`}>
                    {t.amt > 0 ? "+" : ""}{formatNaira(t.amt)}
                  </span>
                </td>
                <td><StatusPill status="success" label={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
