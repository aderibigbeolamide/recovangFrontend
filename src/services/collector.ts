import api from "./api";
import { 
  CollectorDashboard, 
  BankAccount, 
  EarningSummary, 
  UtilityPurchaseRequest 
} from "../@types/collector";

export const collectorService = {
  getDashboard: () => 
    api.get<CollectorDashboard>("/collector/dashboard"),
    
  getProfile: () => 
    api.get("/collector/profile"),
    
  updateProfile: (data: any) => 
    api.put("/collector/profile", data),
    
  updateBank: (data: BankAccount) => 
    api.post("/collector/bank-account", data),
    
  verifyBank: (data: { bankCode: string; accountNumber: string }) => 
    api.post("/collector/bank-account/verify", data),
    
  getBalance: () => 
    api.get("/collector/balance"),
    
  getEarningsSummary: () => 
    api.get<EarningSummary>("/collector/earnings/summary"),
    
  getEarningsHistory: () => 
    api.get("/collector/earnings/history"),
    
  getSubmissions: () => 
    api.get("/collector/submissions"),
    
  disputeSubmission: (id: string, reason: string) => 
    api.post(`/collector/submissions/${id}/dispute`, { reason }),
    
  getNearbyHubs: (params?: { lat?: number; lng?: number }) => 
    api.get("/collector/hubs/nearby", { params }),
    
  getLeaderboard: () => 
    api.get("/collector/leaderboard"),
    
  getBadges: () => 
    api.get("/collector/badges"),
    
  getNotifications: () => 
    api.get("/collector/notifications"),
    
  markNotificationRead: (id: string) => 
    api.put(`/collector/notifications/${id}/read`),
    
  markAllNotificationsRead: () => 
    api.put("/collector/notifications/read-all"),
    
  getReferral: () => 
    api.get("/collector/referral"),
    
  getStreak: () => 
    api.get("/collector/streak"),
    
  purchaseUtility: (data: UtilityPurchaseRequest) => 
    api.post("/collector/utilities/purchase", data),
};
