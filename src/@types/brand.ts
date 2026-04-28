export interface BrandDashboard {
  brand: string;
  quarter: string;
  fyTarget: number;
  recovered: number;
  outstandingFee: number;
  certIssued: number;
  monthly: { label: string; value: number }[];
  byCategory: { name: string; recovered: number; target: number; color: string }[];
  recentRecoveries: any[];
}

export interface PaymentInitiateRequest {
  amount: number;
  type: "COMPLIANCE_FEE" | "CUSTOM";
  callbackUrl: string;
}

export interface BrandFinancials {
  transactions: any[];
  totalPaid: number;
  outstanding: number;
}
