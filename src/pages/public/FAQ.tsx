import { useState } from "react";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";
import { cn } from "@/lib/cn";

const GROUPS = [
  {
    name: "Getting started",
    items: [
      { q: "Do I need a smartphone to use Recovang?", a: "Recommended but not required. You can drop at any hub using just your phone number — the agent will register your drop on your behalf and send you a USSD code to cash out. The full Recovang app works on Android 10+ devices with as little as 1GB RAM." },
      { q: "Is there a minimum amount of waste I need to bring?", a: "No. We accept drops from 100 grams upwards. The minimum payout is ₦20 — we round up to the nearest naira." },
      { q: "Do I need NIN or BVN to register?", a: "Not to start earning. To withdraw more than ₦5,000 in a single transaction, we'll ask for your NIN to comply with CBN regulations. We never store the actual number — only a verified token." },
    ],
  },
  {
    name: "Pricing & payments",
    items: [
      { q: "How are prices set?", a: "Our pricing engine refreshes every Monday morning based on factory off-take demand, exchange rates and local supply at each hub. Prices are fixed at the moment your drop is verified — even if the price drops later that day, you keep the higher rate." },
      { q: "When does my money arrive?", a: "Wallet credit happens in under 8 seconds. Bank withdrawals are usually instant during banking hours, and within 30 minutes outside. Airtime, data and bills are always instant." },
      { q: "Are there any fees?", a: "₦0 to credit your wallet, ₦0 to buy airtime/data/bills. Bank withdrawals up to ₦50,000 per week are free. Above that, we charge ₦25 per transfer." },
    ],
  },
  {
    name: "Trust & disputes",
    items: [
      { q: "What if the agent weighs my drop wrong?", a: "Open the drop in your wallet history and tap 'Raise dispute'. You'll see the photo our agent took, the weight, and the calculation. Our ops team responds within 4 hours, on average. If you're right, we adjust and pay the difference." },
      { q: "How do you stop fraud?", a: "Every drop is photographed, weighed on a calibrated scale, geo-tagged and time-stamped. Our fraud engine flags duplicate drops, unusual weight ratios, and rapid-fire submissions. Suspended accounts get a clear appeal path." },
      { q: "What happens if a hub closes?", a: "Your wallet balance is yours forever. Hubs are hub branding only — money sits in your Recovang wallet, not at the hub." },
    ],
  },
  {
    name: "Becoming an agent or partner",
    items: [
      { q: "How do I open a Recovang hub?", a: "Apply via /auth/register and select 'Run a hub'. Requirements: a 20m² covered space, a calibrated scale (we provide if needed), reliable power, and 12 hours of training. Setup typically takes two weeks." },
      { q: "I have a truck — can I do logistics?", a: "Yes. Register as a logistics partner. Minimum requirement is one verified vehicle (1.5T or larger), a licensed driver, and comprehensive insurance. Earnings: ₦35–₦65 per kilometre + ₦15 per kilo." },
      { q: "We're an FMCG brand — how do EPR partnerships work?", a: "Email brand@recovang.com. We provide a verifiable, real-time ledger of every kilo recovered against your brand's post-consumer waste obligations, with photos and weighing receipts. Used by Coca-Cola, Nestlé and Indomie." },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("0-0");

  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-12 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="left-[-10%] top-[-10%] h-[400px] w-[400px]" color="from-primary/30 to-primary/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Frequently asked</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            Everything you wanted to know — <span className="text-primary">straight, no marketing.</span>
          </h1>
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textgray" />
              <input className="input h-12 pl-11 text-base" placeholder="Search the FAQ…" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-1">
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-textgray">Topics</div>
              {GROUPS.map((g, i) => (
                <a key={i} href={`#group-${i}`} className="block rounded-xl px-3 py-2 text-sm font-semibold text-charcoal hover:bg-cream">
                  {g.name}
                </a>
              ))}
            </div>
          </aside>
          <div className="lg:col-span-9 space-y-12">
            {GROUPS.map((g, gi) => (
              <div key={gi} id={`group-${gi}`}>
                <h2 className="mb-4 text-h3">{g.name}</h2>
                <div className="card divide-y divide-bordergray overflow-hidden">
                  {g.items.map((it, ii) => {
                    const id = `${gi}-${ii}`;
                    const open = openId === id;
                    return (
                      <button
                        key={ii}
                        onClick={() => setOpenId(open ? null : id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-4 px-6 py-5">
                          <span className="flex-1 text-base font-bold text-charcoal">{it.q}</span>
                          <ChevronDown size={18} className={cn("text-textgray transition", open && "rotate-180 text-primary")} />
                        </div>
                        {open && (
                          <div className="px-6 pb-6 text-sm leading-relaxed text-textgray text-pretty">{it.a}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <div className="card relative overflow-hidden p-10 text-center">
            <div className="absolute inset-0 bg-grad-mint opacity-50" />
            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-grad-primary text-white shadow-glow">
                <MessageCircle size={22} />
              </div>
              <h2 className="mt-5 text-h2 text-balance">Couldn't find your answer?</h2>
              <p className="mx-auto mt-2 max-w-md text-textgray">Our support team responds in under 5 minutes on WhatsApp.</p>
              <div className="mt-6 flex justify-center gap-3">
                <a href="https://wa.me/2347007326826" className="btn-primary">WhatsApp us</a>
                <Link to="/contact" className="btn-outline">Send a message</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
