import { useState } from "react";
import { ArrowRight, Clock, MapPin, Navigation, Phone, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";

const HUBS = [
  { id: "h1", name: "Surulere Flagship Hub", area: "12 Bode Thomas, Surulere", city: "Lagos", dist: "0.4 km", open: "7am – 7pm", phone: "+234 803 555 0182", rating: 4.9, today: 184, capacity: 78, agent: "Bola A.", busy: "low" },
  { id: "h2", name: "Yaba Tech Hub", area: "Herbert Macaulay Way", city: "Lagos", dist: "1.2 km", open: "7am – 7pm", phone: "+234 803 555 0211", rating: 4.8, today: 142, capacity: 64, agent: "Tope D.", busy: "medium" },
  { id: "h3", name: "Lekki Phase 1 Hub", area: "Admiralty Way, Lekki", city: "Lagos", dist: "8.6 km", open: "7am – 8pm", phone: "+234 803 555 0344", rating: 4.7, today: 220, capacity: 89, agent: "Folake A.", busy: "high" },
  { id: "h4", name: "Wuse Market Hub", area: "Adetokunbo Ademola, Wuse 2", city: "Abuja", dist: "—", open: "7am – 7pm", phone: "+234 803 555 0455", rating: 4.6, today: 96, capacity: 41, agent: "Ibrahim K.", busy: "low" },
  { id: "h5", name: "GRA Port Harcourt Hub", area: "Old Aba Road, GRA Phase 2", city: "Port Harcourt", dist: "—", open: "7am – 7pm", phone: "+234 803 555 0566", rating: 4.8, today: 128, capacity: 58, agent: "Chika E.", busy: "medium" },
  { id: "h6", name: "Karu Roundabout Hub", area: "Karu Roundabout, Nyanya", city: "Abuja", dist: "—", open: "8am – 6pm", phone: "+234 803 555 0677", rating: 4.5, today: 64, capacity: 32, agent: "Aisha B.", busy: "low" },
];

const busyMap: Record<string, { c: string; l: string }> = {
  low: { c: "bg-success-50 text-success", l: "Low queue" },
  medium: { c: "bg-warning-50 text-warning", l: "Some queue" },
  high: { c: "bg-error-50 text-error", l: "Busy now" },
};

export default function FindHub() {
  const [city, setCity] = useState("Lagos");
  const [active, setActive] = useState(HUBS[0].id);
  const filtered = HUBS.filter((h) => h.city === city);
  const selected = HUBS.find((h) => h.id === active) ?? filtered[0];

  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-12 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="left-[-10%] top-[-10%] h-[400px] w-[400px]" color="from-primary/30 to-primary/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Find a hub near you</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            412 hubs. <br /><span className="text-primary">9 cities.</span> Walk to the nearest one.
          </h1>
          <p className="mt-6 text-lg text-textgray">
            Most Lagos collectors are within a 7-minute walk of a Recovang hub. See live capacity, opening hours and the agent on duty before you go.
          </p>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-page">
          <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
              <input className="input pl-10" placeholder="Enter your area, street or landmark" />
            </div>
            <div className="flex gap-2">
              {["Lagos", "Abuja", "Port Harcourt"].map((c) => (
                <button key={c} onClick={() => setCity(c)} className={`chip ${city === c ? "chip-active" : ""}`}>{c}</button>
              ))}
            </div>
            <button className="btn-primary"><Navigation size={14} /> Use my location</button>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* List */}
            <div className="space-y-3 lg:col-span-5">
              {filtered.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActive(h.id)}
                  className={`w-full text-left card p-5 transition hover:shadow-card ${active === h.id ? "border-primary ring-4 ring-primary/10" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold">{h.name}</h3>
                        <span className={`badge ${busyMap[h.busy].c}`}>{busyMap[h.busy].l}</span>
                      </div>
                      <div className="mt-1 text-sm text-textgray">{h.area}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-textgray">
                        <span className="flex items-center gap-1"><Clock size={12} /> {h.open}</span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-accent" fill="currentColor" /> {h.rating}</span>
                        {h.dist !== "—" && <span className="font-bold text-charcoal">{h.dist} away</span>}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Map mock + details */}
            <div className="lg:col-span-7">
              <div className="card overflow-hidden">
                {/* Mock map */}
                <div className="relative h-72 bg-grad-mint">
                  <div className="absolute inset-0 bg-grid opacity-50" />
                  <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full">
                    <path d="M0 140 C 80 100, 160 200, 240 130 S 380 90, 400 140" stroke="#1A6B3C" strokeOpacity="0.2" strokeWidth="22" fill="none" />
                    <path d="M0 80 C 120 60, 200 150, 320 90 S 400 60, 400 60" stroke="#D4A017" strokeOpacity="0.15" strokeWidth="14" fill="none" />
                  </svg>
                  {filtered.map((h, i) => (
                    <div
                      key={h.id}
                      onClick={() => setActive(h.id)}
                      className={`absolute cursor-pointer transition ${active === h.id ? "scale-125 z-10" : "scale-100"}`}
                      style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 18}%` }}
                    >
                      <div className="relative">
                        <div className={`grid h-9 w-9 place-items-center rounded-full text-white shadow-lift ${active === h.id ? "bg-accent text-charcoal" : "bg-primary"}`}>
                          <MapPin size={16} />
                        </div>
                        {active === h.id && (
                          <div className="absolute -inset-2 rounded-full bg-accent/30 animate-pulseRing" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Selected details */}
                <div className="border-t border-bordergray p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Selected hub</div>
                      <h3 className="mt-1 text-h3">{selected.name}</h3>
                      <p className="mt-1 text-sm text-textgray">{selected.area}, {selected.city}</p>
                    </div>
                    <span className={`badge ${busyMap[selected.busy].c}`}>{busyMap[selected.busy].l}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-cream p-4">
                      <div className="text-[10px] font-bold uppercase text-textgray">Today's drops</div>
                      <div className="mt-1 font-mono text-xl font-extrabold">{selected.today}</div>
                    </div>
                    <div className="rounded-2xl bg-cream p-4">
                      <div className="text-[10px] font-bold uppercase text-textgray">Capacity used</div>
                      <div className="mt-1 font-mono text-xl font-extrabold">{selected.capacity}%</div>
                    </div>
                    <div className="rounded-2xl bg-cream p-4">
                      <div className="text-[10px] font-bold uppercase text-textgray">Agent on duty</div>
                      <div className="mt-1 text-sm font-extrabold">{selected.agent}</div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to="/auth/register" className="btn-primary"><Navigation size={14} /> Get directions</Link>
                    <a href={`tel:${selected.phone}`} className="btn-outline"><Phone size={14} /> Call hub</a>
                    <Link to="/how-it-works" className="btn-ghost">How drop works <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
