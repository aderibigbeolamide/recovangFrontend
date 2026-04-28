export interface CollectorDashboard {
  balance: number;
  totalKg: number;
  totalSubmissions: number;
  points: number;
  recentActivity: any[];
  nearbyHubs: any[];
}

export interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface EarningSummary {
  weekly: number;
  monthly: number;
  total: number;
}

export interface UtilityPurchaseRequest {
  type: "AIRTIME" | "DATA" | "ELECTRICITY" | "BILLS";
  amount: number;
  targetAccount: string;
  provider?: string;
}
