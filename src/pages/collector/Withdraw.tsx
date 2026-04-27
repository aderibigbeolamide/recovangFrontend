import { useState } from "react";
import { ArrowRight, Banknote, Check, Lightbulb, Phone, Plus, Smartphone, Tv, Wifi, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const METHODS = [
  { id: "bank", icon: Banknote, label: "Bank transfer", sub: "Free · Instant" },
  { id: "airtime", icon: Phone, label: "Airtime", sub: "Free · MTN, Airtel, Glo, 9mobile" },
  { id: "data", icon: Wifi, label: "Data bundle", sub: "Up to 12% bonus" },
  { id: "bills", icon: Lightbulb, label: "Bill payment", sub: "PHCN · DSTV · Water" },
];

const PRESETS = [1000, 2500, 5000, 10000, 25000];

export default function CollectorWithdraw() {
  const [method, setMethod] = useState("bank");
  const [amount, setAmount] = useState(10000);
  const balance = 48750;

  return (
    <>
      <PageHeader eyebrow="Withdraw" title="Cash out your earnings" subtitle="Move money to your bank, top up airtime, buy data or pay bills." />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="card p-6">
            <h3 className="text-h4">Withdraw to</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    method === m.id ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/40"
                  }`}
                >
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${method === m.id ? "bg-grad-primary text-white" : "bg-cream text-charcoal/70"}`}>
                    <m.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold">{m.label}</div>
                    <div className="text-[11px] text-textgray">{m.sub}</div>
                  </div>
                  {method === m.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {method === "bank" && (
            <div className="card p-6">
              <h3 className="text-h4">Pick account</h3>
              <div className="mt-4 space-y-2">
                {[
                  { bank: "GTBank", acct: "0123 4567 8821", color: "bg-orange-500", default: true },
                  { bank: "Opay", acct: "8160 4789 1129", color: "bg-emerald-500" },
                ].map((a) => (
                  <label key={a.acct} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-bordergray bg-white p-4 has-[:checked]:border-primary has-[:checked]:bg-mint/40">
                    <input type="radio" name="acct" defaultChecked={a.default} className="accent-primary" />
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.color} text-white font-extrabold`}>{a.bank[0]}</div>
                    <div className="flex-1">
                      <div className="font-extrabold">{a.bank}</div>
                      <div className="font-mono text-xs text-textgray">{a.acct}</div>
                    </div>
                    {a.default && <span className="badge-mint">Default</span>}
                  </label>
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-bordergray p-4 text-sm font-bold text-textgray hover:border-primary hover:text-primary">
                  <Plus size={14} /> Add new bank account
                </button>
              </div>
            </div>
          )}

          {(method === "airtime" || method === "data") && (
            <div className="card p-6">
              <h3 className="text-h4">Network</h3>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { n: "MTN", c: "bg-yellow-400 text-charcoal" },
                  { n: "Airtel", c: "bg-red-500 text-white" },
                  { n: "Glo", c: "bg-green-500 text-white" },
                  { n: "9mobile", c: "bg-emerald-700 text-white" },
                ].map((n, i) => (
                  <button key={n.n} className={`rounded-2xl border-2 p-3 ${i === 0 ? "border-primary" : "border-transparent"}`}>
                    <div className={`mx-auto grid h-12 w-12 place-items-center rounded-xl ${n.c} font-extrabold`}>{n.n[0]}</div>
                    <div className="mt-2 text-xs font-bold">{n.n}</div>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <label className="label">Phone number</label>
                <input className="input" defaultValue="+234 803 555 0182" />
              </div>
            </div>
          )}

          {method === "bills" && (
            <div className="card p-6">
              <h3 className="text-h4">Pick a biller</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { n: "Eko Disco", icon: Lightbulb, sub: "Lagos electricity" },
                  { n: "Ikeja Disco", icon: Zap, sub: "Lagos electricity" },
                  { n: "DSTV", icon: Tv, sub: "TV subscription" },
                  { n: "GOtv", icon: Tv, sub: "TV subscription" },
                ].map((b, i) => (
                  <label key={b.n} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-bordergray bg-white p-4 has-[:checked]:border-primary has-[:checked]:bg-mint/40">
                    <input type="radio" name="bill" defaultChecked={i === 0} className="accent-primary" />
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><b.icon size={16} className="text-primary" /></div>
                    <div className="flex-1">
                      <div className="text-sm font-extrabold">{b.n}</div>
                      <div className="text-[11px] text-textgray">{b.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h3 className="text-h4">Amount</h3>
            <div className="mt-4 flex items-center rounded-2xl border border-bordergray bg-cream px-5 py-4">
              <span className="font-mono text-2xl font-extrabold text-textgray">₦</span>
              <input
                value={amount.toLocaleString("en-NG")}
                onChange={(e) => setAmount(parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                className="w-full bg-transparent pl-2 font-mono text-3xl font-extrabold focus:outline-none"
              />
              <button onClick={() => setAmount(balance)} className="text-xs font-bold text-primary">MAX</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => setAmount(p)} className={`chip ${amount === p ? "chip-active" : ""}`}>
                  {formatNaira(p)}
                </button>
              ))}
            </div>
            <div className="help mt-3">Available balance: <span className="font-mono font-bold text-charcoal">{formatNaira(balance)}</span></div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="card-dark sticky top-24 p-7">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">You're sending</div>
            <div className="mt-2 font-mono text-4xl font-extrabold text-white">
              <span className="text-accent">₦</span>{amount.toLocaleString("en-NG")}
            </div>
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <Row k="Method" v={METHODS.find((m) => m.id === method)?.label ?? ""} />
              <Row k="Fee" v="₦0.00" />
              <Row k="Arrival" v="Within 30 seconds" />
              <Row k="Reference" v="WD-2026-04-3219" mono />
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="font-extrabold text-white">Total debit</span>
                <span className="font-mono text-lg font-extrabold text-accent">{formatNaira(amount)}</span>
              </div>
            </div>
            <button className="btn-gold btn-lg mt-6 w-full">Confirm withdrawal <ArrowRight size={16} /></button>
            <p className="mt-3 text-center text-[11px] text-white/60">By continuing, you authorise Recovang to debit your wallet.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/70">{k}</span>
      <span className={`font-bold text-white ${mono ? "font-mono text-xs" : ""}`}>{v}</span>
    </div>
  );
}
