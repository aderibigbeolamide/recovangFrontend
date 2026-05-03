import { useState } from "react";
import { Building2, Camera, Globe2, Mail, MapPin, Phone, Save } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useAuth } from "@/store/auth";

export default function BrandProfile() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company: user?.company ?? "Coca-Cola Africa",
    rcNumber: "RC 1247-2204",
    sector: "Beverages — non-alcoholic",
    address: "1 Industrial Avenue, Ilupeju, Lagos",
    phone: user?.phone ?? "+234 802 555 0199",
    email: user?.email ?? "compliance@coca-cola.ng",
    website: "https://coca-cola.com/africa",
    primaryContact: user?.name ?? "Chioma Okeke",
    publicSlug: user?.company?.toLowerCase().replace(/\s+/g, '-') ?? "coca-cola",
  });

  function save() {
    updateUser({ company: form.company, name: form.primaryContact, phone: form.phone, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <>
      <PageHeader
        eyebrow="Brand portal"
        title="Brand profile"
        subtitle="Company details, primary contact and logo. We use these on every certificate."
        actions={<button onClick={save} className="btn-primary"><Save size={14} /> {saved ? "Saved!" : "Save profile"}</button>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Brand logo</div>
          <div className="mt-4 grid h-44 w-full place-items-center rounded-2xl border-2 border-dashed border-bordergray bg-cream/60">
            <div className="flex flex-col items-center gap-2 text-textgray">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-primary"><Building2 size={20} /></div>
              <div className="text-xs font-bold">Drop SVG/PNG here</div>
              <div className="text-[10px] uppercase tracking-wider">512×512 recommended</div>
            </div>
          </div>
          <button className="btn-outline mt-4 w-full"><Camera size={14} /> Upload logo</button>

          <div className="mt-8 border-t border-bordergray pt-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Consumer Impact QR</div>
            <div className="mt-4 rounded-3xl bg-white border border-bordergray p-6 text-center">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${window.location.origin}/impact/${form.publicSlug}`} 
                    alt="Impact QR"
                    className="mx-auto h-40 w-40 rounded-xl"
                />
                <p className="mt-4 text-[10px] font-bold text-textgray uppercase tracking-widest">Scan to verify impact</p>
                <button 
                  onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${window.location.origin}/impact/${form.publicSlug}`)}
                  className="btn-ghost btn-sm mt-3 w-full text-primary"
                >
                  Download HQ Print QR
                </button>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-textgray italic">
                Print this QR code on your product labels to let consumers verify your sustainability impact in real-time.
            </p>
          </div>
        </div>

        <div className="card p-6 lg:col-span-8">
          <h3 className="text-h4">Company details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Company name" icon={Building2}><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
            <Field label="RC number"><input className="input" value={form.rcNumber} onChange={(e) => setForm({ ...form, rcNumber: e.target.value })} /></Field>
            <Field label="Sector"><input className="input" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} /></Field>
            <Field label="Website" icon={Globe2}><input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
            <Field label="HQ address" icon={MapPin}><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Compliance email" icon={Mail}><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Primary contact"><input className="input" value={form.primaryContact} onChange={(e) => setForm({ ...form, primaryContact: e.target.value })} /></Field>
            <Field label="Phone" icon={Phone}><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Public impact URL"><div className="flex items-center gap-1.5 font-mono text-xs"><span className="text-textgray">/impact/</span><input className="input h-8 py-0" value={form.publicSlug} onChange={(e) => setForm({ ...form, publicSlug: e.target.value })} /></div></Field>
          </div>
          {saved && <div className="mt-4 rounded-xl bg-success-50 px-4 py-2 text-sm font-bold text-success">✓ Profile saved</div>}
        </div>
      </div>
    </>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />}
        <div className={Icon ? "[&_input]:pl-10" : ""}>{children}</div>
      </div>
    </div>
  );
}
