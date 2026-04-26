import { useState } from "react";
import { Building2, Factory, Search, Users } from "lucide-react";
import { PageHeader, Section, StatusPill } from "@/components/ui";

const TABS = [
  { id: "collectors", label: "Collectors", icon: <Users size={14} /> },
  { id: "agents", label: "Agents", icon: <Users size={14} /> },
  { id: "hubs", label: "Hubs", icon: <Building2 size={14} /> },
  { id: "brands", label: "Brands", icon: <Factory size={14} /> },
  { id: "factories", label: "Factories", icon: <Factory size={14} /> },
];

const ROWS: Record<string, { name: string; sub: string; status: "verified" | "pending" }[]> = {
  collectors: [
    { name: "Adaeze Nwosu", sub: "Surulere · Lagos · 47 submissions", status: "verified" },
    { name: "Tope Mohammed", sub: "Yaba · Lagos · 21 submissions", status: "verified" },
    { name: "Yusuf Olamide", sub: "Wuse · Abuja · pending KYC", status: "pending" },
  ],
  agents: [
    { name: "Bola Adeyemi", sub: "Surulere Hub · 284 verifications", status: "verified" },
    { name: "Tunde Olumide", sub: "Yaba Centre · 196 verifications", status: "verified" },
  ],
  hubs: [
    { name: "Surulere Hub", sub: "Lagos · Tier B · 500 kg/day", status: "verified" },
    { name: "Lekki Phase 1", sub: "Lagos · Tier A · 800 kg/day", status: "verified" },
    { name: "Karu Roundabout", sub: "Abuja · pending inspection", status: "pending" },
  ],
  brands: [
    { name: "Sunshine Beverages Ltd", sub: "EPR — plastic packaging", status: "verified" },
    { name: "Africa Brews PLC", sub: "EPR — glass + aluminium", status: "verified" },
  ],
  factories: [
    { name: "Sunshine PET Factory", sub: "Ikeja · 12 t/day capacity", status: "verified" },
    { name: "Greencard Recyclers", sub: "Ogun · 5 t/day capacity", status: "verified" },
  ],
};

export default function AdminManagement() {
  const [tab, setTab] = useState("collectors");
  return (
    <>
      <PageHeader title="Management" subtitle="Approve, suspend or inspect any actor on the Recovang network." />
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn ${tab === t.id ? "bg-primary text-white shadow-glow" : "border border-bordergray bg-white text-charcoal hover:border-primary"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <Section>
        <div className="mb-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
          <input className="input pl-9" placeholder="Search..." />
        </div>
        <div className="space-y-3">
          {ROWS[tab].map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-xl border border-bordergray p-4">
              <div>
                <p className="font-display font-bold">{r.name}</p>
                <p className="text-xs text-textgray">{r.sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={r.status} />
                <button className="btn-outline">View</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
