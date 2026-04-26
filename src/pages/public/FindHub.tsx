import { MapPin, Search, Phone, Clock, ArrowRight } from "lucide-react";

const HUBS = [
  { name: "Surulere Hub", address: "12 Bode Thomas, Surulere", city: "Lagos", phone: "0801 234 5678", hours: "8am – 7pm", distance: "1.2 km", capacity: 68 },
  { name: "Yaba Recovery Centre", address: "Herbert Macaulay Way, Yaba", city: "Lagos", phone: "0802 345 6789", hours: "8am – 8pm", distance: "3.7 km", capacity: 45 },
  { name: "Lekki Phase 1 Hub", address: "Admiralty Road, Lekki", city: "Lagos", phone: "0803 456 7890", hours: "9am – 6pm", distance: "8.4 km", capacity: 82 },
  { name: "Ikorodu Garage Hub", address: "Sabo Road, Ikorodu", city: "Lagos", phone: "0804 567 8901", hours: "7am – 7pm", distance: "12.1 km", capacity: 30 },
  { name: "Wuse Zone 5 Hub", address: "Cadastral Zone B05, Wuse", city: "Abuja", phone: "0805 678 9012", hours: "8am – 7pm", distance: "—", capacity: 51 },
  { name: "Trans-Amadi Depot", address: "Trans-Amadi Industrial Layout", city: "Port Harcourt", phone: "0806 789 0123", hours: "8am – 6pm", distance: "—", capacity: 74 },
];

export default function FindHub() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge bg-mint text-primary">Hubs near you</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          Find your nearest Recovang hub.
        </h1>
        <p className="mt-4 text-textgray">
          412 verified hubs across Nigeria. Drop off any verified material — get paid the same hour.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-2xl border border-bordergray bg-white p-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
          <input
            className="input pl-9"
            placeholder="Enter your area, LGA or postcode..."
          />
        </div>
        <button className="btn-primary">Search</button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {HUBS.map((h) => (
            <div key={h.name} className="card transition-shadow hover:shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold">{h.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-textgray">
                    <MapPin size={14} /> {h.address}, {h.city}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-textgray">
                    <Clock size={14} /> {h.hours} · <Phone size={14} /> {h.phone}
                  </p>
                </div>
                <span className="badge bg-mint text-primary">
                  {h.distance !== "—" ? `${h.distance} away` : h.city}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-bordergray pt-4">
                <div>
                  <div className="mb-1 text-xs text-textgray">Hub capacity</div>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-bordergray">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${h.capacity}%` }}
                    />
                  </div>
                </div>
                <button className="btn-outline">
                  Get directions <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-24 hidden h-[640px] overflow-hidden rounded-2xl border border-bordergray bg-mint/40 lg:block">
          <div className="relative h-full w-full bg-[radial-gradient(circle_at_30%_40%,#1A6B3C22,transparent_60%),radial-gradient(circle_at_70%_60%,#D4A01722,transparent_60%)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-card">
                  <MapPin size={20} />
                </div>
                <p className="mt-3 font-display font-bold">Interactive map</p>
                <p className="mt-1 max-w-xs text-sm text-textgray">
                  Live hub map with capacity indicators and turn-by-turn directions appears once Maps integration is connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
