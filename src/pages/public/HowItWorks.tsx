import { Link } from "react-router-dom";
import { ArrowRight, Banknote, Bell, CheckCircle2, MapPin, QrCode, Recycle, ScanLine, Shield, Smartphone, Truck, Wallet } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay, CategoryIcon } from "@/components/illustrations";

const STEPS = [
  {
    n: "01", t: "Sort what you've got",
    d: "Plastics with plastics. Cans with cans. Paper dry. We accept seven categories — each priced per kilo by region.",
    icon: Recycle,
    bullets: ["No need to wash glass", "Crush cans to save space", "Remove caps from PET bottles"],
  },
  {
    n: "02", t: "Walk to your nearest hub",
    d: "412 hubs across 9 cities. Most Lagos collectors are within a 7-minute walk. Open the app to see live capacity before you go.",
    icon: MapPin,
    bullets: ["Avg drop time: 3 mins 12 secs", "Live capacity in-app", "Hubs open 7am – 7pm"],
  },
  {
    n: "03", t: "Agent scans your QR",
    d: "Show your unique QR code. Agent weighs your drop on a calibrated scale, snaps a photo, taps verify.",
    icon: QrCode,
    bullets: ["Calibrated scales (LCC certified)", "Auto-photo of every drop", "Pricing fixed at scan time"],
  },
  {
    n: "04", t: "Cash hits your wallet",
    d: "Money lands in your Recovang wallet in under 8 seconds. Cash out to bank, airtime, data, electricity, DSTV — your choice.",
    icon: Wallet,
    bullets: ["Avg wallet credit: 7.4 secs", "₦0 fees to bank up to ₦50K/wk", "Withdraw anytime, no minimum"],
  },
];

const PROOF = [
  { v: "3:12", l: "Average drop time" },
  { v: "7.4s", l: "Wallet credit speed" },
  { v: "99.6%", l: "First-time verification rate" },
  { v: "0", l: "Hidden fees" },
];

const FOR = [
  { tag: "Collector", title: "I have waste — I want money.", route: "/collector/dashboard", icon: Wallet },
  { tag: "Agent", title: "I run a hub — I want to verify drops.", route: "/agent/dashboard", icon: QrCode },
  { tag: "Logistics", title: "I have a truck — I want to move material.", route: "/logistics/dashboard", icon: Truck },
];

export default function HowItWorks() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-16 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="right-[-10%] top-[-10%] h-[500px] w-[500px]" color="from-accent/30 to-accent/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            Four steps. <br />
            <span className="text-primary">Three minutes.</span> Real cash.
          </h1>
          <p className="mt-6 text-lg text-textgray">
            We optimised every screen for one thing: getting cash from your bottle to your bank as fast as humanly possible. Here's exactly how it works — including the bits we usually only show our investors.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth/register" className="btn-primary">Try it now <ArrowRight size={14} /></Link>
            <Link to="/find-hub" className="btn-outline"><MapPin size={14} /> Find my hub</Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page space-y-16">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`grid gap-10 lg:grid-cols-12 lg:items-center ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="lg:col-span-7">
                <div className="font-mono text-sm font-bold text-accent-600">STEP {s.n}</div>
                <h2 className="mt-2 text-h1 font-extrabold leading-tight text-balance">{s.t}</h2>
                <p className="mt-4 text-textgray">{s.d}</p>
                <ul className="mt-6 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle2 size={16} className="text-success" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-square rounded-3xl bg-grad-mint p-10">
                  <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" />
                  <div className="relative flex h-full items-center justify-center">
                    <div className="grid h-44 w-44 place-items-center rounded-[44px] bg-grad-primary text-white shadow-glow">
                      <s.icon size={64} />
                    </div>
                  </div>
                  <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary shadow-soft">
                    {s.n}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-charcoal text-white">
        <div className="container-page">
          <Eyebrow className="!text-accent">By the numbers</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-h1 font-extrabold leading-tight text-balance">
            We obsess over the metrics that matter to you, not to a pitch deck.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PROOF.map((p, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="font-mono text-4xl font-extrabold text-accent">{p.v}</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-white/60">{p.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <Eyebrow>Trust & safety</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-h1 font-extrabold text-balance">
            How we make sure you always get paid the right amount, every single time.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { t: "Calibrated scales", d: "Every hub uses LCC-certified electronic scales. Calibrated weekly, audited monthly.", icon: ScanLine },
              { t: "Photo of every drop", d: "Auto-captured at verification. You see it in your wallet history. Brands see it in their EPR ledger.", icon: Smartphone },
              { t: "Dispute in two taps", d: "Don't agree with the weight or the photo? Raise a dispute and our ops team responds in under 4 hours.", icon: Shield },
            ].map((b, i) => (
              <div key={i} className="card p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-primary">
                  <b.icon size={20} />
                </div>
                <h3 className="mt-5 text-h4">{b.t}</h3>
                <p className="mt-2 text-sm text-textgray">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <Eyebrow>Choose your role</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-h1 font-extrabold text-balance">Recovang is built for the whole chain.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FOR.map((f) => (
              <Link key={f.tag} to={f.route} className="card group flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-card">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-grad-primary text-white">
                  <f.icon size={20} />
                </div>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-textgray">{f.tag}</div>
                <h3 className="mt-2 text-h4 text-balance">{f.title}</h3>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-bold text-primary group-hover:text-primary-700">
                  See the {f.tag.toLowerCase()} flow <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
