import { useState } from "react";
import { Building2, CheckCircle2, ChevronDown, Download, Filter, Mail, MapPin, MoreVertical, Phone, Plus, Search, Shield, ShieldCheck, Truck, UserPlus, Users, Wallet } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { Modal } from "@/components/Modal";
import { useSearchParams } from "react-router-dom";

import { useAdminCollectors, useAdminDashboard, useAdmins, useAgents, useHubs, useLogistics, useUpdateAdminPermissions } from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";
import { DataTable, type Column } from "@/components/DataTable";
import { useAuth } from "@/store/auth";

const TABS = [
  { id: "collectors", label: "Collectors", icon: Users },
  { id: "agents", label: "Agents", icon: Shield },
  { id: "hubs", label: "Hubs", icon: Building2 },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "staff", label: "Staff", icon: UserPlus },
];

export default function AdminManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "collectors";
  const [tab, setTab] = useState(initialTab);
  const [permissionModal, setPermissionModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };
  const { data: stats } = useAdminDashboard();
  const { data: collectors, isLoading: collectorsLoading } = useAdminCollectors({ tab });
  const { data: admins, isLoading: adminsLoading } = useAdmins();
  const { data: hubs, isLoading: hubsLoading } = useHubs();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: logistics, isLoading: logisticsLoading } = useLogistics();
  const { mutate: updatePermissions, isPending: updatingPermissions } = useUpdateAdminPermissions();

  const handleOpenPermissions = (u: any) => {
    setPermissionModal({ open: true, user: u });
    setSelectedPermissions(u.permissions || []);
  };

  const handleSavePermissions = () => {
    if (permissionModal.user) {
      updatePermissions({ id: permissionModal.user.id, permissions: selectedPermissions }, {
        onSuccess: () => setPermissionModal({ open: false, user: null })
      });
    }
  };

  const togglePermission = (p: string) => {
    setSelectedPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const ALL_PERMISSIONS = ["MANAGE_USERS", "MANAGE_FINANCE", "MANAGE_HUBS", "MANAGE_PRICING", "VIEW_AUDIT_LOGS", "MANAGE_FRAUD", "ALL"];

  let isLoading = false;
  let users: any[] = [];

  switch (tab) {
    case "staff":
      users = admins;
      isLoading = adminsLoading;
      break;
    case "collectors":
      users = collectors;
      isLoading = collectorsLoading;
      break;
    case "hubs":
      users = hubs;
      isLoading = hubsLoading;
      break;
    case "agents":
      users = agents;
      isLoading = agentsLoading;
      break;
    case "logistics":
      users = logistics;
      isLoading = logisticsLoading;
      break;
  }

  const kpis = {
    activeCollectors: stats?.activeCollectors ?? 0,
    hubs: stats?.hubs ?? 0,
    fleet: stats?.fleet ?? 0,
    staff: stats?.staff ?? 0
  };

  const counts: Record<string, number> = {
    collectors: collectors?.length ?? kpis.activeCollectors,
    agents: agents?.length ?? kpis.hubs,
    hubs: hubs?.length ?? kpis.hubs,
    logistics: logistics?.length ?? (kpis.fleet / 8),
    staff: admins?.length ?? kpis.staff
  };

  const displayUsers = users || [
    { name: "Adaeze Nwosu", id: "C-2419", area: "Surulere · Lagos", joined: "Aug 2024", drops: 47, kg: 218, earned: 312400, status: "active" },
    { name: "Kunle Bakare", id: "C-1822", area: "Ikeja · Lagos", joined: "Apr 2024", drops: 184, kg: 412, earned: 684210, status: "active" },
    { name: "Folake Adeola", id: "C-2104", area: "Lekki · Lagos", joined: "Jun 2024", drops: 96, kg: 186, earned: 284300, status: "active" },
  ];

  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";

  const tabsToDisplay = isSuperAdmin ? TABS : TABS.filter(t => t.id !== "staff");

  const columns: Column<any>[] = [
    {
      key: "user",
      header: tab === "hubs" ? "Hub Details" : "User Details",
      searchValue: (row) => {
        const u = row.user || row;
        return `${u.firstName || row.name} ${u.lastName || ""} ${row.id} ${u.email || ""}`;
      },
      render: (row) => {
        const u = row.user || row; // Handle nested user or direct user object
        const name = u.name || (u.firstName ? `${u.firstName} ${u.lastName}` : row.companyName || row.name || "N/A");
        const sub = u.email || u.phoneNumber || row.id;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={name} size={36} />
            <div>
              <div className="font-extrabold">{name}</div>
              <div className="flex items-center gap-2 text-[11px] text-textgray">
                <span className="font-mono">{row.id}</span>
                {u.email && <span>· {u.email}</span>}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: "info",
      header: tab === "hubs" ? "Location/Capacity" : tab === "staff" ? "Role/Permissions" : "Area/Company",
      render: (row) => {
        const u = row.user || row;
        if (tab === "hubs") return <span className="text-textgray">{row.address || row.location} ({formatKg(row.capacityKg)})</span>;
        if (tab === "staff") return (
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase">{u.role}</span>
            <span className="text-[10px] text-textgray">{u.permissions?.join(", ") || "No extra permissions"}</span>
          </div>
        );
        return <span className="text-textgray">{row.area || row.company || row.location || row.state || u.state || "N/A"}</span>;
      }
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) => <span className="text-textgray">{u.joined || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A")}</span>
    },
    {
      key: "activity",
      header: "Activity",
      render: (u) => <span className="font-mono">{u.drops || u.trips || u.actions || u.verificationCount || 0}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <StatusPill
          status={u.status === "active" || u.isActive ? "success" : u.status === "verified" || u.isEmailVerified ? "info" : "error"}
          label={u.status || (u.isActive ? "active" : "inactive")}
        />
      )
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => {
        if (tab === "staff") {
          const isSuper = row.role === "SUPER_ADMIN" || row.permissions?.includes("ALL");
          return (
            <div className="flex items-center gap-2">
              <button 
                className="btn-outline btn-sm text-[10px]"
                onClick={() => handleOpenPermissions(row)}
              >
                Manage Permissions
              </button>
              {isSuper && <ShieldCheck size={14} className="text-primary" />}
            </div>
          );
        }
        return (
          <button 
            className="btn-ghost btn-sm hover:bg-charcoal/5"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Action menu for:", row.id);
            }}
          >
            <MoreVertical size={14} />
          </button>
        );
      }
    }
  ];

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
        <KPICard label="Total collectors" value={formatNumber(kpis.activeCollectors)} sub="+1,824 this week" icon={Users} variant="primary" />
        <KPICard label="Verified hubs" value={formatNumber(kpis.hubs)} sub="9 cities · 24 LGAs" icon={Building2} variant="dark" />
        <KPICard label="Logistics partners" value={formatNumber(kpis.fleet / 8)} sub={`${kpis.fleet} trucks live`} icon={Truck} />
        <KPICard label="Staff" value={formatNumber(kpis.staff)} sub="3 roles · 100% MFA" icon={Shield} variant="gold" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-bordergray bg-cream/40 p-3">
          {tabsToDisplay.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-charcoal text-white" : "text-textgray hover:bg-white"}`}
            >
              <t.icon size={13} /> {t.label}
              <span className={`ml-1 rounded-full px-1.5 ${tab === t.id ? "bg-white/15 text-white" : "bg-charcoal/8 text-charcoal"}`}>
                {formatNumber(counts[t.id])}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <DataTable
            data={displayUsers}
            columns={columns}
            rowKey={(r) => r.id}
            searchPlaceholder="Search by name, ID, phone..."
            rightActions={
              <>
                <button className="btn-outline btn-sm"><Filter size={12} /> All states</button>
                <button className="btn-outline btn-sm">All statuses <ChevronDown size={11} /></button>
              </>
            }
          />
        )}
      </div>

      <Modal
        open={permissionModal.open}
        onClose={() => setPermissionModal({ open: false, user: null })}
        title="Staff Permissions"
        description={`Assign specific access rights to ${permissionModal.user?.firstName || "this admin"}`}
        footer={
          <>
            <button className="btn-outline" onClick={() => setPermissionModal({ open: false, user: null })}>Cancel</button>
            <button 
              className="btn-primary" 
              onClick={handleSavePermissions}
              disabled={updatingPermissions}
            >
              {updatingPermissions ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          {ALL_PERMISSIONS.map(p => (
            <label key={p} className="flex cursor-pointer items-center justify-between rounded-xl border border-bordergray p-3 hover:bg-cream/30">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">{p.replace(/_/g, " ")}</div>
                <div className="text-[10px] text-textgray">
                  {p === "ALL" ? "Full administrative access (Super Admin)" : `Allow this user to ${p.toLowerCase().replace(/_/g, " ")}`}
                </div>
              </div>
              <input 
                type="checkbox" 
                className="checkbox" 
                checked={selectedPermissions.includes(p)}
                onChange={() => togglePermission(p)}
              />
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
