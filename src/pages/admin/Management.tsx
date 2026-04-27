import { useState } from "react";
import { Building2, CheckCircle2, ChevronDown, Download, Filter, Mail, MapPin, MoreVertical, Phone, Plus, Search, Shield, ShieldCheck, Truck, UserPlus, Users, Wallet } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const TABS = [
  { id: "collectors", label: "Collectors", count: 62418, icon: Users },
  { id: "agents", label: "Agents", count: 412, icon: Shield },
  { id: "logistics", label: "Logistics", count: 8, icon: Truck },
  { id: "staff", label: "Staff", count: 24, icon: UserPlus },
];

const COLLECTORS = [
  { name: "Adaeze Nwosu", id: "C-2419", area: "Surulere · Lagos", joined: "Aug 2024", drops: 47, kg: 218, earned: 312400, status: "active" },
  { name: "Kunle Bakare", id: "C-1822", area: "Ikeja · Lagos", joined: "Apr 2024", drops: 184, kg: 412, earned: 684210, status: "active" },
  { name: "Folake Adeola", id: "C-2104", area: "Lekki · Lagos", joined: "Jun 2024", drops: 96, kg: 186, earned: 284300, status: "active" },
  { name: "Tunde Bello", id: "C-2418", area: "Yaba · Lagos", joined: "Apr 2024", drops: 76, kg: 178, earned: 248400, status: "active" },
  { name: "Maryam Sani", id: "C-2308", area: "Ikoyi · Lagos", joined: "Jul 2024", drops: 62, kg: 162, earned: 218400, status: "verified" },
  { name: "Chinedu Okeke", id: "C-2101", area: "Ajah · Lagos", joined: "May 2024", drops: 84, kg: 154, earned: 198400, status: "active" },
  { name: "Aisha Yusuf", id: "C-2204", area: "Wuse · Abuja", joined: "Sep 2024", drops: 48, kg: 142, earned: 184200, status: "active" },
  { name: "Joy Eze", id: "C-1882", area: "Ojota · Lagos", joined: "Mar 2024", drops: 38, kg: 124, earned: 162400, status: "suspended" },
  { name: "Ibrahim Lawal", id: "C-1764", area: "Maitama · Abuja", joined: "Feb 2024", drops: 28, kg: 118, earned: 148000, status: "active" },
];

export default function AdminManagement() {
  const [tab, setTab] = useState("collectors");
  return (
    <>
      <PageHeader
        eyebrow="User management"
        title="People on the platform"
        subtitle="Collectors, agents, logistics partners and Recovang staff — search, filter and manage them all from one place."
        actions={
          <>
            <button className="btn-outline"><Download size={14} /> Export</button>
            <button className="btn-primary"><Plus size={14} /> Add user</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total collectors" value="62,418" sub="+1,824 this week" icon={Users} variant="primary" />
        <KPICard label="Verified hubs" value="412" sub="9 cities · 24 LGAs" icon={Building2} variant="dark" />
        <KPICard label="Logistics partners" value="8" sub="68 trucks live" icon={Truck} />
        <KPICard label="Staff" value="24" sub="3 roles · 100% MFA" icon={Shield} variant="gold" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-bordergray bg-cream/40 p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-charcoal text-white" : "text-textgray hover:bg-white"}`}
            >
              <t.icon size={13} /> {t.label}
              <span className={`ml-1 rounded-full px-1.5 ${tab === t.id ? "bg-white/15 text-white" : "bg-charcoal/8 text-charcoal"}`}>
                {t.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-bordergray p-4">
          <div className="relative min-w-[260px] flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-10" placeholder="Search by name, ID, phone or area" />
          </div>
          <button className="btn-outline btn-sm"><Filter size={12} /> All states</button>
          <button className="btn-outline btn-sm">All statuses <ChevronDown size={11} /></button>
          <button className="btn-outline btn-sm">Joined: any time <ChevronDown size={11} /></button>
        </div>

        <table className="tbl">
          <thead>
            <tr><th><input type="checkbox" className="accent-primary" /></th><th>Collector</th><th>Area</th><th>Joined</th><th>Drops</th><th>KG</th><th className="text-right">Earned</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {COLLECTORS.map((c) => (
              <tr key={c.id}>
                <td><input type="checkbox" className="accent-primary" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size={36} />
                    <div>
                      <div className="font-extrabold">{c.name}</div>
                      <div className="font-mono text-[11px] text-textgray">{c.id}</div>
                    </div>
                  </div>
                </td>
                <td className="text-textgray">{c.area}</td>
                <td className="text-textgray">{c.joined}</td>
                <td className="font-mono">{c.drops}</td>
                <td className="font-mono">{c.kg} kg</td>
                <td className="text-right"><span className="money">{formatNaira(c.earned)}</span></td>
                <td>
                  <StatusPill
                    status={c.status === "active" ? "success" : c.status === "verified" ? "info" : "error"}
                    label={c.status}
                  />
                </td>
                <td><button className="btn-ghost btn-sm"><MoreVertical size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-bordergray bg-cream/40 px-6 py-4 text-sm">
          <div className="text-textgray">Showing <span className="font-bold text-charcoal">9</span> of 62,418 collectors</div>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm">Previous</button>
            <button className="btn-outline btn-sm">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}
