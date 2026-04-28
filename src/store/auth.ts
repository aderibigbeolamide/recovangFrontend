import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "collector" | "agent" | "logistics" | "admin" | "brand" | "factory" | "super_admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
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
  setSession: (user: AuthUser, token: string) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      updateUser: (patch) => set({ user: get().user ? { ...get().user!, ...patch } : null }),
      signOut: () => set({ user: null, token: null }),
    }),
    { name: "recovang.auth" }
  )
);

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  collector: { id: "u_c1", name: "Adaeze Nwosu", email: "adaeze@demo.ng", phone: "+234 803 555 0182", role: "collector", city: "Surulere · Lagos", avatarLetters: "AN" },
  agent: { id: "u_a1", name: "Bola Adeyemi", email: "bola@hub.recovang", phone: "+234 802 555 0144", role: "agent", hub: "Surulere Hub", avatarLetters: "BA" },
  logistics: { id: "u_l1", name: "Kunle Okafor", email: "kunle@logistics.ng", phone: "+234 805 555 0177", role: "logistics", city: "Lagos Mainland", avatarLetters: "KO" },
  admin: {
    id: "u_x1",
    name: "Sade Ijeoma",
    email: "admin@recovang.com",
    phone: "+234 700 RECOVANG",
    role: "admin",
    avatarLetters: "SI",
    region: "Lagos · South-West",
    permissions: ["MANAGE_USERS", "MANAGE_HUBS", "MANAGE_FRAUD", "VIEW_AUDIT_LOGS"],
  },
  brand: { id: "u_b1", name: "Chioma Okeke", email: "chioma@coca-cola.ng", phone: "+234 802 555 0199", role: "brand", company: "Coca-Cola Nigeria", avatarLetters: "CO" },
  factory: { id: "u_f1", name: "Tunde Bakare", email: "tunde@indorama.ng", phone: "+234 803 555 0155", role: "factory", company: "Indorama PET Recyclers", avatarLetters: "TB" },
  super_admin: {
    id: "u_sa1",
    name: "Olamide Adesanya",
    email: "superadmin@recovang.com",
    phone: "+234 700 RECOVANG",
    role: "super_admin",
    avatarLetters: "OA",
    region: "Headquarters · Victoria Island",
    permissions: ["ALL"],
  },
};
