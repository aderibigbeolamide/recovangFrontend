import api from "./api";

/**
 * Super Admin Management Service
 * Total control over users, financials, hubs, and fraud security.
 */
export const adminService = {
  // 1. Dashboard & Analytics
  getDashboard: () => api.get("/admin/dashboard"),
  getAnalyticsOverview: () => api.get("/admin/analytics/overview"),
  getEcosystemHealth: () => api.get("/admin/analytics/ecosystem"),
  getWasteByCategory: () => api.get("/admin/waste-by-category"),

  // 2. User & Admin Management
  getAdmins: () => api.get("/admin/admins"),
  setAdminPermissions: (id: string, permissions: string[]) => 
    api.put(`/admin/admins/${id}/permissions`, { permissions }),
  
  getCollectors: (params?: any) => api.get("/admin/collectors", { params }),
  suspendCollector: (id: string) => api.put(`/admin/collectors/${id}/suspend`),
  
  getAgents: (params?: any) => api.get("/admin/agents", { params }),
  createAgent: (data: { firstName: string; lastName: string; email: string; phoneNumber: string; assignedHubId: string }) => 
    api.post("/admin/agents", data),

  // 3. Financial & Pricing Control
  updatePricing: (data: { categoryId: string; pricePerKg: number; effectiveDate: string }) => 
    api.post("/admin/pricing", data),
  
  getWithdrawals: (status = "pending") => api.get("/admin/payments/withdrawals", { params: { status } }),
  bulkApprovePayouts: (ids: string[]) => api.post("/admin/payments/bulk-approve", { ids }),

  // 4. Fraud & Security
  getFlaggedSubmissions: () => api.get("/admin/submissions/flagged"),
  getAuditLogs: (params?: any) => api.get("/admin/audit-logs", { params }),

  // 5. Hub & Logistics Onboarding
  getHubs: () => api.get("/admin/hubs"),
  createHub: (data: { name: string; location: string; capacityKg: number; agentId: string }) => 
    api.post("/admin/hubs", data),
  
  getLogistics: () => api.get("/admin/logistics"),
  onboardLogistics: (data: { companyName: string; fleetSize: number; primaryRoute: string; apiKey?: string }) => 
    api.post("/admin/logistics/onboard", data),
};
