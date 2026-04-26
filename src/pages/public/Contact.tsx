import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <span className="badge bg-mint text-primary">Get in touch</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
            We'd love to hear from you.
          </h1>
          <p className="mt-4 max-w-md text-textgray">
            Whether you're a collector with a question, a hub owner wanting to partner, or a brand exploring EPR
            compliance — drop us a line.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: <Mail size={18} />, label: "Email", value: "hello@recovang.com" },
              { icon: <Phone size={18} />, label: "Call us", value: "+234 800 RECOVANG" },
              { icon: <MessageCircle size={18} />, label: "WhatsApp", value: "+234 901 234 5678" },
              { icon: <MapPin size={18} />, label: "HQ", value: "12 Ozumba Mbadiwe, Victoria Island, Lagos" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 rounded-xl border border-bordergray bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-primary">
                  {c.icon}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-textgray">{c.label}</div>
                  <div className="font-semibold">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="card space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" placeholder="Adaeze Nwosu" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="adaeze@example.com" />
          </div>
          <div>
            <label className="label">I am a...</label>
            <select className="input">
              <option>Collector</option>
              <option>Hub agent / owner</option>
              <option>Logistics partner</option>
              <option>Brand / Producer</option>
              <option>Press / Investor</option>
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[140px]" placeholder="Tell us how we can help..." />
          </div>
          <button type="button" className="btn-primary w-full">
            Send message
          </button>
          <p className="text-center text-xs text-textgray">
            We typically respond within 4 working hours.
          </p>
        </form>
      </div>
    </div>
  );
}
