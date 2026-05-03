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
  createAdmin: (data: { email: string; firstName: string; lastName: string; permissions: string[] }) =>
    api.post("/admin/admins", data),
  
  getCollectors: (params?: any) => api.get("/admin/collectors", { params }),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  verifyKYC: (userId: string) => api.post(`/admin/users/${userId}/kyc/verify`),
  rejectKYC: (userId: string, reason: string) => api.post(`/admin/users/${userId}/kyc/reject`, { reason }),
  addUserNote: (userId: string, content: string) => api.post(`/admin/users/${userId}/notes`, { content }),
  getUserNotes: (userId: string) => api.get(`/admin/users/${userId}/notes`),
  sendMessage: (userId: string, data: { title: string; message: string }) => api.post(`/admin/users/${userId}/message`, data),
  getUserMessages: (userId: string) => api.get(`/admin/users/${userId}/messages`),
  getActiveRoutes: () => api.get("/admin/logistics/routes"),
  manualDispatch: (data: any) => api.post("/admin/logistics/dispatch", data),
  verifyDelivery: (id: string, data: any) => api.put(`/admin/logistics/routes/${id}/verify`, data),
  togglePartnerAvailability: (id: string) => api.put(`/admin/logistics/partners/${id}/toggle-availability`),
  bulkUserAction: (data: { userIds: string[]; action: string }) => api.post("/admin/users/bulk", data),
  suspendUser: (id: string) => api.put(`/admin/users/${id}/suspend`),
  unsuspendUser: (id: string) => api.put(`/admin/users/${id}/unsuspend`),
  
  getAgents: (params?: any) => api.get("/admin/agents", { params }),
  createAgent: (data: { firstName: string; lastName: string; email: string; phoneNumber: string; assignedHubId: string }) => 
    api.post("/admin/agents", data),

  // 3. Financial & Pricing Control
  updatePricing: (data: { categoryId: string; pricePerKg: number; effectiveDate: string }) => 
    api.post("/admin/pricing", data),
  getPricing: () => api.get("/admin/pricing"),
  getPricingHistory: () => api.get("/admin/pricing/history"),
  getWasteCategories: () => api.get("/admin/waste-categories"),
  createCategory: (data: any) => api.post("/admin/waste-categories", data),
  
  getWithdrawals: (status = "pending") => api.get("/admin/payments/withdrawals", { params: { status } }),
  updateWithdrawalStatus: (id: string, status: string, reason?: string) => 
    api.put(`/admin/payments/withdrawals/${id}/status`, { status, reason }),
  bulkApprovePayouts: (ids: string[]) => api.post("/admin/payments/bulk-approve", { ids }),

  // 4. Fraud & Security
  getFlaggedSubmissions: () => api.get("/admin/submissions/flagged"),
  getFraudAlerts: () => api.get("/admin/fraud/alerts"),
  reviewFraudAlert: (id: string, data: { action: string; reason?: string }) => 
    api.post(`/admin/fraud/review/${id}`, data),
  getAuditLogs: (params?: any) => api.get("/admin/audit-logs", { params }),

  // 5. Hub & Logistics Onboarding
  getHubs: () => api.get("/admin/hubs"),
  createHub: (data: { name: string; location: string; capacityKg: number; agentId: string }) => 
    api.post("/admin/hubs", data),
  getHubDetails: (id: string) => api.get(`/admin/hubs/${id}`),
  
  getLogistics: () => api.get("/admin/logistics"),
  getTodayLogisticsStats: () => api.get("/admin/logistics/today-stats"),
  onboardLogistics: (data: { companyName: string; fleetSize: number; primaryRoute: string; apiKey?: string }) => 
    api.post("/admin/logistics/onboard", data),

  // 6. Global System Settings
  getSettings: () => api.get("/admin/settings"),
  updateSetting: (key: string, value: string) => 
    api.put("/admin/settings", { key, value }),

  impersonateUser: (id: string) =>
    api.post(`/admin/impersonate/${id}`),

  getSystemHealth: () => api.get("/admin/system/health"),
  getTreasuryReport: () => api.get("/admin/finance/treasury"),

  setup2FA: () => api.post("/admin/auth/2fa/setup"),
  verify2FA: (token: string) => api.post("/admin/auth/2fa/verify", { token }),

  exportData: (resource: string) =>
    api.get(`/admin/export/${resource}`, { responseType: "blob" }),

  toggleSurge: (id: string, data: { isActive: boolean; multiplier: number }) =>
    api.put(`/admin/pricing/categories/${id}/toggle-surge`, data),

  getBrandSustainability: (id: string) =>
    api.get(`/admin/brands/${id}/sustainability`),

  getBrands: () => api.get("/admin/brands"),

  getAgentInviteRequests: () => api.get("/admin/agents/invite-requests"),
  approveAgentInvite: (id: string) => api.post(`/admin/agents/invite-requests/${id}/approve`),
  rejectAgentInvite: (id: string, reason: string) => api.post(`/admin/agents/invite-requests/${id}/reject`, { reason }),
};
