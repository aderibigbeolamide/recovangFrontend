import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";

const POSTS = [
  {
    slug: "1", category: "Impact",
    title: "How a Surulere mother turned ₦240,000 of plastic waste into school fees",
    excerpt: "Folake Adeola dropped 1,184kg of PET plastic over six months at her local hub. Here's the breakdown — and what the local council learned from her route.",
    date: "Apr 24, 2026", read: "6 min read",
    accent: "from-primary to-primary-700",
  },
  {
    slug: "2", category: "Pricing",
    title: "Why we just raised PET plastic to ₦200/kg in Lagos — and what's next",
    excerpt: "Recyclate demand from local factories tripled in Q1. We pass it on. The full Q2 pricing memo, including HDPE, paper and aluminium adjustments.",
    date: "Apr 22, 2026", read: "4 min read",
    accent: "from-accent to-accent-600",
  },
  {
    slug: "3", category: "Engineering",
    title: "Building a payments engine that works on 0.4 Mbps GSM",
    excerpt: "Most fintech rails assume 4G. We engineered Recovang for the real Lagos network — including the offline-first sync layer that lets a Tecno Spark queue 200 drops without losing a kobo.",
    date: "Apr 18, 2026", read: "9 min read",
    accent: "from-charcoal to-charcoal-700",
  },
  {
    slug: "4", category: "Partnership",
    title: "Coca-Cola Nigeria signs ₦1.4B EPR partnership with Recovang",
    excerpt: "The largest extended producer responsibility deal in Nigerian history. Why CCN chose us, what gets recovered, and the public ledger every drop will land in.",
    date: "Apr 15, 2026", read: "5 min read",
    accent: "from-success to-primary",
  },
  {
    slug: "5", category: "Operations",
    title: "Anatomy of a Recovang hub: a day in 47 photos",
    excerpt: "We followed Bola in Surulere from 6:30am to 7:15pm. 184 collectors, 642kg recovered, ₦88,400 paid out — and three reasons the agent role is the best job in the supply chain.",
    date: "Apr 11, 2026", read: "7 min read",
    accent: "from-info to-primary",
  },
  {
    slug: "6", category: "Policy",
    title: "Why Lagos State signed an MOU with Recovang — the inside story",
    excerpt: "LAWMA's commissioner explains the framework, the metrics, and what 'public-private waste recovery' really means for Lagosians.",
    date: "Apr 4, 2026", read: "8 min read",
    accent: "from-warning to-accent",
  },
];

export default function Blog() {
  const [hero, ...rest] = POSTS;
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-12 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="right-[-15%] top-[-15%] h-[450px] w-[450px]" color="from-accent/30 to-accent/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Stories from the field</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            How recycling actually works in Nigeria.
          </h1>
          <p className="mt-6 text-lg text-textgray">
            Operator notes, pricing memos, collector spotlights, and the occasional engineering deep-dive. Written by the people building Recovang.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          {/* Hero post */}
          <Link to={`/blog#${hero.slug}`} className="card group block overflow-hidden lg:grid lg:grid-cols-12">
            <div className={`relative bg-gradient-to-br ${hero.accent} aspect-[16/10] lg:col-span-7 lg:aspect-auto`}>
              <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-20" />
              <div className="absolute bottom-6 left-6">
                <span className="badge-charcoal">{hero.category}</span>
              </div>
            </div>
            <div className="p-8 lg:col-span-5 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-textgray">
                <Clock size={12} /> {hero.date} · {hero.read}
              </div>
              <h2 className="mt-3 text-h2 leading-tight text-balance group-hover:text-primary">{hero.title}</h2>
              <p className="mt-4 text-textgray text-pretty">{hero.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1 font-bold text-primary">
                Read story <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link to={`/blog#${p.slug}`} key={p.slug} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-card">
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.accent}`}>
                  <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-20" />
                  <div className="absolute bottom-4 left-4">
                    <span className="badge bg-white/95 text-charcoal">{p.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-textgray">
                    <Clock size={11} /> {p.date} · {p.read}
                  </div>
                  <h3 className="mt-2 text-h4 leading-snug text-balance group-hover:text-primary">{p.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm text-textgray">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
