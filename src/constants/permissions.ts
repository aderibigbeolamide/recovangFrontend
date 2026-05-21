export const PERMISSIONS = {
  // User Management
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  USERS_KYC: "users.kyc",
  USERS_SUSPEND: "users.suspend",
  USERS_DELETE: "users.delete",
  USERS_IMPERSONATE: "users.impersonate",
  USERS_MESSAGE: "users.message",
  USERS_NOTES: "users.notes",

  // Hub & Inventory
  HUBS_VIEW: "hubs.view",
  HUBS_MANAGE: "hubs.manage",
  HUBS_INVENTORY: "hubs.inventory",

  // Agent Management
  AGENTS_VIEW: "agents.view",
  AGENTS_MANAGE: "agents.manage",
  AGENTS_ASSIGN: "agents.assign",
  FLEET_RECRUITMENT: "fleet.recruitment",

  // Financials
  FINANCE_VIEW: "finance.view",
  FINANCE_PAYOUTS: "finance.payouts",
  FINANCE_EXPORT: "finance.export",

  // Operations
  PRICING_MANAGE: "pricing.manage",
  LOGISTICS_MANAGE: "logistics.manage",
  FACTORIES_VIEW: "factories.view",
  FACTORIES_MANAGE: "factories.manage",
  BRANDS_VIEW: "brands.view",
  BRANDS_MANAGE: "brands.manage",
  LOCATIONS_MANAGE: "locations.manage",
  
  // Administration & Analytics
  ADMINS_MANAGE: "admins.manage",
  SYSTEM_SETTINGS: "system.settings",
  ANALYTICS_VIEW: "analytics.view",
  AUDIT_VIEW: "audit.view",
} as const;

export const PERMISSION_GROUPS = [
  {
    name: "User Management",
    permissions: [
      { key: PERMISSIONS.USERS_VIEW, label: "View Users" },
      { key: PERMISSIONS.USERS_MANAGE, label: "Edit Profiles" },
      { key: PERMISSIONS.USERS_KYC, label: "Approve KYC" },
      { key: PERMISSIONS.USERS_SUSPEND, label: "Suspend Users" },
      { key: PERMISSIONS.USERS_MESSAGE, label: "Send Messages" },
      { key: PERMISSIONS.USERS_NOTES, label: "Manage Notes" },
      { key: PERMISSIONS.USERS_IMPERSONATE, label: "Impersonate (Login as)" },
      { key: PERMISSIONS.USERS_DELETE, label: "Delete Users" },
    ]
  },
  {
    name: "Hubs & Inventory",
    permissions: [
      { key: PERMISSIONS.HUBS_VIEW, label: "View Hubs" },
      { key: PERMISSIONS.HUBS_MANAGE, label: "Manage Hubs" },
      { key: PERMISSIONS.HUBS_INVENTORY, label: "View Inventory" },
    ]
  },
  {
    name: "Agent Management",
    permissions: [
      { key: PERMISSIONS.AGENTS_VIEW, label: "View Agents" },
      { key: PERMISSIONS.AGENTS_MANAGE, label: "Manage Agents" },
      { key: PERMISSIONS.AGENTS_ASSIGN, label: "Assign Agents" },
      { key: PERMISSIONS.FLEET_RECRUITMENT, label: "Fleet Recruitment" },
    ]
  },
  {
    name: "Financials",
    permissions: [
      { key: PERMISSIONS.FINANCE_VIEW, label: "View Financials" },
      { key: PERMISSIONS.FINANCE_PAYOUTS, label: "Approve Payouts" },
      { key: PERMISSIONS.FINANCE_EXPORT, label: "Export Reports" },
    ]
  },
  {
    name: "Operations & Partnerships",
    permissions: [
      { key: PERMISSIONS.LOGISTICS_MANAGE, label: "Manage Logistics" },
      { key: PERMISSIONS.FACTORIES_MANAGE, label: "Manage Factories" },
      { key: PERMISSIONS.BRANDS_MANAGE, label: "Manage Brands" },
      { key: PERMISSIONS.PRICING_MANAGE, label: "Manage Pricing" },
      { key: PERMISSIONS.LOCATIONS_MANAGE, label: "Manage Locations" },
    ]
  },
  {
    name: "Administration",
    permissions: [
      { key: PERMISSIONS.ADMINS_MANAGE, label: "Manage Staff" },
      { key: PERMISSIONS.SYSTEM_SETTINGS, label: "System Settings" },
      { key: PERMISSIONS.ANALYTICS_VIEW, label: "View Analytics" },
      { key: PERMISSIONS.AUDIT_VIEW, label: "View Audit Logs" },
    ]
  }
];
