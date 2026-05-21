import { useState, useEffect } from "react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { formatNaira } from "@/lib/cn";
import { Modal, ConfirmModal } from "@/components/Modal";
import { useSearchParams } from "react-router-dom";

import { 
  Building2, ChevronDown, Filter, Info, Mail, MoreHorizontal, Plus, Search, 
  Trash2, UserPlus, Users, Wallet, ShieldCheck, Eye, Download, Truck, Shield, MapPin, Phone, Trash, CheckCircle, X,
  Lock, UserCheck, UserX, ShieldPlus, Boxes, Award
} from "lucide-react";
import { 
  useAdminCollectors, useAdminDashboard, useAdmins, useAgents, useCreateAdmin, useHubs, useLogistics, useSuspendUser, useUnsuspendUser, useUpdateAdminPermissions, useImpersonate, useExport, useBulkUserAction,
  useAgentInviteRequests, useManageAgentInvite, useCreateHub,
  usePendingLocations, useVerifyLocation, useSyncLocations,
  usePendingOfficialAgents, useApproveOfficialAgent, useDeleteOfficialAgent,
  useFactories, useBrands
} from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";
import { DataTable, type Column } from "@/components/DataTable";
import { useAuth } from "@/store/auth";
import { UserDetailDrawer } from "@/components/UserDetailDrawer";
import { HubDetailDrawer } from "@/components/HubDetailDrawer";
import { PERMISSION_GROUPS, PERMISSIONS } from "@/constants/permissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import locationsData from "@/constants/locations.json";

const TABS = [
  { id: "collectors", label: "Collectors", icon: Users },
  { id: "agents", label: "Agents", icon: ShieldCheck },
  { id: "requests", label: "Hub Requests", icon: ShieldPlus },
  { id: "recruitment", label: "Recruitment", icon: UserPlus },
  { id: "hubs", label: "Hubs", icon: Building2 },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "factories", label: "Factories", icon: Boxes },
  { id: "brands", label: "Brands", icon: Award },
  { id: "staff", label: "Staff", icon: UserPlus },
];

const MODULE_CONFIG: Record<string, { label: string; eyebrow: string; tabs: string[] }> = {
  users: {
    label: "User Management",
    eyebrow: "Personnel & Collectors",
    tabs: ["collectors", "agents", "recruitment", "staff"]
  },
  hubs: {
    label: "Hub Management",
    eyebrow: "Facilities & Inventory",
    tabs: ["hubs", "requests"]
  },
  logistics: {
    label: "Logistics Management",
    eyebrow: "Fleet & Partners",
    tabs: ["logistics"]
  },
  locations: {
    label: "Location Management",
    eyebrow: "Regional Mapping",
    tabs: ["locations"]
  },
  factories: {
    label: "Factory Management",
    eyebrow: "Downstream Partners",
    tabs: ["factories"]
  },
  brands: {
    label: "Brand Management",
    eyebrow: "EPR & Sustainability",
    tabs: ["brands"]
  }
};

const ADMIN_PRESETS = [
  {
    id: "ops",
    name: "Operations Manager",
    description: "Full control over hubs, logistics, and agent assignments.",
    icon: Truck,
    color: "text-success",
    bg: "bg-success/10",
    permissions: [
      PERMISSIONS.HUBS_VIEW, PERMISSIONS.HUBS_MANAGE, PERMISSIONS.HUBS_INVENTORY,
      PERMISSIONS.LOGISTICS_MANAGE, PERMISSIONS.AGENTS_VIEW, PERMISSIONS.AGENTS_MANAGE,
      PERMISSIONS.AGENTS_ASSIGN, PERMISSIONS.USERS_VIEW, PERMISSIONS.FACTORIES_MANAGE,
      PERMISSIONS.BRANDS_MANAGE, PERMISSIONS.LOCATIONS_MANAGE
    ]
  },
  {
    id: "compliance",
    name: "User & KYC Manager",
    description: "Manage user profiles, verify KYC, and handle communication.",
    icon: ShieldCheck,
    color: "text-info",
    bg: "bg-info/10",
    permissions: [
      PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_MANAGE, PERMISSIONS.USERS_KYC,
      PERMISSIONS.USERS_SUSPEND, PERMISSIONS.USERS_MESSAGE, PERMISSIONS.USERS_NOTES,
      PERMISSIONS.AGENTS_VIEW
    ]
  },
  {
    id: "finance",
    name: "Finance & Pricing Admin",
    description: "Manage payouts, waste pricing, and financial reporting.",
    icon: Wallet,
    color: "text-gold",
    bg: "bg-gold/10",
    permissions: [
      PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_PAYOUTS, PERMISSIONS.FINANCE_EXPORT,
      PERMISSIONS.PRICING_MANAGE, PERMISSIONS.USERS_VIEW, PERMISSIONS.ANALYTICS_VIEW
    ]
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
  const moduleParam = searchParams.get("module") || "users";
  const config = MODULE_CONFIG[moduleParam] || MODULE_CONFIG.users;
  
  const initialTab = searchParams.get("tab") || config.tabs[0];
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, moduleParam]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: "", lastName: "", email: "", presetId: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hubModal, setHubModal] = useState(false);
  const [newHub, setNewHub] = useState({ name: "", location: "", state: "", lga: "", capacityKg: 5000, ownerAgentId: "" });
  const [actionModal, setActionModal] = useState<{ 
    open: boolean; 
    type: "approve" | "delete" | "reject"; 
    title: string; 
    description: string; 
    row?: any;
    reason?: string;
    selectedHubId?: string;
  }>({ open: false, type: "approve", title: "", description: "" });
  
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "super_admin";
  const permissions = user?.permissions || [];
  const has = (p: string) => isSuperAdmin || permissions.includes(p) || permissions.includes("ALL");

  const { data: stats } = useAdminDashboard();
  const { data: collectors, isLoading: collectorsLoading } = useAdminCollectors({ tab });
  const { data: admins, isLoading: adminsLoading } = useAdmins({ enabled: isSuperAdmin });
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
  const { mutate: createHub, isPending: creatingHub } = useCreateHub();
  const { data: pendingLocations, isLoading: locationsLoading } = usePendingLocations();
  const { mutate: verifyLocation } = useVerifyLocation();
  const { mutate: syncLocations, isPending: syncingLocations } = useSyncLocations();
  const { data: pendingOfficial, isLoading: recruitmentLoading } = usePendingOfficialAgents();
  const { mutate: approveOfficial } = useApproveOfficialAgent();
  const { mutate: deleteOfficial } = useDeleteOfficialAgent();
  const { data: factories, isLoading: factoriesLoading } = useFactories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

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

  const togglePermission = (p: string) => {
    setSelectedPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleCreateHub = () => {
    if (!newHub.name || !newHub.state || !newHub.lga) return;
    createHub({
      ...newHub,
      address: newHub.location || `${newHub.lga}, ${newHub.state}`,
    }, {
      onSuccess: () => {
        setHubModal(false);
        setNewHub({ name: "", location: "", state: "", lga: "", capacityKg: 5000, ownerAgentId: "" });
      }
    });
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
    case "recruitment":
      users = pendingOfficial;
      isLoading = recruitmentLoading;
      break;
    case "locations":
      const { states = [], lgas = [], wards = [] } = pendingLocations || {};
      users = [
        ...states.map((s: any) => ({ ...s, type: "state", displayName: s.name.toUpperCase() })),
        ...lgas.map((l: any) => ({ ...l, type: "lga", displayName: `${l.name.replace(/-/g, " ").toUpperCase()} (${l.state?.name.toUpperCase()})` })),
        ...wards.map((w: any) => ({ ...w, type: "ward", displayName: `${w.name.replace(/-/g, " ").toUpperCase()} (${w.lga?.name.replace(/-/g, " ").toUpperCase()})` }))
      ];
      isLoading = locationsLoading;
      break;
    case "factories":
      users = factories;
      isLoading = factoriesLoading;
      break;
    case "brands":
      users = brands;
      isLoading = brandsLoading;
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
    recruitment: pendingOfficial?.length ?? 0,
    factories: factories?.length ?? 0,
    brands: brands?.length ?? 0,
    staff: admins?.length ?? 0
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setSearchParams({ module: moduleParam, tab: newTab });
    setSelectedIds([]);
    setSelectedUserId(null);
    setSelectedHubId(null);
  };

  const displayUsers = users || [];

  const tabsToDisplay = TABS.filter(t => {
    const belongsToModule = config.tabs.includes(t.id);
    if (!belongsToModule) return false;

    if (t.id === "staff") return isSuperAdmin;
    if (t.id === "recruitment") return has(PERMISSIONS.FLEET_RECRUITMENT) || isSuperAdmin;
    if (t.id === "hubs") return has(PERMISSIONS.HUBS_VIEW) || has(PERMISSIONS.HUBS_MANAGE);
    if (t.id === "logistics") return has(PERMISSIONS.LOGISTICS_MANAGE) || has(PERMISSIONS.HUBS_MANAGE);
    if (t.id === "collectors" || t.id === "agents") return has(PERMISSIONS.USERS_VIEW) || has(PERMISSIONS.USERS_MANAGE);
    if (t.id === "locations") return has(PERMISSIONS.LOCATIONS_MANAGE);
    if (t.id === "factories") return has(PERMISSIONS.FACTORIES_VIEW) || has(PERMISSIONS.FACTORIES_MANAGE);
    if (t.id === "brands") return has(PERMISSIONS.BRANDS_VIEW) || has(PERMISSIONS.BRANDS_MANAGE);
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
        if (tab === "requests" || tab === "recruitment") {
            const u = row.user || row;
            const firstName = row.inviteeFirstName || u.firstName;
            const lastName = row.inviteeLastName || u.lastName;
            const email = row.inviteeEmail || u.email;
            return (
                <div className="flex items-center gap-3">
                  <Avatar name={`${firstName} ${lastName}`} size={36} />
                  <div>
                    <div className="font-extrabold">{firstName} {lastName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-textgray">
                      <span>{email}</span>
                    </div>
                  </div>
                </div>
            );
        }
        const u = row.user || row; // Handle nested user or direct user object
        const name = row.displayName || u.name || (u.firstName ? `${u.firstName} ${u.lastName}` : row.companyName || row.name || "N/A");
        const sub = u.email || u.phoneNumber || row.id;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={name} size={36} icon={tab === "locations" ? MapPin : undefined} />
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
        if (tab === "recruitment") return (
          <div className="flex flex-col">
              <span className="text-[11px] font-bold text-charcoal">{row.workMode === 'hub' ? 'Hub-Based' : 'Field Agent'}</span>
              <span className="text-[10px] text-textgray">
                {(typeof row.lga === 'object' ? row.lga?.name : row.lga) || "N/A"}, {(typeof row.state === 'object' ? row.state?.name : row.state) || "N/A"}
              </span>
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
        const area = row.area || row.company || row.location || 
                     (typeof row.state === 'object' ? row.state?.name : row.state) || 
                     (typeof u.state === 'object' ? u.state?.name : u.state) || "N/A";
        return <span className="text-textgray">{area}</span>;
      }
    },
    {
      key: "joined",
      header: tab === "requests" ? "Requested Date" : "Joined",
      render: (row) => <span className="text-textgray">{row.joined || (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A")}</span>
    },
    {
      key: "activity",
      header: tab === "requests" ? "Invitee Type" : tab === "recruitment" ? "Phone" : tab === "locations" ? "Type" : "Activity",
      render: (row) => {
        const val = row.type || row.inviteeType || row.phoneNumber || 
                   (typeof row.drops === 'number' ? row.drops : (Array.isArray(row.drops) ? row.drops.length : undefined)) || 
                   (typeof row.trips === 'number' ? row.trips : (Array.isArray(row.trips) ? row.trips.length : undefined)) || 
                   row.actions || row.verificationCount || 0;
        return <span className="font-mono uppercase text-[10px] font-bold">{String(val)}</span>;
      }
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
        if (tab === "recruitment") {
          return (
            <div className="flex items-center justify-end gap-2">
                <button 
                    className="btn-primary btn-sm px-4"
                    onClick={() => setActionModal({
                      open: true,
                      type: "approve",
                      title: "Approve Official Agent",
                      description: `Are you sure you want to approve ${row.firstName} as an official agent? They will receive an email and gain access to the platform.`,
                      row
                    })}
                >
                    Approve
                </button>
                <button 
                  className="btn-ghost btn-sm text-error"
                  onClick={() => setActionModal({
                    open: true,
                    type: "delete",
                    title: "Delete Application",
                    description: `Are you sure you want to delete ${row.firstName}'s application? This action cannot be undone, but they will be able to re-apply later.`,
                    row
                  })}
                >
                  <Trash2 size={14} />
                </button>
            </div>
          );
        }
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
                        onClick={() => setActionModal({
                          open: true,
                          type: "reject",
                          title: "Reject Invite Request",
                          description: `Please provide a reason for rejecting the invite request for ${row.inviteeFirstName || row.firstName}.`,
                          row,
                          reason: ""
                        })}
                        disabled={managingInvite}
                    >
                        Reject
                    </button>
                </div>
            );
        }
        if (tab === "locations") {
            return (
                <div className="flex items-center justify-end gap-2">
                    <button 
                        className="btn-primary btn-sm px-4"
                        onClick={() => verifyLocation({ type: row.type, id: row.id })}
                    >
                        Verify Location
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
                onClick={() => setSelectedUserId(row.id)}
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
        eyebrow={config.eyebrow}
        title={config.label}
        subtitle={`Manage ${config.label.toLowerCase()} settings, search, and filter records.`}
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
            <button 
              className="btn-primary" 
              onClick={() => {
                if (tab === "staff") setInviteModal(true);
                else if (tab === "hubs") setHubModal(true);
                else if (tab === "locations") syncLocations();
              }}
              disabled={syncingLocations}
            >
              <Plus size={14} /> 
              {tab === "staff" ? "Invite Admin" : tab === "hubs" ? "Add Hub" : tab === "locations" ? (syncingLocations ? "Syncing..." : "Sync Locations") : "Add user"}
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

      <Modal
        open={hubModal}
        onClose={() => setHubModal(false)}
        title="Create New Hub"
        description="Establish a new collection point in the Recovang ecosystem."
        footer={
          <>
            <button className="btn-outline" onClick={() => setHubModal(false)}>Cancel</button>
            <button 
              className="btn-primary" 
              onClick={handleCreateHub} 
              disabled={creatingHub || !newHub.name || !newHub.state || !newHub.lga}
            >
              {creatingHub ? "Creating..." : "Create Hub"}
            </button>
          </>
        }
      >
        <div className="grid gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Hub Name</label>
            <input 
              className="input" 
              placeholder="e.g. Lekki Central Hub" 
              value={newHub.name}
              onChange={e => setNewHub(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">State</label>
              <select 
                className="input" 
                value={newHub.state}
                onChange={e => setNewHub(prev => ({ ...prev, state: e.target.value, lga: "" }))}
              >
                <option value="">Select State</option>
                {locationsData.map(s => <option key={s.state} value={s.state}>{s.state.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">LGA</label>
              <select 
                className="input" 
                value={newHub.lga}
                onChange={e => setNewHub(prev => ({ ...prev, lga: e.target.value }))}
                disabled={!newHub.state}
              >
                <option value="">Select LGA</option>
                {newHub.state && locationsData.find(s => s.state === newHub.state)?.lgas.map(l => (
                  <option key={l.lga} value={l.lga}>{l.lga.replace(/-/g, " ").toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Storage Capacity (Kg)</label>
            <input 
              className="input" 
              type="number"
              value={newHub.capacityKg}
              onChange={e => setNewHub(prev => ({ ...prev, capacityKg: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Hub Manager (Agent)</label>
            <select 
              className="input" 
              value={newHub.ownerAgentId}
              onChange={e => setNewHub(prev => ({ ...prev, ownerAgentId: e.target.value }))}
            >
              <option value="">Select Manager (Optional)</option>
              {agents?.map((a: any) => (
                <option key={a.id} value={a.id}>{a.user?.firstName} {a.user?.lastName} ({a.type})</option>
              ))}
            </select>
            <p className="text-[10px] text-textgray leading-relaxed">Assign an agent to manage this hub immediately upon creation.</p>
          </div>
        </div>
      </Modal>
      {/* Action Confirmation Modal */}
      {actionModal.type === "reject" ? (
        <Modal
          open={actionModal.open}
          onClose={() => setActionModal({ ...actionModal, open: false })}
          title={actionModal.title}
          description={actionModal.description}
          footer={
            <>
              <button className="btn-outline" onClick={() => setActionModal({ ...actionModal, open: false })}>Cancel</button>
              <button 
                className="btn-primary !bg-error" 
                disabled={!actionModal.reason}
                onClick={() => {
                  manageInvite({ id: actionModal.row.id, action: "reject", reason: actionModal.reason });
                  setActionModal({ ...actionModal, open: false });
                }}
              >
                Confirm Rejection
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-textgray">Reason for rejection</label>
            <textarea
              className="w-full rounded-2xl border border-bordergray p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px]"
              placeholder="Explain why this request is being rejected..."
              value={actionModal.reason}
              onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
            />
          </div>
        </Modal>
      ) : actionModal.type === "approve" ? (
        <Modal
          open={actionModal.open}
          onClose={() => setActionModal({ ...actionModal, open: false })}
          title={actionModal.title}
          description={actionModal.description}
          footer={
            <>
              <button className="btn-outline" onClick={() => setActionModal({ ...actionModal, open: false })}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  approveOfficial({ id: actionModal.row.id, hubId: actionModal.selectedHubId });
                  setActionModal({ ...actionModal, open: false });
                }}
              >
                Confirm Approval
              </button>
            </>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl bg-cream/50 p-4 border border-bordergray/50">
              <Avatar name={`${actionModal.row?.firstName} ${actionModal.row?.lastName}`} size={48} />
              <div>
                <div className="font-extrabold text-charcoal">{actionModal.row?.firstName} {actionModal.row?.lastName}</div>
                <div className="flex items-center gap-2 text-xs text-textgray">
                  <span>Applying from: <span className="font-bold text-charcoal">{actionModal.row?.lga}, {actionModal.row?.state}</span></span>
                  <span className="h-1 w-1 rounded-full bg-bordergray" />
                  <span className="capitalize font-bold text-primary">{actionModal.row?.workMode || 'Hub'} Agent</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-textgray">Assign to Hub (Optional)</label>
              <select 
                className="input w-full"
                value={actionModal.selectedHubId || ""}
                onChange={(e) => setActionModal({ ...actionModal, selectedHubId: e.target.value })}
              >
                <option value="">No assignment for now</option>
                {hubs?.map((h: any) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.lga}, {h.state})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-textgray italic">
                Assigning a hub now will automatically set up the agent's dashboard upon login.
              </p>
            </div>
          </div>
        </Modal>
      ) : (
        <ConfirmModal
          open={actionModal.open}
          onClose={() => setActionModal({ ...actionModal, open: false })}
          title={actionModal.title}
          description={actionModal.description}
          tone={actionModal.type === "delete" ? "danger" : "primary"}
          confirmLabel={actionModal.type === "delete" ? "Delete Forever" : "Confirm Approval"}
          onConfirm={() => {
            if (actionModal.type === "delete") deleteOfficial(actionModal.row.id);
          }}
        />
      )}
    </>
  );
}
