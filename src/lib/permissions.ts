import { useAuth, type AuthUser } from "@/store/auth";

export const PERMISSIONS = {
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_HUBS: "MANAGE_HUBS",
  MANAGE_PRICING: "MANAGE_PRICING",
  MANAGE_FINANCE: "MANAGE_FINANCE",
  MANAGE_FRAUD: "MANAGE_FRAUD",
  MANAGE_LOGISTICS: "MANAGE_LOGISTICS",
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
  MANAGE_ADMINS: "MANAGE_ADMINS",
  MANAGE_SYSTEM: "MANAGE_SYSTEM",
  ALL: "ALL",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const PERMISSION_LABELS: Record<Permission, { label: string; description: string }> = {
  MANAGE_USERS: { label: "Manage users", description: "Suspend, unsuspend and view PII for collectors and agents." },
  MANAGE_HUBS: { label: "Manage hubs", description: "Create new hubs, edit operating hours, transfer agents." },
  MANAGE_PRICING: { label: "Set pricing", description: "Adjust naira-per-kg rates for materials." },
  MANAGE_FINANCE: { label: "Approve payouts", description: "Bulk-approve withdrawals and view treasury." },
  MANAGE_FRAUD: { label: "Resolve fraud", description: "Approve, reject or escalate flagged drops." },
  MANAGE_LOGISTICS: { label: "Manage logistics", description: "Onboard fleet partners and manage routes." },
  VIEW_AUDIT_LOGS: { label: "View audit logs", description: "Read-only access to platform audit trail." },
  MANAGE_ADMINS: { label: "Manage admin team", description: "Add, remove and assign permissions to other admins." },
  MANAGE_SYSTEM: { label: "System operations", description: "Maintenance windows, feature flags, integrations." },
  ALL: { label: "Full access", description: "Super-admin override — every action permitted." },
};

export function hasPermission(user: AuthUser | null, perm: Permission): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  const p = user.permissions ?? [];
  return p.includes("ALL") || p.includes(perm);
}

export function usePermission(perm: Permission): boolean {
  const user = useAuth((s) => s.user);
  return hasPermission(user, perm);
}

export function usePermissions() {
  const user = useAuth((s) => s.user);
  return {
    user,
    has: (p: Permission) => hasPermission(user, p),
    isSuperAdmin: user?.role === "super_admin",
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
  };
}
