import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Banknote, CheckCircle2, MapPin, Recycle, Smartphone,
  Star, TrendingUp, Truck, Users, Wallet, Zap,
} from "lucide-react";
import { PhoneMockup, Blob, GridOverlay, CategoryIcon } from "@/components/illustrations";
import { Eyebrow } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const PARTNERS = ["Coca-Cola", "Nestlé", "Dangote", "Indomie", "Lagos State", "UNDP", "Flutterwave"];

const STATS = [
  { v: "₦284M", l: "Paid to collectors" },
  { v: "1.2M kg", l: "Waste recovered" },
  { v: "412", l: "Active hubs" },
  { v: "62K+", l: "Collectors earning" },
];

const STEPS = [
  { n: "01", t: "Drop your waste", d: "Sort and bring plastics, cans, paper or glass to your nearest Recovang hub.", icon: Recycle },
  { n: "02", t: "Agent verifies", d: "Our trained agent weighs, photographs and confirms your drop in seconds.", icon: CheckCircle2 },
  { n: "03", t: "Cash hits instantly", d: "Withdraw to your bank, buy airtime, pay bills. No waiting, no minimums.", icon: Banknote },
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
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=70",
  },
  {
    name: "Ibrahim K.", city: "Wuse · Abuja", payout: 31200,
    q: "The agent at my hub is sharp. Drop, weigh, pay — under three minutes every time.",
    photo: "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=200&h=200&q=70",
  },
  {
    name: "Folake A.", city: "Yaba · Lagos", payout: 22400,
    q: "I cash out to airtime instantly. My kids' data stays on. My block stays clean.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=70",
  },
];

const PEOPLE = [
  {
    src: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=900&q=70",
    alt: "A young African man sorting plastic bottles at a recycling hub",
    tag: "Hub agent · Surulere",
    caption: "Bola verifies 184 drops a day with a rugged scale and a Tecno phone.",
  },
  {
    src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=70",
    alt: "Coloured recycling bins for sorting waste",
    tag: "On the street",
    caption: "Sort PET, cans, paper and glass. The colour-coded bins do the rest.",
  },
  {
    src: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=900&q=70",
    alt: "Recycling worker pressing PET bottles into a bale",
    tag: "Processing partner · Apapa",
    caption: "Indorama bales 1.4 tonnes of PET an hour into food-grade flake.",
  },
  {
    src: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=70",
    alt: "Hands holding a cluster of crushed plastic bottles",
    tag: "Drops, drops, drops",
    caption: "Every bottle weighed and paid. No middlemen, no waiting.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <RealPeople />
      <ImpactStats />
      <HowItWorksSection />
      <CategoriesSection />
      <ForWhomGrid />
      <Testimonials />
      <BrandCTA />
      <FinalCTA />
    </>
  );
}

function RealPeople() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 grid gap-6 sm:mb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>The faces behind every kilo</Eyebrow>
            <h2 className="mt-3 text-h2 font-extrabold leading-tight text-balance sm:text-h1">
              Built by Africans, for Africans — every drop has a face and a story.
            </h2>
          </div>
          <p className="text-textgray lg:col-span-5">
            From a hub agent in Surulere to a baling line in Apapa, this is what the circular economy looks like when it actually works for the people doing the work.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PEOPLE.map((p) => (
            <figure key={p.src} className="group relative overflow-hidden rounded-2xl bg-charcoal/5">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent p-4 text-white">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">{p.tag}</div>
                <div className="mt-1 text-sm font-bold leading-snug">{p.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-grad-hero" />
      <Blob className="left-[-10%] top-[-10%] h-[480px] w-[480px]" color="from-primary/40 to-primary/0" />
      <Blob className="right-[-10%] top-[10%] h-[420px] w-[420px]" color="from-accent/30 to-accent/0" />
      <GridOverlay />
      <div className="container-page relative grid gap-14 pb-24 pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-20">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow>Africa's waste-to-cash platform · starting in Nigeria</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-display font-extrabold leading-[0.95] tracking-tight text-balance sm:mt-6 sm:text-display-xl sm:tracking-tighter"
          >
            Drop your waste.
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-700 to-accent-600 bg-clip-text text-transparent">
              Collect real cash.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-textgray text-pretty"
          >
            Recovang turns plastics, cans, paper and electronics into instant naira — paid straight to your bank, airtime or bills. The smart way to clean up your street and your bank account.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/auth/register" className="btn-primary btn-lg">Start earning <ArrowRight size={16} /></Link>
            <Link to="/find-hub" className="btn-outline btn-lg"><MapPin size={16} /> Find a hub near me</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-2">
              {["AN", "IK", "FA", "BO", "TD"].map((l, i) => (
                <div key={l} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-cream font-display text-xs font-extrabold ${["bg-primary text-white","bg-accent text-charcoal","bg-charcoal text-white","bg-success text-white","bg-mint text-primary"][i]}`}>{l}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="ml-2 font-bold text-charcoal">4.9</span>
              </div>
              <div className="text-xs text-textgray">12,400+ Play Store reviews · 62K+ active collectors</div>
            </div>
          </motion.div>
        </div>

        <div className="relative lg:col-span-5 lg:pl-8">
          <PhoneMockup />
        </div>
      </div>

      {/* Bottom band — quick stats */}
      <div className="relative border-y border-bordergray bg-white/80 backdrop-blur">
        <div className="container-page grid grid-cols-2 divide-y divide-bordergray sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2 px-2 py-5 sm:py-6">
              <div className="font-mono text-xl font-extrabold tabular-nums text-charcoal sm:text-2xl">{s.v}</div>
              <div className="text-xs uppercase tracking-wider text-textgray">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="bg-cream py-12">
      <div className="container-page">
        <div className="text-center text-[11px] font-bold uppercase tracking-widest text-textgray">
          Trusted by Africa's biggest brands & government partners
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {PARTNERS.map((p) => (
            <div key={p} className="font-display text-lg font-extrabold tracking-tight text-charcoal/70">{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactStats() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Real impact</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold leading-tight text-balance">
              Every kilo recovered is a real naira earned and a real bottle off your street.
            </h2>
            <p className="mt-5 text-textgray text-pretty">
              We don't deal in carbon-credit fairy dust. We deal in receipts. Every drop is weighed, photographed and paid — and every transaction is on our public impact ledger.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:text-primary-700">
              Read our impact report <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { v: "1.2M kg", l: "Plastic, paper, glass, metal recovered", t: "+18,400 kg this week", icon: Recycle },
              { v: "₦284M", l: "Paid out to African collectors", t: "+₦12.8M this week", icon: Wallet },
              { v: "62,418", l: "Active collectors earning monthly", t: "+1,284 this week", icon: Users },
              { v: "412", l: "Recovang hubs across 9 cities", t: "+9 verified this month", icon: MapPin },
            ].map((k, i) => (
              <div key={i} className="card group p-6 transition hover:shadow-card">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-primary">
                    <k.icon size={20} />
                  </div>
                  <div className="badge-success text-[10px]">▲ live</div>
                </div>
                <div className="mt-5 font-mono text-3xl font-extrabold leading-none text-charcoal">{k.v}</div>
                <div className="mt-1 text-sm text-textgray">{k.l}</div>
                <div className="mt-4 text-xs font-bold text-success">{k.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="section bg-grad-mint">
      <div className="container-page">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>How Recovang works</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold text-balance">From rubbish to receipt — in three taps.</h2>
          </div>
          <p className="text-textgray lg:col-span-5">
            Built to work on a Tecno Spark with one bar of signal. The same flow whether you're dropping one bottle or a sack of cans.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card relative overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-card">
              <div className="font-mono text-5xl font-extrabold text-mint">{s.n}</div>
              <div className="mt-5 grid h-12 w-12 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow">
                <s.icon size={20} />
              </div>
              <h3 className="mt-5 text-h4">{s.t}</h3>
              <p className="mt-2 text-sm text-textgray">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/how-it-works" className="btn-dark">See the full flow <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow>What we buy</Eyebrow>
            <h2 className="mt-3 text-h1 font-extrabold text-balance">Live rates, paid by the kilo.</h2>
            <p className="mt-3 text-textgray">Prices are set by region and refreshed every Monday by our pricing engine.</p>
          </div>
          <Link to="/waste-categories" className="btn-outline self-start">All categories <ArrowRight size={14} /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="card group flex items-center gap-5 p-5 transition hover:border-primary hover:shadow-card">
              <CategoryIcon category={c.name} size={48} />
              <div className="flex-1">
                <div className="text-h4">{c.name}</div>
                <div className="text-xs text-textgray">Lagos rate · refreshed Mon</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-extrabold text-charcoal">{formatNaira(c.rate)}</div>
                <div className="text-[10px] font-bold uppercase text-textgray">/{c.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWhomGrid() {
  const items = [
    {
      tag: "For collectors", title: "Make ₦15K–₦80K every month from waste already in your home.",
      icon: Wallet, tone: "primary",
    },
    {
      tag: "For agents", title: "Run a hub. Earn commission on every kilo verified.",
      icon: Users, tone: "gold",
    },
    {
      tag: "For logistics", title: "Move recovered material from hubs to recyclers. Get paid per pickup.",
      icon: Truck, tone: "dark",
    },
    {
      tag: "For brands", title: "Hit your EPR targets with verifiable, photographed, weighed evidence.",
      icon: TrendingUp, tone: "primary",
    },
  ] as const;
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Built for the whole chain</Eyebrow>
          <h2 className="mt-3 text-h1 font-extrabold text-balance">One platform. Four sides of the same circular economy.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const tones: Record<string, string> = {
              primary: "card-primary",
              gold: "card-gold",
              dark: "card-dark",
            };
            return (
              <div key={i} className={`${tones[it.tone]} relative overflow-hidden p-6`}>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{it.tag}</div>
                <h3 className="mt-3 text-xl font-extrabold leading-tight text-balance text-current">{it.title}</h3>
                <div className="mt-8 flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                    <it.icon size={18} />
                  </div>
                  <Link to="/auth/register" className="inline-flex items-center gap-1 text-xs font-bold opacity-90 hover:opacity-100">
                    Join <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>From the streets</Eyebrow>
          <h2 className="mt-3 text-h1 font-extrabold text-balance">Real Africans. Real cash. Real cleaner streets.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="card flex flex-col p-7">
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <blockquote className="mt-5 flex-1 text-lg font-medium leading-snug text-charcoal text-balance">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-bordergray pt-5">
                <img
                  src={t.photo}
                  alt={`Portrait of ${t.name}`}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-mint"
                />
                <div className="flex-1">
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-textgray">{t.city}</div>
                </div>
                <div className="rounded-lg bg-accent-50 px-2 py-1 text-right">
                  <div className="font-mono text-sm font-extrabold text-accent-600">{formatNaira(t.payout)}</div>
                  <div className="text-[9px] font-bold uppercase text-accent-600/70">earned</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCTA() {
  return (
    <section className="section bg-charcoal text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-40" />
      <Blob className="right-[-15%] top-[-15%] h-[500px] w-[500px]" color="from-primary/30 to-primary/0" />
      <Blob className="left-[-10%] bottom-[-20%] h-[400px] w-[400px]" color="from-accent/25 to-accent/0" />
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <Eyebrow className="!text-accent">For brands & manufacturers</Eyebrow>
          <h2 className="mt-3 text-display font-extrabold leading-[0.98] text-balance">
            Hit your EPR targets — with photos, weights and signatures to prove it.
          </h2>
          <p className="mt-5 max-w-xl text-white/70">
            Recovang is Africa's first transparent, real-time ledger that gives FMCG brands proof of every kilogram recovered against their post-consumer waste obligations. Born and built in Nigeria, scaling across the continent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-gold">Talk to brand partnerships <ArrowRight size={16} /></Link>
            <Link to="/about" className="btn-outline !border-white/20 !bg-white/5 !text-white">Read the whitepaper</Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Live brand ledger</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="font-mono text-4xl font-extrabold">142,800</div>
              <div className="text-sm text-white/60">kg recovered for partners YTD</div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { brand: "Coca-Cola Nigeria", kg: "48,200 kg", goal: 78 },
                { brand: "Nestlé Nigeria", kg: "31,400 kg", goal: 64 },
                { brand: "Indomie", kg: "22,100 kg", goal: 52 },
              ].map((b) => (
                <div key={b.brand} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold">{b.brand}</span>
                    <span className="font-mono text-xs">{b.kg}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-grad-gold" style={{ width: `${b.goal}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-white/50">{b.goal}% of FY26 target</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="card relative overflow-hidden p-10 sm:p-16">
          <Blob className="right-[-10%] top-[-30%] h-[420px] w-[420px]" color="from-primary/20 to-primary/0" />
          <Blob className="left-[-15%] bottom-[-30%] h-[300px] w-[300px]" color="from-accent/25 to-accent/0" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="text-display font-extrabold leading-[0.95] text-balance">
                Your bottles are <span className="text-primary">money.</span> <br />
                Pick them up.
              </h2>
              <p className="mt-5 max-w-xl text-textgray text-lg">
                Open an account in 60 seconds. No fees, no minimums, no NIN required to start.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/auth/register" className="btn-primary btn-lg">Create my account <ArrowRight size={16} /></Link>
                <Link to="/how-it-works" className="btn-outline btn-lg">How it works</Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-textgray">
                <span className="flex items-center gap-1"><Smartphone size={13} /> Works on Android 10+</span>
                <span className="flex items-center gap-1"><Zap size={13} /> Offline-first</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={13} className="text-success" /> No data plan needed</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-grad-primary-deep p-8 text-white">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Earnings calculator</div>
                <div className="mt-3 text-sm text-white/70">If you bring 5 kg of PET plastic and 1 kg of cans every week:</div>
                <div className="mt-5 font-mono text-4xl font-extrabold leading-none">
                  <span className="text-accent">₦</span>6,400
                  <span className="ml-2 align-middle text-base font-bold text-white/70">/ month</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white/8 p-3">
                    <div className="text-white/60">PET · 5 kg/wk</div>
                    <div className="font-mono font-bold">₦4,000/mo</div>
                  </div>
                  <div className="rounded-xl bg-white/8 p-3">
                    <div className="text-white/60">Cans · 1 kg/wk</div>
                    <div className="font-mono font-bold">₦2,400/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
