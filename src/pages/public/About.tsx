import { Link } from "react-router-dom";
import { ArrowRight, Heart, Leaf, Shield, Target, Trophy, Users } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";

const VALUES = [
  { t: "Money first.", d: "Every screen, every flow, every decision starts with: does this put more naira in our collector's pocket?", icon: Target },
  { t: "Receipts over rhetoric.", d: "We don't sell carbon-credit fairy dust. Every kilo is weighed, photographed, and on a public ledger.", icon: Shield },
  { t: "Built for Tecno phones.", d: "Our entire stack runs on a 1GB RAM Android device with one bar of signal. Bandwidth is a privilege.", icon: Leaf },
  { t: "Lagos before London.", d: "We solve for Surulere first. The framework, copy, and pricing all start from a Nigerian street, not a New York whiteboard.", icon: Heart },
];

const TEAM = [
  { name: "Chuka Eze", role: "Co-founder & CEO", letters: "CE", bio: "Ex-Flutterwave growth. Grew up in Aba, watched bottles pile up." },
  { name: "Aisha Bello", role: "Co-founder & CTO", letters: "AB", bio: "Built payments rails at Paystack. Believes infrastructure is empathy." },
  { name: "Tunde Ogun", role: "Head of Operations", letters: "TO", bio: "Ran 200 Bolt hubs across Nigeria. Knows logistics in the rain." },
  { name: "Sade Ijeoma", role: "Head of Brand", letters: "SI", bio: "Former MTN brand lead. Speaks four Nigerian languages fluently." },
];

const TIMELINE = [
  { y: "2024", t: "Founded in Yaba", d: "Three friends sketch the idea on a whiteboard at CcHub during the heat of June." },
  { y: "Q4 2024", t: "First hub opens in Surulere", d: "200 collectors sign up in week one. Bottles fly off the streets of Bode Thomas." },
  { y: "Q2 2025", t: "Lagos State partnership", d: "LAWMA signs MOU. Recovang becomes the first private partner on official waste reform." },
  { y: "Q4 2025", t: "Series A · ₦4.8B", d: "Led by Norrsken22 with Ventures Platform and Lagos State Pension Trust participating." },
  { y: "Q2 2026", t: "Abuja, PH live", d: "412 hubs across nine cities. ₦284M paid out. 1.2 million kg recovered." },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-24 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="left-[-10%] top-[-15%] h-[500px] w-[500px]" color="from-primary/30 to-primary/0" />
        <GridOverlay />
        <div className="container-page relative">
          <Eyebrow>Our story</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            We're building Africa's recycling industry — <span className="text-primary">one bottle at a time, starting in Nigeria.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-textgray">
            Every year, Lagos alone throws away enough plastic to fill the National Stadium 18 times. Recovang exists to flip that — to make every kilo of waste a kilo of cash, and every street a cleaner street.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Eyebrow>Mission</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold leading-tight text-balance">
              Make recovering waste the most profitable thing an African household can do.
            </h2>
            <p className="mt-5 text-textgray">
              Nigeria generates 32 million tonnes of solid waste a year. Less than 12% is recovered. The other 88% becomes flooded gutters, choked drains and Lagos lagoon plastic islands. We're not waiting for government, NGOs or carbon markets to fix it. We're paying real cash, today, to the people who can.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "32M", l: "Tonnes of waste / year in Nigeria" },
                { v: "12%", l: "Currently recovered nationally" },
                { v: "₦284M", l: "Paid by Recovang to date" },
                { v: "62K+", l: "Active collectors earning" },
              ].map((s, i) => (
                <div key={i} className="card p-6">
                  <div className="font-mono text-3xl font-extrabold text-charcoal">{s.v}</div>
                  <div className="mt-2 text-sm text-textgray">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <Eyebrow>What we believe</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold text-balance">Four rules that shape every decision.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <div key={i} className="card flex gap-5 p-7">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow">
                  <v.icon size={20} />
                </div>
                <div>
                  <h3 className="text-h4">{v.t}</h3>
                  <p className="mt-2 text-sm text-textgray">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <Eyebrow>Timeline</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-h1 font-extrabold text-balance">From a CcHub whiteboard to 412 hubs across Nigeria.</h2>
          <div className="mt-12 relative">
            <div className="absolute left-4 top-0 h-full w-px bg-bordergray sm:left-1/2" />
            <ul className="space-y-10">
              {TIMELINE.map((e, i) => (
                <li key={i} className="relative grid gap-3 sm:grid-cols-2 sm:gap-12">
                  <div className={`sm:text-right ${i % 2 ? "sm:order-2 sm:text-left" : ""}`}>
                    <div className="font-mono text-sm font-bold text-accent-600">{e.y}</div>
                    <h3 className="mt-1 text-h4">{e.t}</h3>
                    <p className="mt-1 text-sm text-textgray">{e.d}</p>
                  </div>
                  <div className={`hidden sm:block ${i % 2 ? "sm:order-1" : ""}`} />
                  <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-cream sm:left-[calc(50%-6px)]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <Eyebrow>The team</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold text-balance">Lagos-built. Operator-led. Allergic to slides.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="card overflow-hidden">
                <div className="aspect-[4/3] bg-grad-primary-deep p-8">
                  <div className="grid h-full place-items-center font-display text-6xl font-extrabold text-white/80">
                    {m.letters}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-h4">{m.name}</div>
                  <div className="text-xs font-bold uppercase tracking-wide text-accent-600">{m.role}</div>
                  <p className="mt-3 text-sm text-textgray">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="card-primary relative overflow-hidden p-10 sm:p-16">
            <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-30" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <Eyebrow className="!text-accent">Investors & partners</Eyebrow>
                <h2 className="mt-3 text-display font-extrabold leading-[0.98] text-balance text-white">
                  Backed by people who've built this before.
                </h2>
                <p className="mt-5 max-w-xl text-white/80">
                  Norrsken22, Ventures Platform, Lagos State Pension Trust, plus operators from Paystack, Flutterwave, Andela and MTN. Real names, real money, real accountability.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link to="/contact" className="btn-gold btn-lg">Partner with us <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
