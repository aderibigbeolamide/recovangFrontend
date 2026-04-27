import { Link, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Blob, GridOverlay } from "@/components/illustrations";
import { DEMO_USERS, useAuth, type UserRole } from "@/store/auth";

const ROLES: { v: UserRole; t: string; d: string }[] = [
  { v: "collector", t: "Collector", d: "Drop waste, get paid" },
  { v: "agent", t: "Agent", d: "Verify drops at a hub" },
  { v: "logistics", t: "Logistics", d: "Move material with your fleet" },
  { v: "admin", t: "Admin", d: "Operate the platform" },
];

export default function Login() {
  const nav = useNavigate();
  const { setSession } = useAuth();
  const [role, setRole] = useState<UserRole>("collector");
  const [show, setShow] = useState(false);

  function signIn() {
    const user = DEMO_USERS[role];
    setSession(user, "demo.token." + role);
    nav(`/${role}/dashboard`);
  }

  return (
    <AuthShell>
      <h1 className="text-h1 font-extrabold leading-tight text-balance">Welcome back.</h1>
      <p className="mt-2 text-textgray">Sign in to continue earning, verifying, or operating.</p>

      <div className="mt-6">
        <div className="label">Sign in as</div>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.v}
              type="button"
              onClick={() => setRole(r.v)}
              className={`rounded-2xl border p-3 text-left transition ${
                role === r.v
                  ? "border-primary bg-mint ring-4 ring-primary/10"
                  : "border-bordergray hover:border-primary/50"
              }`}
            >
              <div className="text-sm font-extrabold text-charcoal">{r.t}</div>
              <div className="text-[11px] text-textgray">{r.d}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label">Email or phone</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input className="input pl-10" defaultValue={DEMO_USERS[role!].email} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-1.5">Password</label>
            <Link to="#" className="text-xs font-bold text-primary hover:text-primary-700">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input
              type={show ? "text" : "password"}
              className="input pl-10 pr-10"
              defaultValue="demo-pass"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div className="help">Demo accounts use <span className="font-mono">demo-pass</span></div>
        </div>

        <button onClick={signIn} className="btn-primary btn-lg w-full">
          Sign in to {role} portal <ArrowRight size={16} />
        </button>

        <div className="relative my-4">
          <div className="divider" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-textgray">
            Or
          </span>
        </div>

        <button className="btn-outline w-full">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-charcoal text-[10px] font-bold text-accent">G</span>
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-textgray">
        New to Recovang? <Link to="/auth/register" className="font-bold text-primary hover:text-primary-700">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side — form */}
        <div className="flex flex-col bg-cream">
          <div className="container-page flex h-20 items-center justify-between">
            <Link to="/"><Logo /></Link>
            <Link to="/" className="text-sm font-bold text-textgray hover:text-charcoal flex items-center gap-1">
              <ArrowLeft size={14} /> Back to site
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="card w-full max-w-md p-8 sm:p-10">{children}</div>
          </div>
          <p className="px-6 pb-6 text-center text-xs text-textgray">
            © 2026 Recovang Technologies Ltd. RC 1948-2204.
          </p>
        </div>

        {/* Right side — visual */}
        <div className="relative hidden overflow-hidden bg-grad-primary-deep text-white lg:block">
          <div className="absolute inset-0 bg-grid-dark mask-fade-b opacity-30" />
          <Blob className="left-[-10%] top-[-10%] h-[400px] w-[400px]" color="from-accent/30 to-accent/0" />
          <Blob className="right-[-15%] bottom-[-15%] h-[400px] w-[400px]" color="from-primary/40 to-primary/0" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Live across Nigeria
              </span>
              <h2 className="mt-8 text-display font-extrabold leading-[0.98] text-balance">
                Recover. <br /> Earn. <br />
                <span className="text-accent">Sustain.</span>
              </h2>
              <p className="mt-6 max-w-sm text-white/80">
                62,418 Nigerians earn weekly from waste they used to throw away. Join them.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "₦284M", l: "Paid out" },
                { v: "1.2M kg", l: "Recovered" },
                { v: "412", l: "Hubs live" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="font-mono text-xl font-extrabold">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
