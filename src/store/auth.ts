import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "collector" | "agent" | "logistics" | "admin" | "brand" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "recovang-auth" }
  )
);
