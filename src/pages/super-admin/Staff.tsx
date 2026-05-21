import { useMemo, useState } from "react";
import { Activity, Filter, MapPin, Plus, Search, Shield, ShieldCheck, ShieldOff, UserPlus, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { StaffDetailDrawer } from "@/components/StaffDetailDrawer";
import { Modal } from "@/components/Modal";
import { PERMISSION_LABELS, type Permission } from "@/lib/permissions";
import { DataTable, type Column } from "@/components/DataTable";
import { useAdmins, useUpdateAdminPermissions, useSuspendUser, useUnsuspendUser } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  region: string;
  role: "super_admin" | "admin";
  status: "active" | "invited" | "suspended";
  lastSeen: string;
  permissions: Permission[];
  actions: number;
};

// Static team moved to useAdmins hook

const STATUS_LABEL: Record<AdminRow["status"], { label: string; tone: "success" | "warning" | "error" }> = {
  active: { label: "Active", tone: "success" },
  invited: { label: "Invited", tone: "warning" },
  suspended: { label: "Suspended", tone: "error" },
};

export default function SuperAdminStaff() {
  const { data: admins = [], isLoading } = useAdmins();
  const { mutate: updatePermissions } = useUpdateAdminPermissions();
  const { mutate: suspend } = useSuspendUser();
  const { mutate: unsuspend } = useUnsuspendUser();

  const [statusFilter, setStatusFilter] = useState<"all" | AdminRow["status"]>("all");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const counts = {
    total: admins.length,
    active: admins.filter((r: any) => r.status === "active").length,
    invited: admins.filter((r: any) => r.status === "invited").length,
    suspended: admins.filter((r: any) => r.status === "suspended").length,
    actions: admins.reduce((s: number, r: any) => s + (r.actions || 0), 0),
  };

  const columns: Column<AdminRow>[] = [
    {
      key: "admin",
      header: "Admin",
      render: (r) => (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedAdmin(r)}>
          <Avatar name={r.name} size={32} />
          <div className="min-w-0">
            <div className="font-extrabold group-hover:text-primary transition-colors">{r.name}</div>
            <div className="truncate text-[11px] text-textgray">{r.email}</div>
          </div>
        </div>
      ),
      searchValue: (r) => `${r.name} ${r.email}`
    },
    {
      key: "region",
      header: "Region / scope",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin size={11} className="text-textgray" /> {r.region}
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (r) => {
        const isSuper = r.role === "super_admin" || r.role === "SUPER_ADMIN";
        return isSuper ? (
          <span className="badge inline-flex items-center gap-1 bg-charcoal text-white"><ShieldCheck size={11} /> Super Admin</span>
        ) : (
          <span className="badge bg-mint text-primary"><Shield size={11} /> Admin</span>
        );
      }
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.permissions.includes("ALL") ? (
            <span className="badge bg-charcoal/10 text-charcoal">All access</span>
          ) : r.permissions.length === 0 ? (
            <span className="text-[11px] text-textgray">—</span>
          ) : (
            <>
              {r.permissions.slice(0, 2).map((p) => (
                <span key={p} className="badge bg-cream text-charcoal/80 text-[10px]">
                  {PERMISSION_LABELS[p as Permission]?.label || p}
                </span>
              ))}
              {r.permissions.length > 2 && (
                <span className="badge bg-cream text-charcoal/60 text-[10px]">+{r.permissions.length - 2}</span>
              )}
            </>
          )}
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions · 30d",
      className: "text-right",
      render: (r) => <span className="font-mono text-sm">{r.actions}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusPill status={STATUS_LABEL[r.status]?.tone || "warning"} label={STATUS_LABEL[r.status]?.label || r.status} />
    },
    {
      key: "manage",
      header: "Manage",
      className: "text-right",
      render: (r) => {
        const isSuper = r.role === "super_admin" || r.role === "SUPER_ADMIN";
        return (
          <div className="inline-flex gap-1">
            <button
              className="btn-outline btn-sm text-[11px]"
              onClick={(e) => { e.stopPropagation(); setSelectedAdmin(r); }}
              disabled={isSuper}
            >
              Edit perms
            </button>
            <button
              className="btn-ghost btn-sm text-[11px]"
              onClick={(e) => { e.stopPropagation(); toggleSuspend(r); }}
              disabled={isSuper}
            >
              {r.status === "suspended" ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
            </button>
          </div>
        );
      }
    }
  ];

  function toggleSuspend(row: AdminRow) {
    if (row.status === "suspended") unsuspend(row.id);
    else suspend(row.id);
  }

  return (
    <>
      <PageHeader
        eyebrow="Super Admin · Staff control"
        title="The admin team"
        subtitle="Add admins, assign permissions, reassign regions, suspend accounts. Every change here is logged immutably."
        actions={
          <>
            <button className="btn-outline"><Activity size={14} /> Audit team</button>
            <button className="btn-primary" onClick={() => setInviteOpen(true)}><UserPlus size={14} /> Invite admin</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total admins" value={String(counts.total)} sub={`${counts.active} active · ${counts.suspended} suspended`} icon={Users} variant="primary" />
        <KPICard label="Pending invites" value={String(counts.invited)} sub="Tap to resend" icon={UserPlus} variant="gold" />
        <KPICard label="Actions · 30d" value={counts.actions.toLocaleString()} sub="Across the whole team" icon={Activity} />
        <KPICard label="Permissions catalog" value={String(Object.keys(PERMISSION_LABELS).length)} sub="Granular access controls" icon={ShieldCheck} variant="dark" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <DataTable
          data={admins}
          columns={columns}
          rowKey={(r) => r.id}
          pageSize={10}
          isLoading={isLoading}
          filterOptions={[
            { label: "Active", value: "active" },
            { label: "Invited", value: "invited" },
            { label: "Suspended", value: "suspended" }
          ]}
          filterPredicate={(r, v) => r.status === v}
          searchPlaceholder="Search by name, email, region…"
          rightActions={
             <button className="btn-outline btn-sm"><Filter size={12} /> Region</button>
          }
        />
      </div>

      <StaffDetailDrawer
        admin={selectedAdmin}
        onClose={() => setSelectedAdmin(null)}
      />

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a new admin"
        description="They'll get an email with a one-time link to set up MFA and create a password."
        footer={
          <>
            <button className="btn-outline" onClick={() => setInviteOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => setInviteOpen(false)}>Send invite</button>
          </>
        }
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-bold">
            Full name
            <input className="input" placeholder="e.g. Aisha Mohammed" />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Work email
            <input className="input" type="email" placeholder="aisha@recovang.com" />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Region / scope
            <select className="input">
              <option>Lagos · South-West</option>
              <option>Abuja · FCT</option>
              <option>Port Harcourt · South-South</option>
              <option>Kaduna · North-West</option>
              <option>Pricing & finance</option>
              <option>Logistics ops</option>
              <option>Trust & Safety</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Starter permissions
            <select className="input">
              <option>Regional admin (users + hubs + audit)</option>
              <option>Finance admin (payouts + pricing)</option>
              <option>Trust & Safety (fraud + users)</option>
              <option>Read-only auditor</option>
              <option>Custom — set after invite</option>
            </select>
          </label>
        </div>
      </Modal>
    </>
  );
}
