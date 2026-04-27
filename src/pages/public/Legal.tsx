import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";

const TERMS = [
  { h: "1. Acceptance", b: "By creating a Recovang account, you agree to these terms. We may amend them with 30 days' notice via in-app banner and email. Continued use after the effective date constitutes acceptance." },
  { h: "2. Eligibility", b: "You must be 16 or older. If under 18, a parent or guardian must register on your behalf and consent to payouts being routed through their account." },
  { h: "3. Pricing", b: "Per-kilo rates are set by Recovang's pricing engine and refreshed weekly. Rates displayed at the moment of drop verification are binding for that drop, even if rates change later that day." },
  { h: "4. Wallet & withdrawals", b: "Funds in your Recovang wallet are held in trust by our partner bank. You may withdraw at any time subject to standard CBN limits. Withdrawals above ₦5,000/transaction require NIN verification." },
  { h: "5. Acceptable use", b: "You may not submit waste obtained through theft, fraud, or impersonation. Recovang reserves the right to suspend accounts under investigation and reverse payouts on confirmed fraudulent submissions." },
  { h: "6. Disputes", b: "Disputes raised within 14 days of a drop are reviewed by our operations team. Photo and weighing evidence is binding unless tampering is proven. Appeals may be escalated to legal@recovang.com." },
  { h: "7. Termination", b: "Either party may terminate this agreement at any time. On termination, any wallet balance is paid out to your registered bank account within 7 business days." },
];

const PRIVACY = [
  { h: "1. What we collect", b: "Account data (name, phone, email, optional NIN), drop data (weight, photo, geo, timestamp), wallet & payout data, device and network telemetry needed to keep our offline-first sync working." },
  { h: "2. Why we collect it", b: "To verify drops, prevent fraud, pay you, comply with CBN/AML regulations, and improve the platform. We do not sell, lease, or rent your personal data." },
  { h: "3. Photos of drops", b: "Photos are stored encrypted at rest. They are visible to you, the verifying agent, our ops team, and — for brand-attributed material — the brand's EPR dashboard. Faces and license plates are auto-blurred." },
  { h: "4. Sharing", b: "We share aggregate, anonymised statistics with brand partners and regulators. Personal data is shared only with payment processors (Paystack), KYC providers (Smile Identity), and law enforcement on lawful request." },
  { h: "5. Retention", b: "Account data is retained while your account is active and 7 years after closure for AML compliance. You may request deletion of all non-required data via privacy@recovang.com." },
  { h: "6. Your rights", b: "Access, rectify, port, restrict and delete your personal data. Email privacy@recovang.com — we respond within 14 days as required by NDPR." },
];

export default function Legal({ kind }: { kind: "terms" | "privacy" }) {
  const isTerms = kind === "terms";
  const sections = isTerms ? TERMS : PRIVACY;
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-20 pb-12 sm:pt-28">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="left-[-10%] top-[-10%] h-[400px] w-[400px]" color="from-primary/30 to-primary/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>{isTerms ? "Legal" : "Your data"}</Eyebrow>
          <h1 className="mt-5 text-display-xl font-extrabold leading-[0.95] tracking-tighter text-balance">
            {isTerms ? "Terms of service" : "Privacy policy"}
          </h1>
          <p className="mt-6 text-lg text-textgray">
            {isTerms
              ? "The plain-English contract between you and Recovang. Last updated April 2026."
              : "How we collect, use and protect your data — written in language you can actually read. NDPR-compliant. Last updated April 2026."}
          </p>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-1">
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-textgray">Sections</div>
              {sections.map((s, i) => (
                <a key={i} href={`#s-${i}`} className="block rounded-xl px-3 py-2 text-sm font-semibold text-charcoal hover:bg-cream">
                  {s.h}
                </a>
              ))}
            </div>
          </aside>
          <article className="card prose-lg max-w-none p-8 lg:col-span-9 lg:p-12">
            {sections.map((s, i) => (
              <section key={i} id={`s-${i}`} className="border-b border-bordergray py-8 first:pt-0 last:border-b-0 last:pb-0">
                <h2 className="text-h3">{s.h}</h2>
                <p className="mt-3 text-base leading-relaxed text-textgray text-pretty">{s.b}</p>
              </section>
            ))}
            <div className="mt-10 rounded-2xl bg-cream p-6 text-sm text-textgray">
              Questions? Contact <a href={`mailto:${isTerms ? "legal" : "privacy"}@recovang.com`} className="font-bold text-primary">{isTerms ? "legal" : "privacy"}@recovang.com</a>. We respond within 14 days.
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
