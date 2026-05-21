import { useAuth, type AuthUser } from "@/store/auth";

export const PERMISSIONS = {
  MANAGE_USERS: "users.manage",
  MANAGE_HUBS: "hubs.manage",
  MANAGE_PRICING: "pricing.manage",
  MANAGE_FINANCE: "finance.payouts",
  MANAGE_FRAUD: "fraud.manage",
  MANAGE_LOGISTICS: "logistics.manage",
  VIEW_AUDIT_LOGS: "audit.view",
  MANAGE_ADMINS: "admins.manage",
  MANAGE_SYSTEM: "system.settings",
  MANAGE_FLEET: "fleet.recruitment",
  ALL: "ALL",
} as const;

export type Permission = string;

export const PERMISSION_LABELS: Record<string, { label: string; description: string }> = {
  "users.view": { label: "View users", description: "Read-only access to collector and agent lists." },
  "users.manage": { label: "Manage users", description: "Suspend, unsuspend and view PII for collectors and agents." },
  "users.kyc": { label: "Approve KYC", description: "Review and verify identity documents." },
  "hubs.view": { label: "View hubs", description: "Read-only access to hub locations and status." },
  "hubs.manage": { label: "Manage hubs", description: "Create new hubs, edit operating hours, transfer agents." },
  "pricing.manage": { label: "Set pricing", description: "Adjust naira-per-kg rates for materials." },
  "finance.view": { label: "View financials", description: "Read-only access to payout history and treasury." },
  "finance.payouts": { label: "Approve payouts", description: "Bulk-approve withdrawals and manage disbursements." },
  "fraud.manage": { label: "Resolve fraud", description: "Approve, reject or escalate flagged drops." },
  "logistics.manage": { label: "Manage logistics", description: "Onboard fleet partners and manage routes." },
  "audit.view": { label: "View audit logs", description: "Read-only access to platform audit trail." },
  "admins.manage": { label: "Manage admin team", description: "Add, remove and assign permissions to other admins." },
  "system.settings": { label: "System operations", description: "Maintenance windows, feature flags, integrations." },
  "fleet.recruitment": { label: "Fleet Recruitment", description: "Approve or reject official agent applications." },
  "ALL": { label: "Full access", description: "Super-admin override — every action permitted." },
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
