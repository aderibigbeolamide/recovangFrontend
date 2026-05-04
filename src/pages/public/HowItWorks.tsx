import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Banknote, CheckCircle2, MapPin, QrCode, Recycle, ScanLine, Shield, Smartphone, Truck, Wallet } from "lucide-react";
import { Eyebrow } from "@/components/ui";

const STEPS = [
  {
    n: "01", t: "Sort what you've got",
    d: "Plastics with plastics. Cans with cans. Paper dry. We accept seven categories — each priced per kilo by region.",
    icon: Recycle,
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    alt: "Sorted plastic bottles and recycling materials",
    bullets: ["No need to wash glass", "Crush cans to save space", "Remove caps from PET bottles"],
  },
  {
    n: "02", t: "Walk to your nearest hub",
    d: "412 hubs across 9 cities. Most Lagos collectors are within a 7-minute walk. Open the app to see live capacity before you go.",
    icon: MapPin,
    img: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=900&q=80",
    alt: "A collector walking to a Recovang hub with materials",
    bullets: ["Avg drop time: 3 mins 12 secs", "Live capacity in-app", "Hubs open 7am – 7pm"],
  },
  {
    n: "03", t: "Agent scans your QR",
    d: "Show your unique QR code. Agent weighs your drop on a calibrated scale, snaps a photo, taps verify.",
    icon: QrCode,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    alt: "A Recovang agent verifying a collection",
    bullets: ["Calibrated scales (LCC certified)", "Auto-photo of every drop", "Pricing fixed at scan time"],
  },
  {
    n: "04", t: "Cash hits your wallet",
    d: "Money lands in your Recovang wallet in under 8 seconds. Cash out to bank, airtime, data, electricity, DSTV — your choice.",
    icon: Wallet,
    img: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80",
    alt: "Hands holding cash - instant payment received",
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
    <div className="page-enter">
      <HeroSection />
      <StepsSection />
      <ProofNumbers />
      <TrustSection />
      <RolesSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-charcoal min-h-[60vh] flex items-end">
      <img
        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1800&q=80"
        alt="Collector on street with recyclable materials"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30" />
      <div className="relative container-page pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow className="!text-accent">How it works</Eyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-5 max-w-4xl text-display-xl font-extrabold leading-[0.92] tracking-tighter text-white text-balance"
        >
          Four steps.{" "}
          <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
            Three minutes.
          </span>{" "}
          Real cash.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 max-w-2xl text-lg text-white/65"
        >
          We optimised every screen for one thing: getting cash from your bottle to your bank as fast as humanly possible.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link to="/auth/register" className="btn-gold btn-lg">Try it now <ArrowRight size={14} /></Link>
          <Link to="/find-hub" className="btn-lg inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
            <MapPin size={14} /> Find my hub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="section bg-white">
      <div className="container-page space-y-20 sm:space-y-28">
        {STEPS.map((s, i) => (
          <StepRow key={s.n} step={s} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function StepRow({ step: s, reversed }: { step: typeof STEPS[0]; reversed: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={cn("grid gap-10 lg:grid-cols-2 lg:items-center", reversed ? "lg:[&>*:first-child]:order-2" : "")}>
      <motion.div
        initial={{ opacity: 0, x: reversed ? 24 : -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="font-mono text-sm font-bold text-accent-500 tracking-widest mb-3">STEP {s.n}</div>
        <h2 className="text-h1 font-extrabold leading-tight text-balance">{s.t}</h2>
        <p className="mt-4 text-textgray leading-relaxed">{s.d}</p>
        <ul className="mt-6 space-y-2.5">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-charcoal">
              <CheckCircle2 size={16} className="text-success shrink-0" /> {b}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -24 : 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-3xl aspect-[4/3] shadow-lift group">
          <img
            src={s.img} alt={s.alt} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5">
            <div className="inline-flex items-center gap-2.5 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-md border border-white/20">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white">
                <s.icon size={16} />
              </div>
              <span className="text-sm font-bold text-white">{s.t}</span>
            </div>
          </div>
          <div className="absolute right-4 top-4 font-mono text-5xl font-extrabold text-white/20 leading-none">{s.n}</div>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ProofNumbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-charcoal text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-dark opacity-25" />
      <div className="container-page relative">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="lg:col-span-7"
          >
            <Eyebrow className="!text-accent">By the numbers</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold text-balance text-white">
              We obsess over the metrics that matter to you, not to a pitch deck.
            </h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROOF.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/8"
            >
              <div className="font-mono text-4xl font-extrabold text-accent">{p.v}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-white/55">{p.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    { t: "Calibrated scales", d: "Every hub uses LCC-certified electronic scales. Calibrated weekly, audited monthly.", icon: ScanLine, img: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=400&q=70" },
    { t: "Photo of every drop", d: "Auto-captured at verification. You see it in your wallet history. Brands see it in their EPR ledger.", icon: Smartphone, img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=70" },
    { t: "Dispute in two taps", d: "Don't agree with the weight or the photo? Raise a dispute and our ops team responds in under 4 hours.", icon: Shield, img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=70" },
  ];

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Trust & safety</Eyebrow>
          <h2 className="mt-3 text-h1 font-extrabold text-balance">
            How we make sure you always get paid the right amount, every single time.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.12, duration: 0.6 }}
              className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={b.img} alt={b.t} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-95"
                />
              </div>
              <div className="p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-primary">
                  <b.icon size={20} />
                </div>
                <h3 className="mt-5 text-h4 font-extrabold">{b.t}</h3>
                <p className="mt-2 text-sm text-textgray leading-relaxed">{b.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Choose your role</Eyebrow>
          <h2 className="mt-3 text-h1 font-extrabold text-balance">Recovang is built for the whole chain.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {FOR.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.12, duration: 0.6 }}
            >
              <Link to={f.route} className="card group flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-card">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-grad-primary text-white">
                  <f.icon size={20} />
                </div>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-textgray">{f.tag}</div>
                <h3 className="mt-2 text-h4 text-balance">{f.title}</h3>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-bold text-primary group-hover:text-primary-700">
                  See the {f.tag.toLowerCase()} flow <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
