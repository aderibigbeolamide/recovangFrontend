import api from "./api";
import { 
  PickupRequest, 
  FactoryDashboard, 
  WasteSupply, 
  WasteCategory, 
  Hub, 
  BlogPost, 
  AdminDashboard 
} from "../@types/shared";

// LOGISTICS
export const logisticsService = {
  requestPickup: (data: any) => api.post("/logistics/pickups/request", data),
  getPendingPickups: () => api.get<PickupRequest[]>("/logistics/pickups/pending"),
  acceptPickup: (id: string) => api.post(`/logistics/pickups/${id}/accept`),
  updatePickupStatus: (id: string, status: string) => api.put(`/logistics/pickups/${id}/status`, { status }),
  updateLocation: (lat: number, lng: number) => api.put("/logistics/location", { lat, lng }),
};

// FACTORY
export const factoryService = {
  getDashboard: () => api.get<FactoryDashboard>("/factory/dashboard"),
  getSupply: () => api.get<WasteSupply[]>("/factory/supply"),
  getSupplyByCategory: (slug: string) => api.get(`/factory/supply/${slug}`),
  placeOrder: (data: any) => api.post("/factory/orders", data),
  getOrders: () => api.get("/factory/orders"),
  getOrderDetails: (id: string) => api.get(`/factory/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/factory/orders/${id}/cancel`),
  confirmReceipt: (data: any) => api.post("/factory/confirm-receipt", data),
};

// WITHDRAWALS
export const withdrawalService = {
  getHistory: () => api.get("/withdrawals"),
  toBank: (data: any) => api.post("/withdrawals/bank", data),
  toAirtime: (data: any) => api.post("/withdrawals/airtime", data),
  toBills: (type: string, data: any) => api.post(`/withdrawals/bills/${type}`, data),
  getNetworks: () => api.get("/withdrawals/options/networks"),
};

// PUBLIC / SHARED
export const publicService = {
  // Submissions
  createSubmission: (data: any) => api.post("/submissions", data),
  getSubmission: (id: string) => api.get(`/submissions/${id}`),
  uploadPhotos: (id: string, formData: FormData) => 
    api.post(`/submissions/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  syncSubmissions: (data: any[]) => api.post("/submissions/sync", { submissions: data }),
  
  // Pricing
  getPrices: () => api.get("/pricing"),
  calculatePrice: (params: any) => api.get("/pricing/calculate", { params }),
  
  // Hubs
  getHubs: () => api.get<Hub[]>("/hubs"),
  getNearbyHubs: (params: any) => api.get<Hub[]>("/hubs/nearby", { params }),
  getHubDetails: (id: string) => api.get<Hub>(`/hubs/${id}`),
  
  // Waste
  getCategories: () => api.get<WasteCategory[]>("/waste-categories"),
  getCategory: (slug: string) => api.get<WasteCategory>(`/waste-categories/${slug}`),
  
  // Blog
  getPosts: () => api.get<BlogPost[]>("/blog"),
  getPost: (slug: string) => api.get<BlogPost>(`/blog/${slug}`),
};

// ADMIN
export const adminService = {
  getDashboard: () => api.get<AdminDashboard>("/admin/dashboard"),
  getAnalytics: (type: string) => api.get(`/admin/analytics/${type}`),
  getCollectors: () => api.get("/admin/collectors"),
  suspendCollector: (id: string) => api.put(`/admin/collectors/${id}/suspend`),
  createAgent: (data: any) => api.post("/admin/agents", data),
  manageHubs: (data: any) => api.post("/admin/hubs", data),
  getFlaggedSubmissions: () => api.get("/admin/submissions/flagged"),
  approveBulkPayments: (ids: string[]) => api.post("/admin/payments/bulk-approve", { ids }),
  updatePricing: (data: any) => api.post("/admin/pricing", data),
  onboardLogistics: (data: any) => api.post("/admin/logistics/onboard", data),
  registerSatelliteHub: (data: any) => api.post("/admin/hubs/satellite", data),
  getAdmins: () => api.get("/admin/admins"),
  updatePermissions: (id: string, perms: any) => api.put(`/admin/admins/${id}/permissions`, perms),
};
