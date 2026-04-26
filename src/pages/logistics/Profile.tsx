import { PageHeader, Section } from "@/components/ui";

export default function LogisticsProfile() {
  return (
    <>
      <PageHeader title="Partner profile" subtitle="Update your company details, payment account and service area." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Company">
          <div className="space-y-4">
            <Field label="Company name" defaultValue="Kunle Logistics Ltd" />
            <Field label="RC Number" defaultValue="RC1820394" mono />
            <Field label="Contact phone" defaultValue="+234 803 555 6666" mono />
            <Field label="Email" defaultValue="ops@kunlelogistics.ng" />
          </div>
        </Section>
        <Section title="Service & payout">
          <div className="space-y-4">
            <Field label="Cities served" defaultValue="Lagos, Ogun, Oyo" />
            <Field label="Bank" defaultValue="GTBank" />
            <Field label="Account number" defaultValue="0123456789" mono />
            <Field label="Pickup capacity (kg/day)" defaultValue="6,000" mono />
          </div>
        </Section>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-outline">Cancel</button>
        <button className="btn-primary">Save changes</button>
      </div>
    </>
  );
}

function Field({ label, mono, ...p }: { label: string; mono?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className={`input ${mono ? "font-mono" : ""}`} {...p} />
    </div>
  );
}
