import { useState } from "react";
import { Building2, Camera, Globe2, Mail, MapPin, Phone, Save } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useAuth } from "@/store/auth";

export default function FactoryProfile() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company: user?.company ?? "Indorama PET Recyclers",
    rcNumber: "RC 88247-2018",
    capacity: "120,000 kg / month",
    materials: "PET, HDPE, Aluminium, Cardboard",
    address: "Onne Industrial Park, Rivers State",
    phone: user?.phone ?? "+234 803 555 0155",
    email: user?.email ?? "tunde@indorama.ng",
    website: "https://indorama.ng",
    primaryContact: user?.name ?? "Tunde Bakare",
  });

  function save() {
    updateUser({ company: form.company, name: form.primaryContact, phone: form.phone, email: form.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <>
      <PageHeader
        eyebrow="Factory portal"
        title="Partner profile"
        subtitle="Plant details, processing capacity and the materials you accept."
        actions={<button onClick={save} className="btn-primary"><Save size={14} /> {saved ? "Saved!" : "Save profile"}</button>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Company logo</div>
          <div className="mt-4 grid h-44 w-full place-items-center rounded-2xl border-2 border-dashed border-bordergray bg-cream/60">
            <div className="flex flex-col items-center gap-2 text-textgray">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-primary"><Building2 size={20} /></div>
              <div className="text-xs font-bold">Drop SVG/PNG here</div>
              <div className="text-[10px] uppercase tracking-wider">512×512 recommended</div>
            </div>
          </div>
          <button className="btn-outline mt-4 w-full"><Camera size={14} /> Upload logo</button>
        </div>

        <div className="card p-6 lg:col-span-8">
          <h3 className="text-h4">Plant details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Company name" icon={Building2}><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
            <Field label="RC number"><input className="input" value={form.rcNumber} onChange={(e) => setForm({ ...form, rcNumber: e.target.value })} /></Field>
            <Field label="Processing capacity"><input className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></Field>
            <Field label="Materials accepted"><input className="input" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} /></Field>
            <Field label="Plant address" icon={MapPin}><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Website" icon={Globe2}><input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
            <Field label="Primary contact"><input className="input" value={form.primaryContact} onChange={(e) => setForm({ ...form, primaryContact: e.target.value })} /></Field>
            <Field label="Email" icon={Mail}><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone" icon={Phone}><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
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
