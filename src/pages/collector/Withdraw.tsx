import { useState } from "react";
import { Banknote, Phone, Wifi, Zap, Tv, Receipt, ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const METHODS = [
  { id: "bank", label: "Bank transfer", icon: <Banknote size={18} />, fee: "Free · arrives in seconds" },
  { id: "airtime", label: "Buy airtime", icon: <Phone size={18} />, fee: "MTN · Glo · Airtel · 9mobile" },
  { id: "data", label: "Buy data", icon: <Wifi size={18} />, fee: "All networks · all bundles" },
  { id: "elec", label: "Electricity", icon: <Zap size={18} />, fee: "IBEDC · EKEDC · AEDC · all DisCos" },
  { id: "tv", label: "TV / Cable", icon: <Tv size={18} />, fee: "DSTV · GoTV · Startimes" },
  { id: "bills", label: "Other bills", icon: <Receipt size={18} />, fee: "Water · LASRRA · LIRS" },
];

export default function CollectorWithdraw() {
  const [m, setM] = useState("bank");
  const [amount, setAmount] = useState(20000);
  return (
    <>
      <PageHeader
        title="Withdraw your earnings"
        subtitle="Cash out to bank, top up your phone, or pay any bill — no fees, no limits."
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title="Choose method">
          <div className="grid gap-3 sm:grid-cols-2">
            {METHODS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setM(opt.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  m === opt.id ? "border-primary bg-mint" : "border-bordergray hover:border-primary/40"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-primary">
                  {opt.icon}
                </div>
                <div>
                  <div className="font-display font-bold">{opt.label}</div>
                  <div className="text-xs text-textgray">{opt.fee}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {m === "bank" && (
              <>
                <Field label="Bank">
                  <select className="input">
                    {["GTBank", "Access Bank", "UBA", "Zenith", "Opay", "Kuda", "Palmpay"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Account number">
                  <input className="input font-mono" placeholder="0123456789" />
                </Field>
              </>
            )}
            {(m === "airtime" || m === "data") && (
              <>
                <Field label="Network">
                  <select className="input">
                    <option>MTN</option>
                    <option>Glo</option>
                    <option>Airtel</option>
                    <option>9mobile</option>
                  </select>
                </Field>
                <Field label="Phone number">
                  <input className="input font-mono" defaultValue="0801 234 5678" />
                </Field>
              </>
            )}
            {(m === "elec" || m === "tv" || m === "bills") && (
              <>
                <Field label="Provider">
                  <select className="input">
                    <option>IBEDC</option>
                    <option>EKEDC</option>
                    <option>DSTV</option>
                    <option>GoTV</option>
                  </select>
                </Field>
                <Field label="Account / smartcard #">
                  <input className="input font-mono" placeholder="0123456789" />
                </Field>
              </>
            )}
            <Field label="Amount (₦)">
              <input
                className="input font-mono"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              />
            </Field>
            <Field label="PIN">
              <input className="input font-mono" type="password" placeholder="••••" />
            </Field>
          </div>
        </Section>

        <aside>
          <div className="sticky top-24 card">
            <p className="text-xs uppercase tracking-wider text-textgray">Available balance</p>
            <p className="font-mono text-3xl font-extrabold text-charcoal">{formatNaira(48750)}</p>
            <div className="divider" />
            <div className="space-y-2 text-sm">
              <Row label="Withdrawing" value={formatNaira(amount)} />
              <Row label="Fee" value="₦0" />
              <Row label="You'll receive" value={formatNaira(amount)} bold />
            </div>
            <button className="btn-primary mt-5 w-full">
              Confirm withdrawal <ArrowRight size={16} />
            </button>
            <p className="mt-2 text-center text-xs text-textgray">
              Funds settle in seconds. SMS receipt sent.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-textgray">{label}</span>
      <span className={`font-mono ${bold ? "text-lg font-bold text-success" : "font-semibold"}`}>{value}</span>
    </div>
  );
}
