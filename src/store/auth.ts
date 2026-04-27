import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "collector" | "agent" | "logistics" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hub?: string;
  city?: string;
  avatarLetters?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      signOut: () => set({ user: null, token: null }),
    }),
    { name: "recovang.auth" }
  )
);

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  collector: { id: "u_c1", name: "Adaeze Nwosu", email: "adaeze@demo.ng", phone: "+234 803 555 0182", role: "collector", city: "Surulere · Lagos", avatarLetters: "AN" },
  agent: { id: "u_a1", name: "Bola Adeyemi", email: "bola@hub.recovang", phone: "+234 802 555 0144", role: "agent", hub: "Surulere Hub", avatarLetters: "BA" },
  logistics: { id: "u_l1", name: "Kunle Okafor", email: "kunle@logistics.ng", phone: "+234 805 555 0177", role: "logistics", city: "Lagos Mainland", avatarLetters: "KO" },
  admin: { id: "u_x1", name: "Recovang Admin", email: "admin@recovang.com", phone: "+234 700 RECOVANG", role: "admin", avatarLetters: "RA" },
};
