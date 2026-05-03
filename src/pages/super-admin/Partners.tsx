import { useState } from "react";
import { Building2, Factory, FileSignature, MapPin, Plus, Recycle, Star, Truck, Upload } from "lucide-react";
import { KPICard, PageHeader, StatusPill } from "@/components/ui";
import { Modal } from "@/components/Modal";

const LOGISTICS = [
  { name: "GreenWheels Nigeria", trucks: 8, rating: 4.9, regions: "Lagos · Ibadan", tier: "Gold" },
  { name: "BlueArrow Logistics", trucks: 12, rating: 4.8, regions: "Lagos · Abeokuta", tier: "Gold" },
  { name: "PalmCargo Movers", trucks: 6, rating: 4.7, regions: "PH · Calabar", tier: "Silver" },
  { name: "Sahel Express", trucks: 9, rating: 4.6, regions: "Abuja · Kano", tier: "Silver" },
  { name: "Naija Haulage", trucks: 14, rating: 4.5, regions: "Lagos · Ibadan · PH", tier: "Bronze" },
];

const SATELLITE_HUBS = [
  { name: "Surulere Mini-Hub", host: "Mama Folake's shop", lga: "Surulere", state: "Lagos", capacity: "200kg/day", launched: "Jan 2026" },
  { name: "Yaba Tech Hub", host: "Yaba College of Tech", lga: "Yaba", state: "Lagos", capacity: "400kg/day", launched: "Mar 2026" },
  { name: "Wuse Estate Drop", host: "Wuse Market Mgmt", lga: "Wuse", state: "Abuja", capacity: "300kg/day", launched: "Feb 2026" },
  { name: "GRA Hub", host: "Shell Recycling Society", lga: "Old GRA", state: "Port Harcourt", capacity: "500kg/day", launched: "Apr 2026" },
];

const BRANDS_FACTORIES = [
  { name: "Coca-Cola Nigeria", type: "Brand", tier: "Platinum", contracts: 4, mou: "Active · expires Dec 2026" },
  { name: "Nestlé Waters", type: "Brand", tier: "Gold", contracts: 2, mou: "Active · expires Sep 2026" },
  { name: "Unilever Nigeria", type: "Brand", tier: "Gold", contracts: 3, mou: "Active · expires Mar 2027" },
  { name: "Indorama PET Recyclers", type: "Factory", tier: "Platinum", contracts: 2, mou: "Active · expires Jun 2027" },
  { name: "Sunflag Iron & Steel", type: "Factory", tier: "Gold", contracts: 1, mou: "Active · expires Nov 2026" },
  { name: "Beta Glass", type: "Factory", tier: "Silver", contracts: 1, mou: "Pending renewal" },
];

const TIER_TONE: Record<string, string> = {
  Platinum: "bg-charcoal text-white",
  Gold: "bg-gold/15 text-gold",
  Silver: "bg-bordergray text-charcoal",
  Bronze: "bg-cream text-charcoal/70",
};

type Section = "logistics" | "hubs" | "brands";

export default function SuperAdminPartners() {
  const [tab, setTab] = useState<Section>("logistics");
  const [openModal, setOpenModal] = useState<Section | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Super Admin · Partner network"
        title="Partner ecosystem"
        subtitle="Onboard logistics fleets, satellite hubs, brand and factory partners. The network effect of Recovang lives here."
        actions={
          <>
            <button className="btn-outline"><FileSignature size={14} /> MoU library</button>
            <button className="btn-primary" onClick={() => setOpenModal(tab)}>
              <Plus size={14} /> Onboard {tab === "logistics" ? "logistics" : tab === "hubs" ? "satellite hub" : "brand / factory"}
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Logistics partners" value={String(LOGISTICS.length)} sub={`${LOGISTICS.reduce((s, l) => s + l.trucks, 0)} trucks deployed`} icon={Truck} variant="primary" />
        <KPICard label="Satellite hubs" value={String(SATELLITE_HUBS.length)} sub="Plus 412 owned hubs" icon={Building2} />
        <KPICard label="Brands on platform" value={String(BRANDS_FACTORIES.filter((b) => b.type === "Brand").length)} sub="EPR compliance customers" icon={Recycle} variant="gold" />
        <KPICard label="Recycling factories" value={String(BRANDS_FACTORIES.filter((b) => b.type === "Factory").length)} sub="Off-take buyers" icon={Factory} variant="dark" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-bordergray bg-cream/40 p-3">
          {[
            { id: "logistics", label: "Logistics fleets", icon: Truck },
            { id: "hubs", label: "Satellite hubs", icon: Building2 },
            { id: "brands", label: "Brands & factories", icon: Recycle },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Section)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-charcoal text-white" : "text-textgray hover:bg-white"}`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "logistics" && (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Partner</th><th>Trucks</th><th>Regions</th><th>Rating</th><th>Tier</th><th className="text-right">Manage</th></tr></thead>
              <tbody>
                {LOGISTICS.map((p) => (
                  <tr key={p.name}>
                    <td className="font-extrabold">{p.name}</td>
                    <td className="font-mono">{p.trucks}</td>
                    <td className="text-sm text-textgray">{p.regions}</td>
                    <td className="font-mono"><Star size={12} className="inline text-gold" /> {p.rating}</td>
                    <td><span className={`badge ${TIER_TONE[p.tier] ?? "bg-cream text-charcoal"}`}>{p.tier}</span></td>
                    <td className="text-right"><button className="btn-ghost btn-sm">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "hubs" && (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Hub</th><th>Host</th><th>LGA / state</th><th>Capacity</th><th>Launched</th><th className="text-right">Manage</th></tr></thead>
              <tbody>
                {SATELLITE_HUBS.map((h) => (
                  <tr key={h.name}>
                    <td className="font-extrabold">{h.name}</td>
                    <td className="text-sm text-textgray">{h.host}</td>
                    <td>
                      <div className="flex items-center gap-1.5"><MapPin size={11} className="text-textgray" /> {h.lga}, {h.state}</div>
                    </td>
                    <td className="font-mono">{h.capacity}</td>
                    <td className="text-sm text-textgray">{h.launched}</td>
                    <td className="text-right"><button className="btn-ghost btn-sm">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "brands" && (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Partner</th><th>Type</th><th>Tier</th><th>Active contracts</th><th>MoU status</th><th className="text-right">Manage</th></tr></thead>
              <tbody>
                {BRANDS_FACTORIES.map((b) => (
                  <tr key={b.name}>
                    <td className="font-extrabold">{b.name}</td>
                    <td><span className="badge bg-cream text-charcoal/80">{b.type}</span></td>
                    <td><span className={`badge ${TIER_TONE[b.tier] ?? "bg-cream text-charcoal"}`}>{b.tier}</span></td>
                    <td className="font-mono">{b.contracts}</td>
                    <td className="text-sm text-textgray">{b.mou}</td>
                    <td className="text-right"><button className="btn-ghost btn-sm">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={openModal === "logistics"}
        onClose={() => setOpenModal(null)}
        title="Onboard logistics partner"
        description="Partners get access to the live route assignment engine and the driver mobile app."
        footer={<>
          <button className="btn-outline" onClick={() => setOpenModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => setOpenModal(null)}>Send onboarding link</button>
        </>}
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-bold">Company name<input className="input" placeholder="GreenWheels Nigeria Ltd" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">Fleet size<input className="input" type="number" placeholder="8" /></label>
            <label className="grid gap-1 text-sm font-bold">Primary route<input className="input" placeholder="Lagos · Ibadan" /></label>
          </div>
          <label className="grid gap-1 text-sm font-bold">Operations contact (email)<input className="input" type="email" placeholder="ops@greenwheels.ng" /></label>
          <label className="grid gap-1 text-sm font-bold">Tier<select className="input"><option>Bronze (trial · 30 days)</option><option>Silver</option><option>Gold</option><option>Platinum</option></select></label>
        </div>
      </Modal>

      <Modal
        open={openModal === "hubs"}
        onClose={() => setOpenModal(null)}
        title="Onboard satellite hub"
        description="Satellite hubs are operated by trusted local hosts (shop owners, schools, estate managers)."
        footer={<>
          <button className="btn-outline" onClick={() => setOpenModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => setOpenModal(null)}>Create satellite hub</button>
        </>}
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-bold">Hub name<input className="input" placeholder="Surulere Mini-Hub" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">Host<input className="input" placeholder="Mama Folake's shop" /></label>
            <label className="grid gap-1 text-sm font-bold">Daily capacity (kg)<input className="input" type="number" placeholder="200" /></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">LGA<input className="input" placeholder="Surulere" /></label>
            <label className="grid gap-1 text-sm font-bold">State<input className="input" placeholder="Lagos" /></label>
          </div>
          <label className="grid gap-1 text-sm font-bold">Assign to regional admin<select className="input"><option>Sade Ijeoma · Lagos</option><option>Hauwa Bala · Abuja</option><option>Ibe Nwankwo · PH</option></select></label>
        </div>
      </Modal>

      <Modal
        open={openModal === "brands"}
        onClose={() => setOpenModal(null)}
        title="Onboard brand or factory"
        description="Triggers the contract workflow with our legal team and creates a sandbox EPR/marketplace account."
        footer={<>
          <button className="btn-outline" onClick={() => setOpenModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => setOpenModal(null)}>Send onboarding link</button>
        </>}
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-bold">Company<input className="input" placeholder="Coca-Cola Nigeria" /></label>
          <label className="grid gap-1 text-sm font-bold">Type<select className="input"><option>Brand (EPR compliance)</option><option>Factory (recycling marketplace)</option></select></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">Primary contact<input className="input" placeholder="Chioma Okeke" /></label>
            <label className="grid gap-1 text-sm font-bold">Email<input className="input" type="email" placeholder="chioma@coca-cola.ng" /></label>
          </div>
          <label className="grid gap-1 text-sm font-bold">Initial tier<select className="input"><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option></select></label>
          <label className="grid gap-1 text-sm font-bold">Attach signed MoU (optional)<button type="button" className="btn-outline w-full"><Upload size={12} /> Choose file</button></label>
        </div>
      </Modal>
    </>
  );
}
