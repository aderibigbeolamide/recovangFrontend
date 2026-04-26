import { useState } from "react";
import { Camera, CheckCircle2, ScanLine, X } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

export default function AgentVerify() {
  const [step, setStep] = useState(1);
  return (
    <>
      <PageHeader title="Verify submission" subtitle="Scan the collector's QR, enter the actual weight, then approve or reject." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Section title="Step 1 · Scan QR">
          <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-mint/40">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-primary shadow-soft">
                <ScanLine size={26} />
              </div>
              <p className="mt-3 font-display font-bold">Point camera at QR</p>
              <p className="text-xs text-textgray">QR will auto-detect within 2 seconds.</p>
              <button onClick={() => setStep(2)} className="btn-primary mt-4">Simulate scan</button>
            </div>
          </div>
        </Section>

        <div className="space-y-6">
          <Section title="Step 2 · Confirm details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Collector" value="Adaeze Nwosu" />
              <Info label="Submission ID" value="RX-2419" mono />
              <Info label="Phone" value="+234 801 234 5678" mono />
              <Info label="Claimed material" value="PET Plastic" />
              <Info label="Claimed weight" value="4.2 kg" mono />
              <Info label="Estimated payout" value={formatNaira(840)} mono accent />
            </div>
          </Section>
          <Section title="Step 3 · Actual weight & photo">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Actual weight (kg)</label>
                <input className="input font-mono" defaultValue="4.2" />
              </div>
              <div>
                <label className="label">Material confirmed</label>
                <select className="input"><option>PET Plastic</option><option>HDPE Plastic</option><option>Mixed Paper</option></select>
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bordergray bg-offwhite px-4 py-6 text-sm font-semibold text-textgray hover:border-primary hover:text-primary">
              <Camera size={18} /> Take photo of load
            </button>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="btn-outline text-error border-error/40 hover:bg-error/5"><X size={16} /> Reject</button>
              <button className="btn-primary"><CheckCircle2 size={16} /> Approve & pay</button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

function Info({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-bordergray bg-offwhite p-3">
      <div className="text-xs uppercase tracking-wider text-textgray">{label}</div>
      <div className={`mt-1 font-bold ${mono ? "font-mono" : ""} ${accent ? "text-accent-500" : "text-charcoal"}`}>{value}</div>
    </div>
  );
}
