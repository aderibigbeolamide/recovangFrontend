import { ArrowRight, Calendar, Clock } from "lucide-react";

const POSTS = [
  { t: "How Adaeze made ₦87,000 last month — just from PET bottles", d: "Apr 18, 2026", r: "5 min read", c: "Stories" },
  { t: "Inside Recovang: how we verify every kilo with AI + agent eyes", d: "Apr 11, 2026", r: "8 min read", c: "Engineering" },
  { t: "EPR explained: what Nigerian brands need to do in 2026", d: "Apr 04, 2026", r: "12 min read", c: "Policy" },
  { t: "From bottle to fabric: tracing one PET load across 3 cities", d: "Mar 28, 2026", r: "6 min read", c: "Impact" },
  { t: "Why your hub agent is the most important person on the platform", d: "Mar 19, 2026", r: "7 min read", c: "People" },
  { t: "The 7 categories of e-waste — and why they pay so much", d: "Mar 11, 2026", r: "9 min read", c: "Education" },
];

export default function Blog() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge bg-mint text-primary">Blog</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          Stories, insights, and the future of recovery.
        </h1>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p, i) => (
          <article key={p.t} className="card transition-shadow hover:shadow-card">
            <div
              className="aspect-[16/9] rounded-xl"
              style={{
                background: i % 2 === 0
                  ? "linear-gradient(135deg, #1A6B3C 0%, #114829 100%)"
                  : "linear-gradient(135deg, #D4A017 0%, #8F6B0E 100%)",
              }}
            />
            <span className="mt-4 inline-block badge bg-mint text-primary">{p.c}</span>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug">{p.t}</h3>
            <div className="mt-4 flex items-center justify-between text-xs text-textgray">
              <span className="flex items-center gap-2">
                <Calendar size={12} /> {p.d}
                <Clock size={12} /> {p.r}
              </span>
              <ArrowRight size={14} className="text-primary" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
