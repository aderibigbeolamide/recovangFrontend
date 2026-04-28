import api from "./api";
import { DEMO_USERS, type AuthUser } from "@/store/auth";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const DEMO_PASS = "demo-pass";

const lookupByEmail = (email: string): AuthUser | undefined =>
  Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    const user = lookupByEmail(payload.email);
    if (!user || payload.password !== DEMO_PASS) {
      throw new Error(
        `Invalid email or password. Try a demo account (e.g. ${DEMO_USERS.collector.email}) with password "${DEMO_PASS}".`
      );
    }
    return delay({ user, token: `demo.token.${user.role}` });
  }
  const { data: res } = await api.post("/auth/login", payload);
  const data = res.data ?? res; 
  
  // Normalize role and user data
  const user = {
    ...data.user,
    name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || "User",
    avatarLetters: (data.user.firstName?.[0] || "") + (data.user.lastName?.[0] || ""),
    role: (data.user.role || "").toLowerCase()
  };

  return { 
    user, 
    token: data.accessToken || data.token || data.access_token 
  };
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: AuthUser["role"];
}
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    const existing = lookupByEmail(payload.email);
    if (existing) {
      return delay({ user: existing, token: `demo.token.${existing.role}` });
    }
    const user: AuthUser = {
      id: "u_new_" + Date.now(),
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      avatarLetters: (payload.firstName[0] || "?") + (payload.lastName[0] || ""),
    };
    return delay({ user, token: `demo.token.${user.role}` });
  }
  const { data: res } = await api.post("/auth/register", payload);
  const data = res.data ?? res;
  
  const user = {
    ...data.user,
    name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || "User",
    avatarLetters: (data.user.firstName?.[0] || "") + (data.user.lastName?.[0] || ""),
    role: (data.user.role || "").toLowerCase()
  };

  return { 
    user, 
    token: data.accessToken || data.token || data.access_token 
  };
}

export async function logout(): Promise<void> {
  if (USE_MOCK) return delay(undefined);
  await api.post("/auth/logout").catch(() => {});
}

export async function me(): Promise<AuthUser | null> {
  if (USE_MOCK) return null;
  const { data } = await api.get("/auth/me");
  return data.user ?? data;
}

export interface ForgotPayload {
  email: string;
}
export async function forgotPassword({ email }: ForgotPayload): Promise<{ ok: true; message: string }> {
  if (USE_MOCK) {
    const user = lookupByEmail(email);
    if (!user) {
      // Don't reveal — return success anyway to avoid enumeration
      return delay({ ok: true as const, message: `If an account exists for ${email}, a 6-digit code has been sent.` });
    }
    return delay({ ok: true as const, message: `We've sent a 6-digit code to ${email}. It expires in 10 minutes.` });
  }
  await api.post("/auth/forgot-password", { email });
  return { ok: true, message: `We've sent a 6-digit code to ${email}.` };
}

export interface ResetPayload {
  email: string;
  code: string;
  password: string;
}
export async function resetPassword(payload: ResetPayload): Promise<{ ok: true; message: string }> {
  if (USE_MOCK) {
    if (payload.code.length !== 6) throw new Error("Enter the 6-digit code from your email.");
    if (payload.password.length < 6) throw new Error("Password must be at least 6 characters.");
    return delay({ ok: true as const, message: "Password updated. You can sign in now." });
  }
  await api.post("/auth/reset-password", payload);
  return { ok: true, message: "Password updated." };
}

export async function verifyEmail(payload: { email: string; code: string }): Promise<{ ok: true }> {
  if (USE_MOCK) {
    if (payload.code.length !== 6) throw new Error("Enter the 6-digit code.");
    return delay({ ok: true as const });
  }
  await api.post("/auth/verify-email", payload);
  return { ok: true };
}
