import { Link } from "react-router-dom";
import { ArrowRight, ScanLine, Coins, MapPin, Truck, Factory, Recycle } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge bg-mint text-primary">How it works</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          From your trash bag to a verified payout — in 6 steps.
        </h1>
        <p className="mt-4 text-textgray">
          Every step is GPS, weight and photo verified. Every payout is logged and traceable.
        </p>
      </div>

      <ol className="mt-16 grid gap-5 md:grid-cols-2">
        {[
          { i: <Recycle size={18} />, t: "Sort at home", b: "Separate plastics, cans, paper and e-waste into clean bags." },
          { i: <MapPin size={18} />, t: "Find a hub", b: "Use the Find a hub map to locate your nearest verified Recovang point." },
          { i: <ScanLine size={18} />, t: "Submit & weigh", b: "Hub agent scans your QR, weighs and photographs your load." },
          { i: <Coins size={18} />, t: "Get paid instantly", b: "Naira lands in your wallet within 60 seconds of verification." },
          { i: <Truck size={18} />, t: "We collect & ship", b: "Logistics partners pick up the load and deliver it to certified factories." },
          { i: <Factory size={18} />, t: "Reborn as new product", b: "Material is recycled into new bottles, cans, paper or fabric." },
        ].map((s, idx) => (
          <li key={s.t} className="card relative pl-16">
            <span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-primary">
              {s.i}
            </span>
            <span className="absolute left-5 top-16 font-mono text-xs font-bold text-textgray">
              Step {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-bold">{s.t}</h3>
            <p className="mt-1 text-sm text-textgray">{s.b}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 rounded-3xl bg-gradient-primary p-10 text-white">
        <h2 className="font-display text-3xl font-extrabold">Ready to start earning?</h2>
        <p className="mt-2 max-w-lg text-white/80">
          Sign up in 60 seconds. We'll find your nearest hub and walk you through your first submission.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/auth/register" className="btn-gold">
            Create free account <ArrowRight size={16} />
          </Link>
          <Link to="/find-hub" className="btn-ghost text-white hover:bg-white/10">
            <MapPin size={16} /> Find a hub
          </Link>
        </div>
      </div>
    </div>
  );
}
