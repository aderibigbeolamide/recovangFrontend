import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth, type UserRole } from "@/store/auth";
import { useState } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";

const ROLES: { value: UserRole; label: string; to: string }[] = [
  { value: "collector", label: "Collector", to: "/collector/dashboard" },
  { value: "agent", label: "Hub Agent", to: "/agent/dashboard" },
  { value: "logistics", label: "Logistics", to: "/logistics/dashboard" },
  { value: "admin", label: "Admin", to: "/admin/dashboard" },
];

export default function Login() {
  const nav = useNavigate();
  const { setUser, setToken } = useAuth();
  const [role, setRole] = useState<UserRole>("collector");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dest = ROLES.find((r) => r.value === role)?.to ?? "/";
    setToken("demo-token");
    setUser({
      id: "u_demo",
      name: role === "collector" ? "Adaeze Nwosu" : role === "agent" ? "Bola Adeyemi" : role === "logistics" ? "Kunle Logistics" : "Admin",
      email: "demo@recovang.com",
      phone: "+2348012345678",
      role,
    });
    nav(dest);
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Recovang account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Sign in as</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-xl border p-3 text-sm font-semibold transition-colors ${
                  role === r.value
                    ? "border-primary bg-mint text-primary"
                    : "border-bordergray bg-white text-charcoal hover:border-primary/40"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Email or phone</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-9" defaultValue="adaeze@recovang.com" />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input type="password" className="input pl-9" defaultValue="••••••••" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-textgray">
            <input type="checkbox" defaultChecked /> Keep me signed in
          </label>
          <Link to="/auth/forgot" className="font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full">
          Sign in <ArrowRight size={16} />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-textgray">
        New to Recovang?{" "}
        <Link to="/auth/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex">
            <Logo />
          </Link>
          <h1 className="font-display text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-textgray">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-gradient-primary p-10 text-white lg:flex lg:items-end">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-md">
          <p className="font-mono text-5xl font-bold text-accent">₦284M+</p>
          <p className="mt-2 text-xl font-display font-bold">paid out to Nigerian collectors</p>
          <p className="mt-3 text-white/70">
            Real money. Real receipts. Real impact. Sign in to view your wallet, submit waste, or verify a load.
          </p>
        </div>
      </div>
    </div>
  );
}
