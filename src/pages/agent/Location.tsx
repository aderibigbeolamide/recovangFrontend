import { MapPin, Radio } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";

export default function AgentLocation() {
  return (
    <>
      <PageHeader title="Hub & agent location" subtitle="Live GPS visible to the Recovang admin team and approved logistics partners." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title="Live position">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mint/40 bg-[radial-gradient(circle_at_40%_50%,#1A6B3C22,transparent_60%),radial-gradient(circle_at_70%_30%,#D4A01722,transparent_60%)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-card">
                  <MapPin size={20} />
                </div>
                <p className="mt-3 font-display font-bold">Surulere Hub</p>
                <p className="text-sm text-textgray">6.4951° N, 3.3556° E</p>
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-success">
                  <Radio size={12} className="animate-pulse" /> Broadcasting · last ping 3s ago
                </p>
              </div>
            </div>
          </div>
        </Section>
        <Section title="Settings">
          <ToggleRow label="Share live location with admin" enabled />
          <ToggleRow label="Share with assigned logistics partners" enabled />
          <ToggleRow label="Show hub on public hub-finder map" enabled />
          <ToggleRow label="Show real-time capacity to collectors" />
          <button className="btn-outline mt-4 w-full">Save settings</button>
        </Section>
      </div>
    </>
  );
}

function ToggleRow({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-bordergray py-3 last:border-0">
      <span className="text-sm">{label}</span>
      <span className={`relative h-6 w-11 rounded-full ${enabled ? "bg-primary" : "bg-bordergray"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
      </span>
    </div>
  );
}
