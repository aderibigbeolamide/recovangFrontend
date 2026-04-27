import { Link } from "react-router-dom";
import { ArrowRight, MapPin, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { CategoryIcon, Blob, GridOverlay } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const CATS = [
  { name: "PET Plastic", lagos: 200, abuja: 180, ph: 190, accept: ["Soft drink bottles", "Water sachets", "Juice bottles"], reject: ["Cooking oil bottles", "Caps still attached"], tip: "Crush bottles to fit more in your bag." },
  { name: "HDPE Plastic", lagos: 240, abuja: 220, ph: 230, accept: ["Detergent bottles", "Milk jugs", "Bleach containers"], reject: ["Coloured film", "Mixed plastic"], tip: "Rinse heavily soiled containers before drop." },
  { name: "Aluminium Cans", lagos: 600, abuja: 580, ph: 600, accept: ["Soft drink cans", "Beer cans", "Energy drink cans"], reject: ["Steel cans (use Metal)", "Aerosol cans"], tip: "Crushed cans = same money, half the bag space." },
  { name: "Mixed Paper", lagos: 60, abuja: 55, ph: 60, accept: ["Office paper", "Newspapers", "Magazines"], reject: ["Wet paper", "Glossy promotional flyers"], tip: "Keep paper bone dry. Wet paper loses 70% value." },
  { name: "Cardboard", lagos: 80, abuja: 75, ph: 80, accept: ["Boxes", "Cartons", "Packaging"], reject: ["Pizza boxes with grease", "Wax-coated"], tip: "Flatten boxes before drop — saves the agent time." },
  { name: "Glass Bottles", lagos: 30, abuja: 28, ph: 30, accept: ["Beer bottles", "Wine bottles", "Spirit bottles"], reject: ["Broken glass", "Window glass", "Mirrors"], tip: "We pay by colour: clear > brown > green." },
  { name: "E-Waste", lagos: 1200, abuja: 1100, ph: 1150, accept: ["Old phones", "Chargers", "Cables", "Headphones"], reject: ["TVs (special pickup)", "Refrigerators"], tip: "Phones with batteries = 2x value. Don't remove them." },
  { name: "Metal & Scrap", lagos: 400, abuja: 380, ph: 400, accept: ["Iron rods", "Cooking pots", "Steel cans"], reject: ["Lead-acid batteries", "Anything painted heavily"], tip: "Magnet test — if it sticks, it's metal we accept." },
];

export default function WasteCategories() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-16 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="left-[-10%] top-[-15%] h-[450px] w-[450px]" color="from-primary/30 to-primary/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Categories & live rates</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            Eight categories. <br />
            <span className="text-accent-600">Live, regional pricing.</span>
          </h1>
          <p className="mt-6 text-lg text-textgray">
            Rates are set by our pricing engine every Monday based on factory demand, exchange rates and local supply. Prices below are <span className="font-bold text-charcoal">live as of today.</span>
          </p>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container-page">
          <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="badge-mint">● Live</span>
              <span className="text-textgray">Showing rates for</span>
              <select className="input h-9 w-auto px-3 text-sm font-bold">
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Port Harcourt</option>
                <option>Kano</option>
              </select>
            </div>
            <div className="text-xs text-textgray">Last updated <span className="font-bold text-charcoal">Mon, Apr 27 · 06:00</span></div>
          </div>
        </div>
      </section>

      <section className="section bg-white !pt-0">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {CATS.map((c) => (
              <article key={c.name} className="card overflow-hidden">
                <div className="flex items-center gap-4 border-b border-bordergray p-6">
                  <CategoryIcon category={c.name} size={56} />
                  <div className="flex-1">
                    <h3 className="text-h4">{c.name}</h3>
                    <div className="text-xs text-textgray">{c.tip}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-extrabold text-charcoal">{formatNaira(c.lagos)}</div>
                    <div className="text-[10px] font-bold uppercase text-textgray">/kg in Lagos</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-bordergray">
                  {[
                    { city: "Lagos", v: c.lagos }, { city: "Abuja", v: c.abuja }, { city: "PH", v: c.ph },
                  ].map((p) => (
                    <div key={p.city} className="px-4 py-3 text-center">
                      <div className="text-[10px] font-bold uppercase text-textgray">{p.city}</div>
                      <div className="font-mono text-sm font-extrabold">{formatNaira(p.v)}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-px bg-bordergray">
                  <div className="bg-white p-5">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-success">We accept</div>
                    <ul className="space-y-1.5">
                      {c.accept.map((a) => (
                        <li key={a} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={14} className="shrink-0 text-success" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-5">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-error">We don't accept</div>
                    <ul className="space-y-1.5">
                      {c.reject.map((r) => (
                        <li key={r} className="flex items-center gap-2 text-sm text-textgray">
                          <X size={14} className="shrink-0 text-error" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <div className="card-primary relative overflow-hidden p-10 sm:p-14">
            <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-30" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <Eyebrow className="!text-accent">For high-volume collectors</Eyebrow>
                <h2 className="mt-3 text-display font-extrabold leading-[0.98] text-white text-balance">
                  Got more than 50kg? We'll send a truck.
                </h2>
                <p className="mt-5 max-w-xl text-white/80">
                  Restaurants, schools, churches, market traders, factories — book a free Recovang Logistics pickup directly from the app. We weigh on your premises, pay on the spot.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link to="/auth/register" className="btn-gold btn-lg">Book a pickup <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
