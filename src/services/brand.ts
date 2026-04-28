import api from "./api";
import { BrandDashboard, PaymentInitiateRequest, BrandFinancials } from "../@types/brand";

export const brandService = {
  getDashboard: () => 
    api.get<BrandDashboard>("/brand/dashboard"),
    
  getComplianceStatus: () => 
    api.get("/brand/compliance/current"),
    
  getRecoveryByCategory: () => 
    api.get("/brand/recovery/by-category"),
    
  initiatePayment: (data: PaymentInitiateRequest) => 
    api.post("/brand/payments/initiate", data),
    
  getFinancials: () => 
    api.get<BrandFinancials>("/brand/financials"),
    
  getImpactReport: (quarter: string) => 
    api.get(`/brand/impact-report/${quarter}`, { responseType: 'blob' }),
};
