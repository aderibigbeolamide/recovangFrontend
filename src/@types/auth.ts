export type UserRole = "COLLECTOR" | "AGENT" | "BRAND" | "FACTORY" | "LOGISTICS" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Computed or display name
  phone: string;
  role: UserRole;
  avatarLetters?: string;
  company?: string;
  hub?: string;
  city?: string;
  isVerified: boolean;
  onboarded: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegistrationRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

export interface CollectorOnboardingRequest {
  preferredCategoryId: string;
  disabilityId?: string;
  bio?: string;
  stateId: string;
  lgaId: string;
  bankCode: string;
  accountNumber: string;
}

export interface BusinessOnboardingRequest {
  companyName: string;
  rcNumber: string;
  address: string;
  stateId: string;
  lgaId: string;
  industry?: string;
}

export interface AgentOnboardingRequest {
  hubId?: string; // If already known
  address: string;
  stateId: string;
  lgaId: string;
}
