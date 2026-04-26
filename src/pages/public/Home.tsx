import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Recycle,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { formatNaira } from "@/lib/cn";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Categories />
      <ImpactStats />
      <Testimonials />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint via-white to-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24 md:gap-16">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge bg-white text-primary border border-primary/20"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live in Lagos · Abuja · Port Harcourt
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-charcoal sm:text-5xl md:text-6xl"
          >
            Drop your waste.
            <br />
            <span className="text-primary">Collect </span>
            <span className="bg-gradient-gold bg-clip-text text-transparent">real cash.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-lg text-base text-textgray sm:text-lg"
          >
            Recovang turns plastics, cans, paper and more into instant naira — paid straight to your bank,
            airtime, or bills. The smart way to clean up your street and your bank account.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/auth/register" className="btn-primary">
              Start earning <ArrowRight size={16} />
            </Link>
            <Link to="/find-hub" className="btn-outline">
              <MapPin size={16} /> Find a hub near me
            </Link>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            <MiniStat label="Paid to collectors" value={formatNaira(284_000_000)} />
            <MiniStat label="Kg recovered" value="1.2M" />
            <MiniStat label="Active hubs" value="412" />
          </div>
        </div>

        <div className="relative">
          <HeroPhoneMock />
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-lg font-bold text-charcoal">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-textgray">{label}</div>
    </div>
  );
}

function HeroPhoneMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -top-10 -right-6 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative rounded-[36px] border border-bordergray bg-white p-3 shadow-card">
        <div className="rounded-[28px] bg-gradient-dark p-5 text-white">
          <div className="flex items-center justify-between text-xs opacity-80">
            <span>9:41</span>
            <span>●●●●● 5G</span>
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-white/60">Available balance</p>
            <p className="font-mono text-4xl font-bold text-accent">{formatNaira(48750)}</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: <Coins size={16} />, label: "Withdraw" },
              { icon: <Smartphone size={16} />, label: "Airtime" },
              { icon: <Zap size={16} />, label: "Electric" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-1 rounded-xl bg-white/10 py-3 text-xs"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 rounded-[20px] bg-mint p-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold text-charcoal">Recent earnings</span>
            <span className="text-xs text-primary">View all</span>
          </div>
          {[
            { kind: "PET Bottles", weight: "4.2 kg", amount: 840 },
            { kind: "Aluminium Cans", weight: "1.1 kg", amount: 660 },
            { kind: "Cardboard", weight: "8.0 kg", amount: 480 },
          ].map((row) => (
            <div
              key={row.kind}
              className="mt-2 flex items-center justify-between rounded-xl bg-white p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Recycle size={14} />
                </div>
                <div>
                  <div className="font-semibold text-charcoal">{row.kind}</div>
                  <div className="text-xs text-textgray">{row.weight}</div>
                </div>
              </div>
              <div className="font-mono font-semibold text-success">+{formatNaira(row.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-bordergray bg-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-xs font-semibold uppercase tracking-wider text-textgray">
        <span>Trusted partners</span>
        {["Lagos Waste", "FrieslandCampina", "Coca-Cola HBC", "Nigerian Breweries", "Dangote", "FUTA"].map(
          (b) => (
            <span key={b} className="text-charcoal/60">
              {b}
            </span>
          )
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Recycle size={20} />,
      title: "Sort & submit",
      body: "Snap a photo of your bottles, cans, paper or e-waste. Drop it at any Recovang hub.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Agent verifies",
      body: "Our hub agent weighs and verifies your load on the spot — instant QR confirmation.",
    },
    {
      icon: <Coins size={20} />,
      title: "Get paid instantly",
      body: "Money lands in your wallet — withdraw to bank, buy airtime, or pay your DSTV bill.",
    },
  ];
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-mint text-primary">How it works</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
          Three taps. Real money. Zero stress.
        </h2>
        <p className="mt-3 text-textgray">
          We built Recovang for everyone — from the mama-put owner with stacks of cardboard to the office cleaner
          collecting plastic bottles after work.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card relative"
          >
            <div className="absolute -top-3 left-6 rounded-full bg-gradient-primary px-3 py-1 font-mono text-xs font-bold text-white">
              0{i + 1}
            </div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary">
              {s.icon}
            </div>
            <h3 className="font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-textgray">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    { name: "PET Plastic", price: "₦200/kg", color: "from-blue-100 to-blue-50" },
    { name: "Aluminium Cans", price: "₦600/kg", color: "from-amber-100 to-amber-50" },
    { name: "Cardboard", price: "₦60/kg", color: "from-orange-100 to-orange-50" },
    { name: "Glass Bottles", price: "₦40/kg", color: "from-emerald-100 to-emerald-50" },
    { name: "E-Waste", price: "₦1,200/kg", color: "from-purple-100 to-purple-50" },
    { name: "Mixed Paper", price: "₦50/kg", color: "from-stone-100 to-stone-50" },
  ];
  return (
    <section className="bg-mint/40 py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="badge bg-white text-primary">What we recover</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold">
              Every category. Every kilo. Real prices.
            </h2>
          </div>
          <Link to="/waste-categories" className="btn-outline">
            See full price list <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <div
              key={c.name}
              className={`rounded-2xl border border-white bg-gradient-to-br ${c.color} p-6 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-charcoal">{c.name}</h3>
                <Recycle className="text-primary/70" size={20} />
              </div>
              <p className="mt-6 font-mono text-2xl font-extrabold text-charcoal">{c.price}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-charcoal/60">
                Updated weekly
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactStats() {
  const stats = [
    { v: "1.2M+", l: "Kilograms recovered", icon: <Recycle size={18} /> },
    { v: "62K+", l: "Active collectors", icon: <Users size={18} /> },
    { v: formatNaira(284_000_000), l: "Paid to communities", icon: <Coins size={18} /> },
    { v: "412", l: "Verified hubs", icon: <MapPin size={18} /> },
  ];
  return (
    <section className="container-page py-20">
      <div className="rounded-3xl bg-gradient-dark p-10 text-white sm:p-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge bg-white/10 text-accent">Real impact</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              We pay people. We clean Nigeria.
            </h2>
            <p className="mt-3 max-w-md text-white/70">
              Every transaction is on-chain auditable. Every hub is GPS-verified. Every kilo is weighed twice.
              No vague impact reports — just receipts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/5 p-5 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  {s.icon}
                </div>
                <p className="mt-4 font-mono text-2xl font-bold text-accent">{s.v}</p>
                <p className="text-xs text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Adaeze N.",
      role: "Collector · Surulere",
      quote:
        "I used to throw away water bottles. Now I make ₦8,000 every weekend. Recovang paid for my daughter's school books.",
    },
    {
      name: "Bola A.",
      role: "Hub Agent · Yaba",
      quote:
        "The app tells me exactly what came in, what's verified, and what to ship. Fraud is almost zero.",
    },
    {
      name: "Mr. Ibrahim",
      role: "Logistics · Abuja",
      quote:
        "I get pickup requests on my phone. I accept, I deliver, I get paid the same day. Simple.",
    },
  ];
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-mint text-primary">Real stories</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
          People are already winning.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="card flex flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary font-display font-extrabold text-white">
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-charcoal">{t.name}</p>
                <p className="text-xs text-textgray">{t.role}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/80">"{t.quote}"</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-success">
              <CheckCircle2 size={14} /> Verified payout
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-page pb-24">
      <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-white sm:p-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Your trash is your treasure.
            </h2>
            <p className="mt-2 max-w-lg text-white/80">
              Join 62,000+ Nigerians earning real naira from waste. It only takes 60 seconds to sign up.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/auth/register" className="btn-gold">
              Create free account <ArrowRight size={16} />
            </Link>
            <Link to="/how-it-works" className="btn-ghost text-white hover:bg-white/10">
              <TrendingUp size={16} /> See earnings demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
