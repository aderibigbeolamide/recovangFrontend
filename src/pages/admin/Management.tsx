import { useState } from "react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { Modal } from "@/components/Modal";
import { useSearchParams } from "react-router-dom";

import { 
  Building2, ChevronDown, Filter, Info, Mail, MoreHorizontal, Plus, Search, 
  Trash2, UserPlus, Users, Wallet, ShieldCheck, Eye, Download, Truck, Shield, MapPin, Phone, Trash, CheckCircle, X,
  Lock, UserCheck, UserX, ShieldPlus
} from "lucide-react";
import { 
  useAdminCollectors, useAdminDashboard, useAdmins, useAgents, useCreateAdmin, useHubs, useLogistics, useSuspendUser, useUnsuspendUser, useUpdateAdminPermissions, useImpersonate, useExport, useBulkUserAction,
  useAgentInviteRequests, useManageAgentInvite
} from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";
import { DataTable, type Column } from "@/components/DataTable";
import { useAuth } from "@/store/auth";
import { UserDetailDrawer } from "@/components/UserDetailDrawer";
import { HubDetailDrawer } from "@/components/HubDetailDrawer";
import { PERMISSION_GROUPS, PERMISSIONS } from "@/constants/permissions";
import { PermissionGuard } from "@/components/PermissionGuard";

const TABS = [
  { id: "collectors", label: "Collectors", icon: Users },
  { id: "agents", label: "Agents", icon: ShieldCheck },
  { id: "requests", label: "Hub Requests", icon: ShieldPlus },
  { id: "hubs", label: "Hubs", icon: Building2 },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "staff", label: "Staff", icon: UserPlus },
];

const ADMIN_PRESETS = [
  {
    id: "ops",
    name: "Operations Manager",
    description: "Manage collectors, agents, hubs, and logistics routes.",
    icon: Truck,
    color: "text-success",
    bg: "bg-success/10",
    permissions: [PERMISSIONS.USERS_VIEW, PERMISSIONS.HUBS_VIEW, PERMISSIONS.HUBS_MANAGE, PERMISSIONS.LOGISTICS_MANAGE, PERMISSIONS.AGENTS_VIEW]
  },
  {
    id: "compliance",
    name: "Compliance Officer",
    description: "Review KYC documents, manage notes, and suspend accounts.",
    icon: ShieldCheck,
    color: "text-info",
    bg: "bg-info/10",
    permissions: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_KYC, PERMISSIONS.USERS_SUSPEND, PERMISSIONS.USERS_NOTES]
  },
  {
    id: "finance",
    name: "Finance Officer",
    description: "Oversee payouts, pricing, and financial reports.",
    icon: Wallet,
    color: "text-gold",
    bg: "bg-gold/10",
    permissions: [PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_PAYOUTS, PERMISSIONS.PRICING_MANAGE]
  },
  {
    id: "super",
    name: "Super Admin",
    description: "Full administrative access across the entire platform.",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    permissions: ["ALL"]
  }
];

export default function AdminManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "collectors";
  const [tab, setTab] = useState(initialTab);
  const [permissionModal, setPermissionModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: "", lastName: "", email: "", presetId: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
    setSelectedIds([]);
    setSelectedUserId(null);
    setSelectedHubId(null);
  };
  const { data: stats } = useAdminDashboard();
  const { data: collectors, isLoading: collectorsLoading } = useAdminCollectors({ tab });
  const { data: admins, isLoading: adminsLoading } = useAdmins();
  const { data: hubs, isLoading: hubsLoading } = useHubs();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: logistics, isLoading: logisticsLoading } = useLogistics();
  const { data: inviteRequests, isLoading: requestsLoading } = useAgentInviteRequests();
  const { mutate: manageInvite, isPending: managingInvite } = useManageAgentInvite();
  const { mutate: updatePermissions, isPending: updatingPermissions } = useUpdateAdminPermissions();
  const { mutate: inviteAdmin, isPending: invitingAdmin } = useCreateAdmin();
  const { mutate: impersonate } = useImpersonate();
  const { mutate: exportData, isPending: exporting } = useExport();
  const { mutate: suspendUser } = useSuspendUser();
  const { mutate: unsuspendUser } = useUnsuspendUser();
  const { mutate: bulkAction, isPending: isBulkProcessing } = useBulkUserAction();

  const handleBulkAction = (action: string) => {
    bulkAction({ userIds: selectedIds, action }, {
      onSuccess: () => setSelectedIds([])
    });
  };

  const handleInvite = () => {
    if (!newAdmin.email || !newAdmin.presetId) return;
    const preset = ADMIN_PRESETS.find(p => p.id === newAdmin.presetId);
    inviteAdmin({
      ...newAdmin,
      permissions: preset?.permissions || []
    }, {
      onSuccess: () => {
        setInviteModal(false);
        setNewAdmin({ firstName: "", lastName: "", email: "", presetId: "" });
      }
    });
  };

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
    case "requests":
      users = inviteRequests;
      isLoading = requestsLoading;
      break;
  }

  const kpis = {
    activeCollectors: stats?.activeCollectors ?? 0,
    hubs: stats?.hubs ?? 0,
    fleet: stats?.fleet ?? 0,
    staff: stats?.staff ?? 0
  };

  const counts: Record<string, number> = {
    collectors: collectors?.length ?? 0,
    agents: agents?.length ?? 0,
    requests: inviteRequests?.filter((r: any) => r.status === "PENDING").length ?? 0,
    hubs: hubs?.length ?? 0,
    logistics: logistics?.length ?? 0,
    staff: admins?.length ?? 0
  };

  const displayUsers = users || [];

  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";
  const permissions = user?.permissions || [];
  const has = (p: string) => isSuperAdmin || permissions.includes(p) || permissions.includes("ALL");

  const tabsToDisplay = TABS.filter(t => {
    if (t.id === "staff") return isSuperAdmin;
    if (t.id === "hubs") return has(PERMISSIONS.HUBS_VIEW) || has(PERMISSIONS.HUBS_MANAGE);
    if (t.id === "logistics") return has(PERMISSIONS.LOGISTICS_MANAGE) || has(PERMISSIONS.HUBS_MANAGE);
    if (t.id === "collectors" || t.id === "agents") return has(PERMISSIONS.USERS_VIEW) || has(PERMISSIONS.USERS_MANAGE);
    return true;
  });

  const columns: Column<any>[] = [
    {
      key: "user",
      header: tab === "hubs" ? "Hub Details" : "User Details",
      searchValue: (row) => {
        const u = row.user || row;
        return `${u.firstName || row.name} ${u.lastName || ""} ${row.id} ${u.email || ""}`;
      },
      render: (row) => {
        if (tab === "requests") {
            return (
                <div className="flex items-center gap-3">
                  <Avatar name={`${row.inviteeFirstName} ${row.inviteeLastName}`} size={36} />
                  <div>
                    <div className="font-extrabold">{row.inviteeFirstName} {row.inviteeLastName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-textgray">
                      <span>{row.inviteeEmail}</span>
                    </div>
                  </div>
                </div>
            );
        }
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
      key: "details",
      header: tab === "hubs" ? "Location/Capacity" : tab === "staff" ? "Role/Permissions" : tab === "requests" ? "Requester/Hub" : "Area/Company",
      render: (row) => {
        if (tab === "requests") return (
            <div className="flex flex-col">
                <span className="text-[11px] font-bold text-charcoal">Req: {row.requester?.user?.firstName} {row.requester?.user?.lastName}</span>
                <span className="text-[10px] text-textgray">Hub: {row.hub?.name}</span>
            </div>
        );
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
      header: tab === "requests" ? "Requested Date" : "Joined",
      render: (row) => <span className="text-textgray">{row.joined || (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A")}</span>
    },
    {
      key: "activity",
      header: tab === "requests" ? "Invitee Type" : "Activity",
      render: (row) => <span className="font-mono uppercase text-[10px] font-bold">{row.inviteeType || row.drops || row.trips || row.actions || row.verificationCount || 0}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const u = row.user || row;
        return (
          <StatusPill
            status={u.status === "active" || u.isActive ? "success" : u.status === "verified" || u.isEmailVerified ? "info" : "error"}
            label={u.status || (u.isActive ? "active" : "inactive")}
          />
        );
      }
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => {
        if (tab === "requests") {
            if (row.status !== "PENDING") return <span className="text-[10px] text-textgray uppercase font-bold tracking-widest">{row.status}</span>;
            return (
                <div className="flex items-center justify-end gap-2">
                    <button 
                        className="btn-primary btn-sm px-4"
                        onClick={() => manageInvite({ id: row.id, action: "approve" })}
                        disabled={managingInvite}
                    >
                        Approve
                    </button>
                    <button 
                        className="btn-outline btn-sm text-error hover:bg-error/10"
                        onClick={() => {
                            const reason = window.prompt("Reason for rejection?");
                            if (reason) manageInvite({ id: row.id, action: "reject", reason });
                        }}
                        disabled={managingInvite}
                    >
                        Reject
                    </button>
                </div>
            );
        }
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
        const u = row.user || row;
        return (
          <div className="flex items-center justify-end gap-2">
            <PermissionGuard permission={PERMISSIONS.USERS_IMPERSONATE}>
              <button 
                className="btn-outline btn-sm group flex items-center gap-2 border-charcoal/20 px-3 hover:border-charcoal hover:bg-charcoal hover:text-white"
                onClick={() => impersonate(u.id)}
                title="View platform as this user"
              >
                <Eye size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">View as User</span>
              </button>
            </PermissionGuard>
            
            <PermissionGuard permission={PERMISSIONS.USERS_SUSPEND}>
              {(u.status === "active" || u.isActive) ? (
                <button 
                  title="Suspend User"
                  className="btn-ghost btn-sm text-error hover:bg-error/10"
                  onClick={() => suspendUser(u.id)}
                >
                  <UserX size={14} />
                </button>
              ) : (
                <button 
                  title="Reactivate User"
                  className="btn-ghost btn-sm text-primary hover:bg-primary/10"
                  onClick={() => unsuspendUser(u.id)}
                >
                  <UserCheck size={14} />
                </button>
              )}
            </PermissionGuard>

            <button className="btn-ghost btn-sm text-textgray">
              <MoreHorizontal size={16} />
            </button>
          </div>
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
            <PermissionGuard permission={PERMISSIONS.FINANCE_EXPORT}>
              <button 
                className="btn-outline group" 
                onClick={() => exportData("users")}
                disabled={exporting}
              >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                {exporting ? "Exporting..." : "Export to Excel"}
              </button>
            </PermissionGuard>
            <button className="btn-primary" onClick={() => tab === "staff" ? setInviteModal(true) : null}>
              <Plus size={14} /> {tab === "staff" ? "Invite Admin" : "Add user"}
            </button>
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
            onRowClick={(u) => {
              if (tab === "requests") return;
              if (tab === "hubs") setSelectedHubId(u.id);
              else setSelectedUserId(u.user?.id || u.id);
            }}
            selection={{
              selectedIds,
              onSelectionChange: setSelectedIds
            }}
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

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-6 rounded-2xl bg-charcoal p-4 text-white shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-r border-white/20 pr-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-black text-xs">
              {selectedIds.length}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Users Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
              onClick={() => handleBulkAction("ACTIVATE")}
              disabled={isBulkProcessing}
            >
              <CheckCircle size={14} className="text-primary" /> Reactivate
            </button>
            <button 
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10 text-error"
              onClick={() => handleBulkAction("SUSPEND")}
              disabled={isBulkProcessing}
            >
              <UserX size={14} /> Suspend
            </button>
            <button 
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-error/20 text-error"
              onClick={() => handleBulkAction("DELETE")}
              disabled={isBulkProcessing}
            >
              <Trash size={14} /> Delete
            </button>
          </div>
          <button onClick={() => setSelectedIds([])} className="ml-4 text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>
      )}

      <UserDetailDrawer 
        userId={selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />

      <HubDetailDrawer 
        hubId={selectedHubId} 
        onClose={() => setSelectedHubId(null)} 
      />

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
        <div className="grid gap-6">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-primary/5 border border-primary/20 p-4">
            <div>
              <div className="text-xs font-black text-primary uppercase tracking-widest">Master Access (Super Admin)</div>
              <div className="text-[10px] text-primary/70">Bypass all permission checks for this user.</div>
            </div>
            <input 
              type="checkbox" 
              className="checkbox border-primary/30 text-primary" 
              checked={selectedPermissions.includes("ALL")}
              onChange={() => togglePermission("ALL")}
            />
          </label>

          {!selectedPermissions.includes("ALL") && (
            <div className="grid gap-6 sm:grid-cols-2">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.name} className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-textgray border-b border-bordergray pb-2">{group.name}</h4>
                  <div className="grid gap-2">
                    {group.permissions.map((p) => (
                      <label key={p.key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-bordergray/50 p-2.5 hover:bg-cream/20 transition-colors">
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-sm" 
                          checked={selectedPermissions.includes(p.key)}
                          onChange={() => togglePermission(p.key)}
                        />
                        <span className="text-[11px] font-bold text-charcoal">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={inviteModal}
        onClose={() => setInviteModal(false)}
        title="Invite New Admin"
        description="Add a new staff member to the Recovang administrative panel."
        size="lg"
        footer={
          <>
            <button className="btn-outline" onClick={() => setInviteModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleInvite} disabled={invitingAdmin || !newAdmin.presetId || !newAdmin.email}>
              {invitingAdmin ? "Sending..." : "Send Invitation"}
            </button>
          </>
        }
      >
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">First Name</label>
              <input 
                className="input" 
                placeholder="John" 
                value={newAdmin.firstName}
                onChange={e => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Last Name</label>
              <input 
                className="input" 
                placeholder="Doe" 
                value={newAdmin.lastName}
                onChange={e => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Email Address</label>
            <input 
              className="input" 
              type="email"
              placeholder="admin@recovang.com" 
              value={newAdmin.email}
              onChange={e => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Select Role Archetype</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADMIN_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setNewAdmin(prev => ({ ...prev, presetId: p.id }))}
                  className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${newAdmin.presetId === p.id ? "border-charcoal bg-charcoal/5 ring-1 ring-charcoal" : "border-bordergray bg-white hover:border-textgray/40"}`}
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${p.bg} ${p.color}`}>
                    <p.icon size={20} />
                  </div>
                  <div>
                    <div className="font-extrabold text-charcoal">{p.name}</div>
                    <div className="mt-1 text-[10px] leading-relaxed text-textgray">{p.description}</div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1">
                    {p.permissions.map(perm => (
                      <span key={perm} className="rounded bg-charcoal/5 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tight text-charcoal/60">
                        {perm.replace("MANAGE_", "")}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
