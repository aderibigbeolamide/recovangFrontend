import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Target } from "lucide-react";
import { Eyebrow } from "@/components/ui";

const VALUES = [
  { t: "Money first.", d: "Every screen, every flow, every decision starts with: does this put more naira in our collector's pocket?", icon: Target },
  { t: "Receipts over rhetoric.", d: "We don't sell carbon-credit fairy dust. Every kilo is weighed, photographed, and on a public ledger.", icon: Shield },
  { t: "Built for Tecno phones.", d: "Our entire stack runs on a 1GB RAM Android device with one bar of signal. Bandwidth is a privilege.", icon: Leaf },
  { t: "Lagos before London.", d: "We solve for Surulere first. The framework, copy, and pricing all start from a Nigerian street, not a New York whiteboard.", icon: Heart },
];

const TEAM = [
  {
    name: "Chuka Eze", role: "Co-founder & CEO", letters: "CE",
    bio: "Ex-Flutterwave growth. Grew up in Aba, watched bottles pile up.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80",
  },
  {
    name: "Aisha Bello", role: "Co-founder & CTO", letters: "AB",
    bio: "Built payments rails at Paystack. Believes infrastructure is empathy.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80",
  },
  {
    name: "Tunde Ogun", role: "Head of Operations", letters: "TO",
    bio: "Ran 200 Bolt hubs across Nigeria. Knows logistics in the rain.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80",
  },
  {
    name: "Sade Ijeoma", role: "Head of Brand", letters: "SI",
    bio: "Former MTN brand lead. Speaks four Nigerian languages fluently.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=500&q=80",
  },
];

const TIMELINE = [
  { y: "2024", t: "Founded in Yaba", d: "Three friends sketch the idea on a whiteboard at CcHub during the heat of June." },
  { y: "Q4 2024", t: "First hub opens in Surulere", d: "200 collectors sign up in week one. Bottles fly off the streets of Bode Thomas." },
  { y: "Q2 2025", t: "Lagos State partnership", d: "LAWMA signs MOU. Recovang becomes the first private partner on official waste reform." },
  { y: "Q4 2025", t: "Series A · ₦4.8B", d: "Led by Norrsken22 with Ventures Platform and Lagos State Pension Trust participating." },
  { y: "Q2 2026", t: "Abuja, PH live", d: "412 hubs across nine cities. ₦284M paid out. 1.2 million kg recovered." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <div className="page-enter">
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
      <InvestorsSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-charcoal">
      <img
        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1800&q=80"
        alt="Recycling infrastructure in Lagos, Nigeria"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
      <div className="relative container-page pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow className="!text-accent">Our story</Eyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-5 max-w-5xl text-display-xl font-extrabold leading-[0.92] tracking-tighter text-white text-balance"
        >
          We're building Africa's recycling industry —{" "}
          <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
            one bottle at a time, starting in Nigeria.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 max-w-2xl text-lg text-white/65"
        >
          Every year, Lagos alone throws away enough plastic to fill the National Stadium 18 times. Recovang exists to flip that — to make every kilo of waste a kilo of cash.
        </motion.p>
      </div>
    </section>
  );
}

function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6"
        >
          <Eyebrow>Mission</Eyebrow>
          <h2 className="mt-4 text-h1 font-extrabold leading-tight text-balance">
            Make recovering waste the most profitable thing an African household can do.
          </h2>
          <p className="mt-5 text-textgray leading-relaxed">
            Nigeria generates 32 million tonnes of solid waste a year. Less than 12% is recovered. The other 88% becomes flooded gutters, choked drains and Lagos lagoon plastic islands. We're not waiting for government, NGOs or carbon markets to fix it. We're paying real cash, today, to the people who can.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="lg:col-span-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "32M", l: "Tonnes of waste / year in Nigeria" },
              { v: "12%", l: "Currently recovered nationally" },
              { v: "₦284M", l: "Paid by Recovang to date" },
              { v: "62K+", l: "Active collectors earning" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="card p-6 transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="font-mono text-3xl font-extrabold text-charcoal">{s.v}</div>
                <div className="mt-2 text-sm text-textgray">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>What we believe</Eyebrow>
          <h2 className="mt-4 text-h1 font-extrabold text-balance">Four rules that shape every decision.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.6 }}
              className="card flex gap-6 p-7 transition hover:shadow-card"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow">
                <v.icon size={20} />
              </div>
              <div>
                <h3 className="text-h4 font-extrabold">{v.t}</h3>
                <p className="mt-2 text-sm text-textgray leading-relaxed">{v.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <Eyebrow>Timeline</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-h1 font-extrabold text-balance">From a CcHub whiteboard to 412 hubs across Nigeria.</h2>
        <div className="mt-14 relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-accent to-bordergray sm:left-1/2" />
          <ul className="space-y-12">
            {TIMELINE.map((e, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                className="relative grid gap-4 sm:grid-cols-2 sm:gap-12 pl-12 sm:pl-0"
              >
                <div className={`${i % 2 ? "sm:order-2 sm:text-left" : "sm:text-right"}`}>
                  <div className="font-mono text-sm font-bold text-accent-500">{e.y}</div>
                  <h3 className="mt-1 text-lg font-extrabold text-charcoal">{e.t}</h3>
                  <p className="mt-1.5 text-sm text-textgray leading-relaxed">{e.d}</p>
                </div>
                <div className={`hidden sm:block ${i % 2 ? "sm:order-1" : ""}`} />
                <div className="absolute left-1.5 top-1.5 h-5 w-5 rounded-full border-[3px] border-white bg-primary shadow-glow sm:left-[calc(50%-10px)]" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>The team</Eyebrow>
          <h2 className="mt-4 text-h1 font-extrabold text-balance">Lagos-built. Operator-led. Allergic to slides.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.6 }}
              className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[4/5] overflow-hidden bg-charcoal">
                <img
                  src={m.photo} alt={m.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="p-5">
                <div className="text-h4 font-extrabold">{m.name}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-accent-500 mt-0.5">{m.role}</div>
                <p className="mt-3 text-sm text-textgray leading-relaxed">{m.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[40px] bg-grad-primary text-white"
        >
          <div className="absolute inset-0 bg-grid-dark opacity-20" />
          <img
            src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1400&q=50"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-10"
          />
          <div className="relative grid gap-8 p-10 sm:p-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <Eyebrow className="!text-accent">Investors & partners</Eyebrow>
              <h2 className="mt-4 text-display font-extrabold leading-[0.98] text-balance text-white">
                Backed by people who've built this before.
              </h2>
              <p className="mt-5 max-w-xl text-white/75 text-lg leading-relaxed">
                Norrsken22, Ventures Platform, Lagos State Pension Trust, plus operators from Paystack, Flutterwave, Andela and MTN. Real names, real money, real accountability.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link to="/contact" className="btn-gold btn-lg">Partner with us <ArrowRight size={16} /></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
