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

import { useAgentHub } from "@/hooks/useAgent";

export default function AgentLocation() {
  const { data: hub, isLoading } = useAgentHub();

  if (isLoading) return <div className="p-20 text-center font-bold">Loading location details...</div>;
  if (!hub) return <div className="p-20 text-center">Hub not found.</div>;
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
            <div className="relative h-72 bg-cream">
              {hub.lat && hub.lng ? (
                <iframe
                  title="Hub Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${hub.lat},${hub.lng}&z=15&output=embed`}
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <iframe
                  title="Hub Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(hub.address + ", " + hub.state)}&z=15&output=embed`}
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
              )}
              
              <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-soft border border-bordergray">
                <MapPin size={11} className="mr-1 inline text-primary" /> {hub.lat || "6.5744"}° N · {hub.lng || "3.3615"}° E
              </div>
              <button className="absolute bottom-3 right-3 btn-outline btn-sm bg-white">
                <Navigation size={12} /> View in Google Maps
              </button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Street address" value={hub.address} />
              <Field label="Landmark" value={hub.landmark || "N/A"} />
              <Field label="Area / LGA" value={hub.lga} />
              <Field label="City" value={hub.city || "Lagos"} />
              <Field label="State" value={hub.state} />
              <Field label="Postal code" value={hub.postalCode || ""} />
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
              <Field label="Hub name" value={hub.name} />
              <Field label="Public phone" value={hub.phone || "+234 800 RECOVANG"} icon={Phone} />
              <Field label="WhatsApp" value={hub.whatsapp || hub.phone || ""} />
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[110px] py-3 leading-relaxed" defaultValue={hub.description || `Recovang flagship ${hub.name} hub. Calibrated digital scales, instant wallet payouts, friendly staff.`} />
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
            <h4 className="mt-2 text-h4 text-white">{hub.name}</h4>
            <p className="mt-1 text-sm text-white/70">{hub.address} · {hub.lat}, {hub.lng}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-success/15 px-3 py-1 font-bold text-success">Low queue</span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white">★ 4.9</span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white"><Clock size={11} className="inline" /> {hub.openTime}</span>
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
