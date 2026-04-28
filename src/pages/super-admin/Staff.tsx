import { useMemo, useState } from "react";
import { Activity, Filter, MapPin, Plus, Search, Shield, ShieldCheck, ShieldOff, UserPlus, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { PERMISSION_LABELS, type Permission } from "@/lib/permissions";

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

const ADMIN_TEAM: AdminRow[] = [
  { id: "ad_01", name: "Olamide Adesanya", email: "olamide@recovang.com", region: "Headquarters · VI", role: "super_admin", status: "active", lastSeen: "now", permissions: ["ALL"], actions: 482 },
  { id: "ad_02", name: "Sade Ijeoma", email: "sade@recovang.com", region: "Lagos · South-West", role: "admin", status: "active", lastSeen: "12m ago", permissions: ["MANAGE_USERS", "MANAGE_HUBS", "MANAGE_FRAUD", "VIEW_AUDIT_LOGS"], actions: 318 },
  { id: "ad_03", name: "Hauwa Bala", email: "hauwa@recovang.com", region: "Abuja · FCT", role: "admin", status: "active", lastSeen: "42m ago", permissions: ["MANAGE_USERS", "MANAGE_FINANCE", "MANAGE_FRAUD", "VIEW_AUDIT_LOGS"], actions: 186 },
  { id: "ad_04", name: "Ibe Nwankwo", email: "ibe@recovang.com", region: "Port Harcourt · South-South", role: "admin", status: "active", lastSeen: "2h ago", permissions: ["MANAGE_USERS", "MANAGE_HUBS", "VIEW_AUDIT_LOGS"], actions: 142 },
  { id: "ad_05", name: "Tope Bello", email: "tope@recovang.com", region: "Ibadan · South-West", role: "admin", status: "active", lastSeen: "1d ago", permissions: ["MANAGE_USERS", "MANAGE_FRAUD"], actions: 96 },
  { id: "ad_06", name: "Musa Adamu", email: "musa@recovang.com", region: "Kano · North-West", role: "admin", status: "active", lastSeen: "3d ago", permissions: ["MANAGE_USERS", "MANAGE_HUBS"], actions: 64 },
  { id: "ad_07", name: "Funmi Akande", email: "funmi@recovang.com", region: "Pricing & finance", role: "admin", status: "active", lastSeen: "5h ago", permissions: ["MANAGE_PRICING", "MANAGE_FINANCE", "VIEW_AUDIT_LOGS"], actions: 248 },
  { id: "ad_08", name: "Bayo Ogunlesi", email: "bayo@recovang.com", region: "Logistics ops", role: "admin", status: "active", lastSeen: "18m ago", permissions: ["MANAGE_LOGISTICS", "MANAGE_HUBS", "VIEW_AUDIT_LOGS"], actions: 124 },
  { id: "ad_09", name: "Ngozi Okeke", email: "ngozi@recovang.com", region: "Trust & Safety", role: "admin", status: "active", lastSeen: "1h ago", permissions: ["MANAGE_FRAUD", "MANAGE_USERS", "VIEW_AUDIT_LOGS"], actions: 412 },
  { id: "ad_10", name: "Aisha Mohammed", email: "aisha.m@recovang.com", region: "Kaduna · North-West", role: "admin", status: "invited", lastSeen: "—", permissions: [], actions: 0 },
  { id: "ad_11", name: "Chuka Eze", email: "chuka@recovang.com", region: "Calabar · South-South", role: "admin", status: "invited", lastSeen: "—", permissions: [], actions: 0 },
  { id: "ad_12", name: "Joy Eze", email: "joy@recovang.com", region: "Enugu · South-East", role: "admin", status: "suspended", lastSeen: "14d ago", permissions: ["MANAGE_USERS"], actions: 22 },
];

const STATUS_LABEL: Record<AdminRow["status"], { label: string; tone: "success" | "warning" | "error" }> = {
  active: { label: "Active", tone: "success" },
  invited: { label: "Invited", tone: "warning" },
  suspended: { label: "Suspended", tone: "error" },
};

export default function SuperAdminStaff() {
  const [team, setTeam] = useState<AdminRow[]>(ADMIN_TEAM);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminRow["status"]>("all");
  const [modal, setModal] = useState<{ open: boolean; row: AdminRow | null }>({ open: false, row: null });
  const [draftPerms, setDraftPerms] = useState<Permission[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return team.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.region.toLowerCase().includes(q);
    });
  }, [team, query, statusFilter]);

  const counts = {
    total: team.length,
    active: team.filter((r) => r.status === "active").length,
    invited: team.filter((r) => r.status === "invited").length,
    suspended: team.filter((r) => r.status === "suspended").length,
    actions: team.reduce((s, r) => s + r.actions, 0),
  };

  function openPermissions(row: AdminRow) {
    setModal({ open: true, row });
    setDraftPerms([...row.permissions]);
  }

  function togglePerm(p: Permission) {
    setDraftPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function savePermissions() {
    if (!modal.row) return;
    setTeam((prev) => prev.map((r) => (r.id === modal.row!.id ? { ...r, permissions: draftPerms } : r)));
    setModal({ open: false, row: null });
  }

  function toggleSuspend(row: AdminRow) {
    setTeam((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: r.status === "suspended" ? "active" : "suspended" } : r)));
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
        <div className="flex flex-wrap items-center gap-2 border-b border-bordergray bg-cream/40 p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-10" placeholder="Search by name, email, region…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white p-1 text-[11px] font-bold">
            {(["all", "active", "invited", "suspended"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 capitalize ${statusFilter === s ? "bg-charcoal text-white" : "text-textgray hover:bg-cream"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-outline btn-sm"><Filter size={12} /> Region</button>
        </div>

        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Region / scope</th>
                <th>Role</th>
                <th>Permissions</th>
                <th className="text-right">Actions · 30d</th>
                <th>Status</th>
                <th>Last seen</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isSuper = r.role === "super_admin";
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} size={32} />
                        <div className="min-w-0">
                          <div className="font-extrabold">{r.name}</div>
                          <div className="truncate text-[11px] text-textgray">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">
                      <div className="flex items-center gap-1.5"><MapPin size={11} className="text-textgray" /> {r.region}</div>
                    </td>
                    <td>
                      {isSuper ? (
                        <span className="badge inline-flex items-center gap-1 bg-charcoal text-white"><ShieldCheck size={11} /> Super Admin</span>
                      ) : (
                        <span className="badge bg-mint text-primary"><Shield size={11} /> Admin</span>
                      )}
                    </td>
                    <td>
                      {r.permissions.includes("ALL") ? (
                        <span className="badge bg-charcoal/10 text-charcoal">All access</span>
                      ) : r.permissions.length === 0 ? (
                        <span className="text-[11px] text-textgray">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {r.permissions.slice(0, 3).map((p) => (
                            <span key={p} className="badge bg-cream text-charcoal/80 text-[10px]">{PERMISSION_LABELS[p].label}</span>
                          ))}
                          {r.permissions.length > 3 && (
                            <span className="badge bg-cream text-charcoal/60 text-[10px]">+{r.permissions.length - 3}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="text-right font-mono text-sm">{r.actions}</td>
                    <td><StatusPill status={STATUS_LABEL[r.status].tone} label={STATUS_LABEL[r.status].label} /></td>
                    <td className="font-mono text-[11px] text-textgray">{r.lastSeen}</td>
                    <td className="text-right">
                      <div className="inline-flex gap-1">
                        <button
                          className="btn-outline btn-sm text-[11px]"
                          onClick={() => openPermissions(r)}
                          disabled={isSuper}
                          title={isSuper ? "Super Admin permissions cannot be edited" : "Edit permissions"}
                        >
                          Edit perms
                        </button>
                        <button
                          className="btn-ghost btn-sm text-[11px]"
                          onClick={() => toggleSuspend(r)}
                          disabled={isSuper}
                          title={isSuper ? "Cannot suspend Super Admin" : r.status === "suspended" ? "Re-activate" : "Suspend"}
                        >
                          {r.status === "suspended" ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, row: null })}
        title={`Permissions · ${modal.row?.name ?? ""}`}
        description={`Choose exactly what ${modal.row?.name?.split(" ")[0] ?? "this admin"} can do. Changes apply immediately and are audit-logged.`}
        footer={
          <>
            <button className="btn-outline" onClick={() => setModal({ open: false, row: null })}>Cancel</button>
            <button className="btn-primary" onClick={savePermissions}>Save permissions</button>
          </>
        }
      >
        <div className="grid gap-2.5 max-h-[60vh] overflow-y-auto">
          {(Object.keys(PERMISSION_LABELS) as Permission[]).map((p) => {
            const checked = draftPerms.includes(p);
            const meta = PERMISSION_LABELS[p];
            const isAll = p === "ALL";
            return (
              <label key={p} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${checked ? "border-primary bg-mint/30" : "border-bordergray hover:bg-cream/50"}`}>
                <input type="checkbox" className="mt-1 accent-primary" checked={checked} onChange={() => togglePerm(p)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider">
                    {isAll && <ShieldCheck size={12} className="text-error" />} {meta.label}
                    {isAll && <span className="badge bg-error-50 text-error text-[9px]">Super only</span>}
                  </div>
                  <div className="mt-1 text-[11px] text-textgray">{meta.description}</div>
                </div>
              </label>
            );
          })}
        </div>
      </Modal>

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
