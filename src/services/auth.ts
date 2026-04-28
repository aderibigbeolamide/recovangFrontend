import api from "./api";
import { 
  AuthResponse, 
  RegistrationRequest, 
  CollectorOnboardingRequest, 
  BusinessOnboardingRequest, 
  AgentOnboardingRequest 
} from "../@types/auth";

export const authService = {
  // Authentication
  login: (credentials: any) => 
    api.post<AuthResponse>("/auth/login", credentials),
    
  register: (data: RegistrationRequest) => 
    api.post<AuthResponse>("/auth/register", data),
    
  logout: () => 
    api.post("/auth/logout"),
    
  verifyEmail: (otp: string) => 
    api.post("/auth/verify-email", { otp }),
    
  forgotPassword: (email: string) => 
    api.post("/auth/forgot-password", { email }),
    
  resetPassword: (data: any) => 
    api.post("/auth/reset-password", data),
    
  getMe: () => 
    api.get("/auth/me"),
    
  refresh: () => 
    api.post("/auth/refresh"),

  // Onboarding (Step 2)
  onboardCollector: (data: CollectorOnboardingRequest) => 
    api.post("/auth/onboard/collector", data),
    
  onboardBusiness: (data: BusinessOnboardingRequest) => 
    api.post("/auth/onboard/business", data),
    
  onboardAgent: (data: AgentOnboardingRequest) => 
    api.post("/auth/onboard/agent", data),
};
