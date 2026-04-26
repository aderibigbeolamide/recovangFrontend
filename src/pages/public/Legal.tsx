interface LegalProps {
  kind: "terms" | "privacy";
}

export default function Legal({ kind }: LegalProps) {
  const isTerms = kind === "terms";
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <span className="badge bg-mint text-primary">{isTerms ? "Legal" : "Privacy"}</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold">
          {isTerms ? "Terms of Service" : "Privacy Policy"}
        </h1>
        <p className="mt-2 text-textgray">Last updated: April 26, 2026</p>

        <div className="prose prose-slate mt-10 max-w-none space-y-6 text-charcoal/90">
          {(isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS).map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-xl font-bold">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-textgray">{s.b}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const TERMS_SECTIONS = [
  { h: "1. Eligibility", b: "You must be at least 18 years old and resident in Nigeria (or a supported country) to register a Recovang account." },
  { h: "2. Account & Wallet", b: "You are responsible for safeguarding your login credentials. Recovang is not liable for losses resulting from unauthorized account access." },
  { h: "3. Submissions", b: "All material submitted must be clean, unmixed and accurately described. Fraudulent submissions may result in account suspension and forfeiture of pending balances." },
  { h: "4. Payouts", b: "Verified payouts are credited to your wallet in real-time. Withdrawals to bank or third-party services are subject to provider processing windows." },
  { h: "5. Disputes", b: "Weight or category disputes must be raised within 7 days of agent verification. Recovang's review decision is final." },
  { h: "6. Termination", b: "We reserve the right to suspend any account engaged in fraudulent, abusive or unlawful activity." },
];

const PRIVACY_SECTIONS = [
  { h: "1. What we collect", b: "Name, phone, email, ID number (for KYC), bank details (for payouts), and submission metadata (location, weight, photos)." },
  { h: "2. How we use it", b: "To verify your identity, process payouts, prevent fraud, generate impact reports, and improve the service." },
  { h: "3. Sharing", b: "We share data with regulated payment processors (e.g. Paystack) and government agencies where legally required." },
  { h: "4. Storage & security", b: "Data is encrypted at rest and in transit. Access is restricted to authorized personnel only." },
  { h: "5. Your rights", b: "You may request export, correction or deletion of your personal data at any time via privacy@recovang.com." },
  { h: "6. Cookies", b: "We use minimal cookies for session management and anonymous analytics. We do not sell your data to advertisers." },
];
