import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  ArrowRight, ArrowUpRight, Banknote, CheckCircle2, MapPin, Recycle, Star,
  TrendingUp, Truck, Users, Wallet, Zap, Play, ChevronDown,
} from "lucide-react";
import { CategoryIcon } from "@/components/illustrations";
import { Eyebrow } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const PARTNERS = ["Coca-Cola", "Nestlé", "Dangote", "Indomie", "Lagos State", "UNDP", "Flutterwave"];

const STATS = [
  { v: 284, suffix: "M", prefix: "₦", l: "Paid to collectors" },
  { v: 1.2, suffix: "M kg", prefix: "", l: "Waste recovered" },
  { v: 412, suffix: "", prefix: "", l: "Active hubs" },
  { v: 62, suffix: "K+", prefix: "", l: "Collectors earning" },
];

const STEPS = [
  { n: "01", t: "Drop your waste", d: "Sort and bring plastics, cans, paper or glass to your nearest Recovang hub.", icon: Recycle, img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=75" },
  { n: "02", t: "Agent verifies", d: "Our trained agent weighs, photographs and confirms your drop in seconds.", icon: CheckCircle2, img: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=75" },
  { n: "03", t: "Cash hits instantly", d: "Withdraw to your bank, buy airtime, pay bills. No waiting, no minimums.", icon: Banknote, img: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=75" },
];

const CATEGORIES = [
  { name: "PET Plastic", rate: 200, unit: "kg" },
  { name: "Aluminium Cans", rate: 600, unit: "kg" },
  { name: "Mixed Paper", rate: 60, unit: "kg" },
  { name: "Cardboard", rate: 80, unit: "kg" },
  { name: "Glass Bottles", rate: 30, unit: "kg" },
  { name: "E-Waste", rate: 1200, unit: "kg" },
];

const TESTIMONIALS = [
  {
    name: "Adaeze N.", city: "Surulere · Lagos", payout: 48000,
    q: "I made ₦48,000 last month from things I used to throw away. Recovang changed my hustle.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    name: "Ibrahim K.", city: "Wuse · Abuja", payout: 31200,
    q: "The agent at my hub is sharp. Drop, weigh, pay — under three minutes every time.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    name: "Folake A.", city: "Yaba · Lagos", payout: 22400,
    q: "I cash out to airtime instantly. My kids' data stays on. My block stays clean.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
  },
];

const STORIES = [
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    alt: "A collector picking plastic bottles off the street",
    tag: "A day with a collector",
    name: "Folake's story",
    caption: "She earned ₦240,000 last term. Her four kids' school fees came out of recovered PET bottles.",
    slug: "surulere-mother-school-fees",
  },
  {
    src: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=900&q=80",
    alt: "A young African man sorting plastic bottles at a recycling hub",
    tag: "Hub agent · Surulere",
    name: "Bola's day",
    caption: "Bola verifies 184 drops a day with a rugged scale and a Tecno phone.",
    slug: "anatomy-of-a-hub",
  },
  {
    src: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=900&q=80",
    alt: "Recycling worker processing PET bottles",
    tag: "Processing · Apapa",
    name: "Inside a factory",
    caption: "Indorama bales 1.4 tonnes of PET an hour into food-grade flake.",
    slug: "coca-cola-epr-partnership",
  },
  {
    src: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80",
    alt: "Hands holding recovered plastic bottles",
    tag: "Every bottle counts",
    name: "The numbers",
    caption: "Every bottle weighed and paid. No middlemen, no waiting.",
    slug: "surulere-mother-school-fees",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = prefix + (Number.isInteger(value) ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix;
      },
    });
    return controls.stop;
  }, [inView, value, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
        <ChevronDown size={18} />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Hero />
      <Partners />
      <ImpactStats />
      <HowItWorksSection />
      <StoriesGrid />
      <CategoriesSection />
      <ForWhomGrid />
      <Testimonials />
      <BrandCTA />
      <FinalCTA />
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-charcoal">
      <img
        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1800&q=80"
        alt="A collector picking up plastic bottles from a Nigerian street at sunrise"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

      <div className="relative container-page flex flex-1 flex-col justify-center py-24 lg:py-0 lg:min-h-screen">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Africa's waste-to-cash platform · starting in Nigeria
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-display-xl font-extrabold leading-[0.92] tracking-tighter text-white text-balance"
          >
            Drop your waste.
            <br />
            <span className="bg-gradient-to-r from-accent-300 via-accent to-primary-300 bg-clip-text text-transparent">
              Collect real cash.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 max-w-xl text-lg text-white/75 text-pretty leading-relaxed"
          >
            Recovang turns plastics, cans, paper and electronics into instant naira — paid straight to your bank, airtime or bills. The smart way to clean up your street and your bank account.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link to="/auth/register" className="btn-gold btn-lg group">
              Start earning
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/find-hub" className="btn-lg inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
              <MapPin size={16} /> Find a hub
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-8"
          >
            <div className="flex -space-x-2.5">
              {[
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60&h=60&fit=crop&q=70",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&q=70",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&q=70",
                "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=60&h=60&fit=crop&q=70",
                "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=60&h=60&fit=crop&q=70",
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-charcoal/80 object-cover" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="ml-2 font-bold text-white">4.9</span>
              </div>
              <div className="text-xs text-white/50 mt-0.5">12,400+ Play Store reviews · 62K+ collectors earning</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-charcoal/60 backdrop-blur-xl">
        <div className="container-page grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
              className="flex flex-col gap-1 px-5 py-6"
            >
              <div className="font-mono text-2xl font-extrabold text-white sm:text-3xl tabular-nums">
                <AnimatedNumber value={s.v} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

function Partners() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="border-b border-bordergray bg-white py-10">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-[11px] font-bold uppercase tracking-widest text-textgray/70 mb-7"
        >
          Trusted by Africa's biggest brands & government partners
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {PARTNERS.map((p) => (
            <motion.div key={p} variants={fadeUp} className="font-display text-xl font-extrabold tracking-tight text-charcoal/25">
              {p}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ImpactStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const kpis = [
    { v: "1.2M kg", l: "Plastic, paper, glass, metal recovered", t: "+18,400 kg this week", icon: Recycle, img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=70" },
    { v: "₦284M", l: "Paid out to African collectors", t: "+₦12.8M this week", icon: Wallet, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=70" },
    { v: "62,418", l: "Active collectors earning monthly", t: "+1,284 this week", icon: Users, img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=70" },
    { v: "412", l: "Recovang hubs across 9 cities", t: "+9 verified this month", icon: MapPin, img: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=70" },
  ];

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <Eyebrow>Real impact</Eyebrow>
            <h2 className="mt-4 text-h1 font-extrabold leading-tight text-balance">
              Every kilo recovered is a real naira earned and a real bottle off your street.
            </h2>
            <p className="mt-5 text-textgray text-pretty leading-relaxed">
              We don't deal in carbon-credit fairy dust. We deal in receipts. Every drop is weighed, photographed and paid — and every transaction is on our public impact ledger.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:text-primary-700 group">
              Read our impact report
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {kpis.map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-bordergray bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img src={k.img} alt="" className="h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-5" />
                </div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-primary">
                      <k.icon size={20} />
                    </div>
                    <div className="badge-success text-[10px]">▲ live</div>
                  </div>
                  <div className="mt-5 font-mono text-3xl font-extrabold leading-none text-charcoal">{k.v}</div>
                  <div className="mt-2 text-sm text-textgray">{k.l}</div>
                  <div className="mt-4 text-xs font-bold text-success">{k.t}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-charcoal text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="container-page relative">
        <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Eyebrow className="!text-accent">How Recovang works</Eyebrow>
            <h2 className="mt-4 text-h1 font-extrabold text-balance text-white">From waste to receipt — in three taps.</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/60 lg:col-span-5"
          >
            Built to work on a Tecno Spark with one bar of signal. The same flow whether you're dropping one bottle or a sack of cans.
          </motion.p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/10"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img} alt={s.t} loading="lazy"
                  className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="font-mono text-4xl font-extrabold text-white/15 leading-none mb-3">{s.n}</div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow mb-4">
                  <s.icon size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-white">{s.t}</h3>
                <p className="mt-2 text-sm text-white/65">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link to="/how-it-works" className="btn-gold btn-lg">See the full flow <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function StoriesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="lg:col-span-7"
          >
            <Eyebrow>The faces behind every kilo</Eyebrow>
            <h2 className="mt-4 text-h1 font-extrabold leading-tight text-balance">
              Built by Africans, for Africans — every drop has a face and a story.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <p className="text-textgray text-pretty">
              From a hub agent in Surulere to a baling line in Apapa, this is what the circular economy looks like when it actually works for the people doing the work.
            </p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700 group">
              Read all stories from the field
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/blog/${s.slug}`}
                aria-label={`Read: ${s.name}`}
                className="group relative block overflow-hidden rounded-3xl shadow-soft transition hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={s.src} alt={s.alt} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent">{s.tag}</div>
                  <div className="mt-1.5 text-base font-extrabold text-white leading-snug">{s.name}</div>
                  <div className="mt-1 text-xs text-white/65 leading-snug">{s.caption}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                    Read story <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="max-w-xl"
          >
            <Eyebrow>What we buy</Eyebrow>
            <h2 className="mt-4 text-h1 font-extrabold text-balance">Live rates, paid by the kilo.</h2>
            <p className="mt-3 text-textgray">Prices are set by region and refreshed every Monday by our pricing engine.</p>
          </motion.div>
          <Link to="/waste-categories" className="btn-outline self-start">All categories <ArrowRight size={14} /></Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.07, duration: 0.5 }}
              className="group flex items-center gap-5 rounded-2xl border border-bordergray bg-white p-5 transition hover:border-primary hover:shadow-soft"
            >
              <CategoryIcon category={c.name} size={48} />
              <div className="flex-1">
                <div className="font-bold text-charcoal">{c.name}</div>
                <div className="text-xs text-textgray mt-0.5">Lagos rate · refreshed Mon</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-extrabold text-charcoal">{formatNaira(c.rate)}</div>
                <div className="text-[10px] font-bold uppercase text-textgray">/{c.unit}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWhomGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    {
      tag: "For collectors",
      title: "Make ₦15K–₦80K every month from waste already in your home.",
      icon: Wallet,
      bg: "bg-grad-primary",
      photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=75",
    },
    {
      tag: "For agents",
      title: "Run a hub. Earn commission on every kilo verified.",
      icon: Users,
      bg: "bg-grad-gold",
      photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=75",
    },
    {
      tag: "For logistics",
      title: "Move recovered material from hubs to recyclers. Get paid per pickup.",
      icon: Truck,
      bg: "bg-grad-dark",
      photo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=75",
    },
    {
      tag: "For brands",
      title: "Hit your EPR targets with verifiable, photographed, weighed evidence.",
      icon: TrendingUp,
      bg: "bg-grad-primary",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=75",
    },
  ] as const;

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Built for the whole chain</Eyebrow>
          <h2 className="mt-4 text-h1 font-extrabold text-balance">One platform. Four sides of the same circular economy.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl aspect-[4/5]"
            >
              <img
                src={it.photo} alt={it.tag} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 ${it.bg} opacity-80 transition group-hover:opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">{it.tag}</div>
                <div>
                  <h3 className="text-xl font-extrabold leading-tight text-balance mb-5">{it.title}</h3>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur border border-white/20 transition hover:bg-white/25"
                  >
                    Join <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-white">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>From the streets</Eyebrow>
          <h2 className="mt-4 text-h1 font-extrabold text-balance">Real Africans. Real cash. Real cleaner streets.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="card flex flex-col p-7 transition hover:shadow-card"
            >
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <blockquote className="mt-5 flex-1 text-lg font-medium leading-snug text-charcoal text-balance">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-bordergray pt-5">
                <img
                  src={t.photo} alt={`Portrait of ${t.name}`} loading="lazy"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-mint shadow-soft"
                />
                <div className="flex-1">
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-textgray">{t.city}</div>
                </div>
                <div className="rounded-2xl bg-accent-50 px-3 py-2 text-right">
                  <div className="font-mono text-sm font-extrabold text-accent-600">{formatNaira(t.payout)}</div>
                  <div className="text-[9px] font-bold uppercase text-accent-600/70">earned</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section bg-cream">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[40px] bg-charcoal text-white"
        >
          <div className="absolute inset-0 bg-grid-dark opacity-20" />
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=70"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
          <div className="relative grid gap-10 p-10 sm:p-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                For brands & corporates
              </span>
              <h2 className="mt-5 text-display font-extrabold leading-[0.98] text-balance text-white">
                Turn your EPR obligation into a competitive advantage.
              </h2>
              <p className="mt-5 max-w-xl text-white/70 text-lg">
                Every kilo we recover for your brand comes with a photograph, a weight certificate, and a QR-linked audit trail. NGO promises not included.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/auth/register" className="btn-gold btn-lg">Start EPR programme <ArrowRight size={16} /></Link>
                <Link to="/contact" className="btn-lg inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
                  Talk to a partnership manager
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal py-24 sm:py-32 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="lg:col-span-8"
        >
          <h2 className="text-display font-extrabold leading-[0.95] text-balance">
            Your <span className="text-gradient-gold">rubbish</span> is somebody's <span className="text-gradient-gold">raw material.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/60">
            Join 62,000 Africans cashing out every drop. Bank, airtime, bills — paid in seconds.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col"
        >
          <Link to="/auth/register" className="btn-gold btn-lg">Start earning <ArrowRight size={16} /></Link>
          <Link to="/find-hub" className="btn-lg inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/15">
            <MapPin size={16} /> Find a hub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
