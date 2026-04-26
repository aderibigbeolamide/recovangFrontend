import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const FAQS = [
  { q: "How quickly do I get paid after submission?", a: "Within 60 seconds of agent verification. Money goes straight to your Recovang wallet, ready to withdraw or spend." },
  { q: "What documents do I need to sign up?", a: "Just a phone number and a valid Nigerian ID (NIN, BVN, voter's card or driver's licence). No upfront fees, ever." },
  { q: "Is the price per kilo the same nationwide?", a: "Base prices are nationwide, but premium hub locations may offer surcharges based on factory demand." },
  { q: "What happens if I disagree with a verified weight?", a: "You can raise a dispute from your submission history. Our review team responds within 24 working hours." },
  { q: "Can I withdraw to airtime or pay bills directly?", a: "Yes. Withdraw to bank, buy airtime/data on any network, or pay DSTV, GoTV, IBEDC and other utility bills directly from your wallet." },
  { q: "Is Recovang available outside Lagos?", a: "We're live in Lagos, Abuja and Port Harcourt — and expanding to Kano, Ibadan and Enugu through Q3 2026." },
  { q: "How do I become a hub agent?", a: "Apply via the Get started page and select Agent. We'll review your hub location and onboard you within 5 working days." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="badge bg-mint text-primary">Frequently asked</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">Common questions</h1>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
              <button className="flex w-full items-center justify-between text-left">
                <span className="font-display font-bold">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={cn("transition-transform", open === i && "rotate-180 text-primary")}
                />
              </button>
              {open === i && <p className="mt-3 text-sm text-textgray">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
