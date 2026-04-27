import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";

const OFFICES = [
  { city: "Lagos HQ", addr: "12 Adeola Odeku St, Victoria Island", line: "+234 700 RECOVANG", email: "lagos@recovang.com", hours: "Mon – Fri · 8am – 6pm" },
  { city: "Abuja", addr: "Plot 47 Ademola Adetokunbo, Wuse 2", line: "+234 700 RECOVANG", email: "abuja@recovang.com", hours: "Mon – Fri · 8am – 6pm" },
  { city: "Port Harcourt", addr: "Old Aba Road, GRA Phase 2", line: "+234 700 RECOVANG", email: "ph@recovang.com", hours: "Mon – Fri · 8am – 6pm" },
];

const TOPICS = [
  { t: "I'm a collector — I need help with a payment", v: "support" },
  { t: "I want to open a hub / become an agent", v: "agent" },
  { t: "I have a logistics fleet to partner", v: "logistics" },
  { t: "I represent a brand / FMCG / EPR enquiry", v: "brand" },
  { t: "Press, partnerships or investor relations", v: "press" },
];

export default function Contact() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-12 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="right-[-10%] top-[-15%] h-[500px] w-[500px]" color="from-accent/30 to-accent/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            Real Nigerians on the other side. <br />
            <span className="text-primary">Average reply: 47 minutes.</span>
          </h1>
          <p className="mt-6 text-lg text-textgray">
            Pick the channel that suits you. Our support team works in English, Yoruba, Igbo, Hausa and Pidgin.
          </p>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form className="card p-8 space-y-5">
              <div>
                <label className="label">Your name</label>
                <input className="input" placeholder="Adaeze Nwosu" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="adaeze@example.com" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" className="input" placeholder="+234 …" />
                </div>
              </div>
              <div>
                <label className="label">What do you need?</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TOPICS.map((t) => (
                    <label key={t.v} className="flex cursor-pointer items-start gap-2 rounded-2xl border border-bordergray bg-white p-3 hover:border-primary">
                      <input type="radio" name="topic" className="mt-1 accent-primary" />
                      <span className="text-sm font-semibold text-charcoal">{t.t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Tell us more</label>
                <textarea className="input min-h-[140px] py-3 leading-relaxed" placeholder="A few details so we can route this to the right team…" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-textgray">By submitting, you agree to our privacy policy.</p>
                <button type="button" className="btn-primary">Send message <ArrowRight size={14} /></button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <a href="https://wa.me/2347007326826" className="card flex items-center gap-4 p-6 hover:border-primary">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-success-50 text-success">
                <MessageCircle size={20} />
              </div>
              <div className="flex-1">
                <div className="text-h4">WhatsApp support</div>
                <div className="text-sm text-textgray">+234 700 RECOVANG · Replies in &lt; 5 mins</div>
              </div>
              <ArrowRight size={16} className="text-textgray" />
            </a>
            <a href="mailto:hello@recovang.com" className="card flex items-center gap-4 p-6 hover:border-primary">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-primary">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <div className="text-h4">Email us</div>
                <div className="text-sm text-textgray">hello@recovang.com</div>
              </div>
              <ArrowRight size={16} className="text-textgray" />
            </a>
            <div className="card-dark p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">For brands</div>
              <h3 className="mt-2 text-h3 text-white">EPR & partnership enquiries</h3>
              <p className="mt-3 text-sm text-white/70">brand@recovang.com — Sade Ijeoma, Head of Brand & Partnerships, replies personally within 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <Eyebrow>Our offices</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-h1 font-extrabold text-balance">Walk in. We'll make you suya jollof if you bring bottles.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="card p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-grad-primary text-white">
                  <MapPin size={20} />
                </div>
                <h3 className="mt-5 text-h4">{o.city}</h3>
                <p className="mt-1 text-sm text-textgray">{o.addr}</p>
                <div className="mt-5 space-y-1 border-t border-bordergray pt-5 text-sm">
                  <div className="flex items-center gap-2"><Phone size={13} className="text-primary" /> {o.line}</div>
                  <div className="flex items-center gap-2"><Mail size={13} className="text-primary" /> {o.email}</div>
                  <div className="text-xs text-textgray">{o.hours}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
