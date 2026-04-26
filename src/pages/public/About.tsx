import { Link } from "react-router-dom";
import { ArrowRight, Globe2, HeartHandshake, Leaf, Target } from "lucide-react";

export default function About() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge bg-mint text-primary">About Recovang</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          We turn waste into wealth — one bottle at a time.
        </h1>
        <p className="mt-4 text-lg text-textgray">
          Born in Lagos, built for Africa. Recovang is the platform connecting waste collectors, hub agents,
          logistics partners and producer brands into one transparent recovery economy.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary">
            <Target size={20} />
          </div>
          <h2 className="font-display text-2xl font-bold">Our mission</h2>
          <p className="mt-2 text-textgray">
            Make recycling pay. Every kilo recovered = a real payout to a real Nigerian. We measure success in
            naira earned, not feel-good slogans.
          </p>
        </div>
        <div className="card">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary">
            <Globe2 size={20} />
          </div>
          <h2 className="font-display text-2xl font-bold">Our vision</h2>
          <p className="mt-2 text-textgray">
            Africa's largest verified recovery network — a fair price for every material in every street, from
            Surulere to Kampala.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl font-extrabold">What drives us</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <HeartHandshake size={20} />,
              t: "People first",
              b: "Collectors are not data points. They are the heart of the platform.",
            },
            {
              icon: <Leaf size={20} />,
              t: "Real impact",
              b: "Every transaction is auditable. Every report is backed by receipts.",
            },
            {
              icon: <Globe2 size={20} />,
              t: "Africa scale",
              b: "Built locally, designed to scale across every African market.",
            },
          ].map((v) => (
            <div key={v.t} className="card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-primary">
                {v.icon}
              </div>
              <h3 className="font-display text-lg font-bold">{v.t}</h3>
              <p className="mt-1 text-sm text-textgray">{v.b}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl bg-gradient-primary p-10 text-white">
        <h2 className="font-display text-3xl font-extrabold">Join the recovery economy.</h2>
        <p className="mt-2 max-w-xl text-white/80">
          Whether you collect, verify, transport or buy recovered material — there's a place for you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/auth/register" className="btn-gold">
            Get started <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="btn-ghost text-white hover:bg-white/10">
            Talk to our team
          </Link>
        </div>
      </div>
    </div>
  );
}
