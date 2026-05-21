import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "collector" | "agent" | "logistics" | "admin" | "brand" | "factory" | "super_admin" | "support";

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  role: UserRole;
  agentSubType?: "individual" | "official";
  workMode?: "hub" | "mobile";
  isApproved: boolean;
  kycStatus: "PENDING" | "IN_REVIEW" | "COMPLETED" | "REJECTED";
  hub?: string;
  city?: string;
  company?: string;
  avatarLetters?: string;
  permissions?: string[];
  region?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isReadOnly: boolean;
  originalSession: { user: AuthUser; token: string } | null;
  setSession: (user: AuthUser, token: string) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  impersonate: (user: AuthUser, token: string) => void;
  stopImpersonating: () => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isReadOnly: false,
      originalSession: null,
      setSession: (user, token) => set({ user, token, isReadOnly: false }),
      updateUser: (patch) => set({ user: get().user ? { ...get().user!, ...patch } : null }),
      impersonate: (user, token) => {
        const current = get();
        if (!current.originalSession) {
          const isSupport = current.user?.role === "support";
          set({ 
            originalSession: { user: current.user!, token: current.token! },
            user,
            token,
            isReadOnly: isSupport // Support is always read-only when impersonating
          });
        }
      },
      stopImpersonating: () => {
        const current = get();
        if (current.originalSession) {
          set({ 
            user: current.originalSession.user,
            token: current.originalSession.token,
            originalSession: null,
            isReadOnly: false
          });
        }
      },
      signOut: () => set({ user: null, token: null, originalSession: null, isReadOnly: false }),
    }),
    { name: "recovang.auth" }
  )
);

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  collector: { id: "u_c1", name: "Adaeze Nwosu", firstName: "Adaeze", lastName: "Nwosu", email: "adaeze@demo.ng", phone: "+234 803 555 0182", phoneNumber: "+234 803 555 0182", role: "collector", city: "Surulere · Lagos", avatarLetters: "AN", isApproved: true, kycStatus: "COMPLETED" },
  agent: { id: "u_a1", name: "Bola Adeyemi", firstName: "Bola", lastName: "Adeyemi", email: "bola@hub.recovang", phone: "+234 802 555 0144", phoneNumber: "+234 802 555 0144", role: "agent", agentSubType: "individual", hub: "Surulere Hub", avatarLetters: "BA", isApproved: true, kycStatus: "COMPLETED" },
  logistics: { id: "u_l1", name: "Kunle Okafor", firstName: "Kunle", lastName: "Okafor", email: "kunle@logistics.ng", phone: "+234 805 555 0177", phoneNumber: "+234 805 555 0177", role: "logistics", city: "Lagos Mainland", avatarLetters: "KO", isApproved: true, kycStatus: "COMPLETED" },
  admin: { id: "u_x1", name: "Recovang Admin", firstName: "Recovang", lastName: "Admin", email: "admin@recovang.com", phone: "+234 700 RECOVANG", phoneNumber: "+234 700 RECOVANG", role: "admin", avatarLetters: "RA", isApproved: true, kycStatus: "COMPLETED" },
  brand: { id: "u_b1", name: "Chioma Okeke", firstName: "Chioma", lastName: "Okeke", email: "chioma@coca-cola.ng", phone: "+234 802 555 0199", phoneNumber: "+234 802 555 0199", role: "brand", company: "Coca-Cola Nigeria", avatarLetters: "CO", isApproved: true, kycStatus: "COMPLETED" },
  factory: { id: "u_f1", name: "Tunde Bakare", firstName: "Tunde", lastName: "Bakare", email: "tunde@indorama.ng", phone: "+234 803 555 0155", phoneNumber: "+234 803 555 0155", role: "factory", company: "Indorama PET Recyclers", avatarLetters: "TB", isApproved: true, kycStatus: "COMPLETED" },
  super_admin: { id: "u_sa1", name: "Recovang Super Admin", firstName: "Recovang", lastName: "Super Admin", email: "superadmin@recovang.com", phone: "+234 700 RECOVANG", phoneNumber: "+234 700 RECOVANG", role: "super_admin", avatarLetters: "SA", isApproved: true, kycStatus: "COMPLETED" },
  support: { id: "u_s1", name: "Recovang Support", firstName: "Recovang", lastName: "Support", email: "support@recovang.com", phone: "+234 700 RECOVANG", phoneNumber: "+234 700 RECOVANG", role: "support", avatarLetters: "RS", isApproved: true, kycStatus: "COMPLETED" },
};
