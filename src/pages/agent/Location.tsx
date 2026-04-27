import { Building2, Camera, Check, Clock, Edit3, Globe, MapPin, Navigation, Phone, Save, Star, Wifi } from "lucide-react";
import { PageHeader } from "@/components/ui";

const HOURS = [
  { d: "Monday", o: "07:00", c: "19:00" },
  { d: "Tuesday", o: "07:00", c: "19:00" },
  { d: "Wednesday", o: "07:00", c: "19:00" },
  { d: "Thursday", o: "07:00", c: "19:00" },
  { d: "Friday", o: "07:00", c: "19:00" },
  { d: "Saturday", o: "08:00", c: "16:00" },
  { d: "Sunday", o: "Closed", c: "Closed" },
];

export default function AgentLocation() {
  return (
    <>
      <PageHeader
        eyebrow="Location & details"
        title="How collectors find you"
        subtitle="Public hub profile shown on the Find a Hub page. Keep it accurate so collectors don't show up to a closed door."
        actions={<button className="btn-primary"><Save size={14} /> Save changes</button>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Map preview */}
        <div className="lg:col-span-7">
          <div className="card overflow-hidden">
            <div className="relative h-72 bg-grad-mint">
              <div className="absolute inset-0 bg-grid opacity-50" />
              <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full">
                <path d="M0 140 C 80 100, 160 200, 240 130 S 380 90, 400 140" stroke="#1A6B3C" strokeOpacity="0.2" strokeWidth="22" fill="none" />
                <path d="M0 80 C 120 60, 200 150, 320 90 S 400 60, 400 60" stroke="#D4A017" strokeOpacity="0.15" strokeWidth="14" fill="none" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-charcoal shadow-lift">
                    <Building2 size={20} />
                  </div>
                  <div className="absolute -inset-3 animate-pulseRing rounded-full bg-accent/30" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-soft">
                <MapPin size={11} className="mr-1 inline text-primary" /> 6.4969° N · 3.3489° E
              </div>
              <button className="absolute bottom-3 right-3 btn-outline btn-sm bg-white">
                <Navigation size={12} /> Recenter
              </button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Street address" value="12 Bode Thomas Street" />
              <Field label="Landmark" value="Opposite Methodist Cathedral" />
              <Field label="Area / LGA" value="Surulere" />
              <Field label="City" value="Lagos" />
              <Field label="State" value="Lagos State" />
              <Field label="Postal code" value="101283" />
            </div>
          </div>

          {/* Photos */}
          <div className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-h4">Hub photos</h3>
                <p className="text-sm text-textgray">First photo is the hero shown to collectors.</p>
              </div>
              <button className="btn-outline btn-sm"><Camera size={12} /> Upload</button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-grad-mint">
                  <div className="absolute inset-0 grid place-items-center">
                    <Camera size={22} className="text-primary/60" />
                  </div>
                  {i === 0 && <span className="absolute left-2 top-2 badge-gold">Hero</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile + Hours */}
        <div className="space-y-6 lg:col-span-5">
          <div className="card p-6">
            <h3 className="text-h4">Public profile</h3>
            <div className="mt-4 space-y-4">
              <Field label="Hub name" value="Surulere Flagship Hub" />
              <Field label="Public phone" value="+234 803 555 0182" icon={Phone} />
              <Field label="WhatsApp" value="+234 803 555 0182" />
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[110px] py-3 leading-relaxed" defaultValue="Recovang's flagship Surulere hub. Calibrated digital scales, instant wallet payouts, friendly staff. Walk-ins welcome 7 days a week." />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-h4">Opening hours</h3>
            <p className="text-sm text-textgray">Shown on the public hub page.</p>
            <div className="mt-4 space-y-2">
              {HOURS.map((h) => (
                <div key={h.d} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
                  <div className="w-24 text-sm font-extrabold">{h.d}</div>
                  <div className="flex-1 text-sm font-mono text-charcoal">{h.o === "Closed" ? <span className="text-textgray">Closed</span> : <>{h.o} – {h.c}</>}</div>
                  <button className="btn-ghost btn-sm"><Edit3 size={11} /> Edit</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Public listing preview</div>
            <h4 className="mt-2 text-h4 text-white">Surulere Flagship Hub</h4>
            <p className="mt-1 text-sm text-white/70">12 Bode Thomas, Surulere · 0.4 km away</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-success/15 px-3 py-1 font-bold text-success">Low queue</span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white">★ 4.9</span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white"><Clock size={11} className="inline" /> 7am–7pm</span>
            </div>
          </div>
        </div>
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
