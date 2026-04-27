import { Banknote, Building2, Check, FileText, Mail, MapPin, Phone, Save, Shield, ShieldCheck, Star, Truck, Upload, User, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const DOCS = [
  { name: "Operating licence", expiry: "Expires Jan 2027", verified: true },
  { name: "Comprehensive insurance", expiry: "Expires Aug 2026", verified: true },
  { name: "Hazardous goods permit", expiry: "Expires Mar 2027", verified: true },
  { name: "Tax clearance", expiry: "Pending renewal", verified: false },
];

export default function LogisticsProfile() {
  return (
    <>
      <PageHeader
        eyebrow="Profile & settings"
        title="GreenWheels Nigeria Ltd."
        subtitle="Operator profile, drivers, payouts and compliance — your control panel as a Recovang logistics partner."
        actions={<button className="btn-primary"><Save size={14} /> Save changes</button>}
      />

      {/* Hero */}
      <div className="card-dark relative overflow-hidden p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-grad-mint opacity-10" />
        <div className="relative grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="badge-gold inline-flex items-center gap-1"><ShieldCheck size={11} /> Tier-1 verified partner</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold text-white">GreenWheels Nigeria</h2>
            <p className="mt-2 text-white/70">Lagos-based fleet operator. Partner since Aug 2024. Specialising in inter-hub material movement.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "4.9", l: "Rating", icon: Star },
                { v: "8", l: "Vehicles", icon: Truck },
                { v: "12", l: "Drivers", icon: Users },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <s.icon size={14} className="text-accent" />
                  <div className="mt-2 font-mono text-2xl font-extrabold text-white">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Lifetime stats</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-white/80"><span>Total trips</span><span className="font-mono font-extrabold text-white">2,418</span></div>
                <div className="flex justify-between text-white/80"><span>Tonnage moved</span><span className="font-mono font-extrabold text-white">5,820 t</span></div>
                <div className="flex justify-between text-white/80"><span>Lifetime payouts</span><span className="font-mono font-extrabold text-accent">{formatNaira(48400000)}</span></div>
                <div className="flex justify-between text-white/80"><span>On-time rate</span><span className="font-mono font-extrabold text-white">96%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Company info */}
        <div className="card p-6 lg:col-span-7">
          <h3 className="text-h4">Company information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Legal name" value="GreenWheels Nigeria Ltd." />
            <Field label="RC number" value="RC 1948-2204" />
            <Field label="Tax ID" value="00482-019-2014" />
            <Field label="Year founded" value="2018" />
            <Field label="Phone" value="+234 803 555 0211" icon={Phone} />
            <Field label="Email" value="ops@greenwheels.ng" icon={Mail} />
            <Field label="HQ address" value="14 Kudirat Abiola Way, Oregun" icon={MapPin} />
            <Field label="State" value="Lagos State" />
          </div>
        </div>

        {/* Bank + admin contact */}
        <div className="space-y-4 lg:col-span-5">
          <div className="card-gold p-6">
            <Banknote size={22} className="text-charcoal" />
            <h4 className="mt-3 text-h4 text-charcoal">Payout account</h4>
            <p className="text-xs text-charcoal/70">Pickup fees settle weekly to this account.</p>
            <div className="mt-4 rounded-2xl bg-white/40 p-4">
              <div className="font-mono text-xs text-charcoal/70">First Bank · 0123 4567 821</div>
              <div className="mt-1 font-extrabold text-charcoal">GreenWheels Nigeria Ltd</div>
            </div>
            <button className="btn-dark btn-sm mt-3">Update payout details</button>
          </div>

          <div className="card p-6">
            <h4 className="text-h4">Primary contact</h4>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name="Tunde Bakare" size={48} />
              <div className="flex-1">
                <div className="font-extrabold">Tunde Bakare</div>
                <div className="text-xs text-textgray">CEO & Operations Lead</div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-textgray"><Phone size={13} className="text-primary" /> +234 803 555 0211</div>
              <div className="flex items-center gap-2 text-textgray"><Mail size={13} className="text-primary" /> tunde@greenwheels.ng</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-bordergray p-6">
          <h3 className="text-h4 flex items-center gap-2"><Shield size={18} className="text-primary" /> Compliance documents</h3>
          <p className="text-sm text-textgray">Recovang automatically reminds you 30 days before any document expires.</p>
        </div>
        <table className="tbl">
          <thead><tr><th>Document</th><th>Status</th><th>Validity</th><th></th></tr></thead>
          <tbody>
            {DOCS.map((d) => (
              <tr key={d.name}>
                <td className="font-bold">
                  <FileText size={14} className="mr-2 inline text-primary" />
                  {d.name}
                </td>
                <td>
                  {d.verified ? <span className="badge-success inline-flex items-center gap-1"><Check size={11} /> Verified</span> : <span className="badge bg-warning-50 text-warning">Action required</span>}
                </td>
                <td className="text-textgray">{d.expiry}</td>
                <td className="text-right"><button className="btn-outline btn-sm"><Upload size={11} /> Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />}
        <input defaultValue={value} className={`input ${Icon ? "pl-10" : ""}`} />
      </div>
    </div>
  );
}
