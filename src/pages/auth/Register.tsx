import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Mail, Phone, Shield, User, Wallet } from "lucide-react";
import { AuthShell } from "./Login";
import { DEMO_USERS, useAuth, type UserRole } from "@/store/auth";

const ROLES: { v: UserRole; t: string; d: string }[] = [
  { v: "collector", t: "I collect waste", d: "Drop bottles, cans, paper. Earn cash." },
  { v: "agent", t: "I want to run a hub", d: "Verify drops, manage hub, earn commission." },
  { v: "logistics", t: "I have vehicles", d: "Move material between hubs and recyclers." },
];

export default function Register() {
  const nav = useNavigate();
  const { setSession } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("collector");
  const steps = ["Account", "Role", "Verify"];

  function complete() {
    const user = DEMO_USERS[role];
    setSession(user, "demo.token." + role);
    nav(`/${role}/dashboard`);
  }

  return (
    <AuthShell>
      <div className="mb-7 flex items-center gap-2">
        {steps.map((s, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                done ? "bg-success text-white" : active ? "bg-charcoal text-white" : "bg-charcoal/8 text-charcoal/40"
              }`}>{done ? <Check size={12} /> : idx}</div>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${active || done ? "text-charcoal" : "text-charcoal/40"}`}>{s}</span>
              {idx < steps.length && <div className={`h-px flex-1 ${done ? "bg-success" : "bg-bordergray"}`} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Create your account</h1>
          <p className="mt-2 text-textgray">Takes about 60 seconds. No NIN required to start.</p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First name</label>
                <input className="input" defaultValue="Adaeze" />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" defaultValue="Nwosu" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input className="input pl-10" defaultValue="adaeze@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input className="input pl-10" defaultValue="+234 803 555 0182" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" defaultValue="demo-pass" />
              <div className="help">8+ characters. Mix in a number for bonus security.</div>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary btn-lg w-full">Continue <ChevronRight size={16} /></button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Pick your role</h1>
          <p className="mt-2 text-textgray">You can switch later in your settings.</p>
          <div className="mt-6 space-y-3">
            {ROLES.map((r) => (
              <button
                key={r.v}
                onClick={() => setRole(r.v)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  role === r.v ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/50"
                }`}
              >
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${role === r.v ? "bg-grad-primary text-white" : "bg-cream text-charcoal/70"}`}>
                  {r.v === "collector" ? <Wallet size={18} /> : r.v === "agent" ? <User size={18} /> : <Shield size={18} />}
                </div>
                <div className="flex-1">
                  <div className="text-base font-extrabold">{r.t}</div>
                  <div className="text-xs text-textgray">{r.d}</div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${role === r.v ? "border-primary bg-primary" : "border-bordergray"}`}>
                  {role === r.v && <Check size={12} className="m-auto mt-0.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue <ChevronRight size={16} /></button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Verify your phone</h1>
          <p className="mt-2 text-textgray">We sent a 6-digit code to your number. Enter it below.</p>
          <div className="mt-6">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  maxLength={1}
                  defaultValue={"864207"[i]}
                  className="h-14 w-12 rounded-xl border border-bordergray bg-white text-center font-mono text-xl font-extrabold focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              ))}
            </div>
            <div className="help mt-3 text-center">Didn't get it? <button className="font-bold text-primary">Resend in 27s</button></div>
          </div>
          <button onClick={complete} className="btn-primary btn-lg mt-7 w-full">Open my {role} dashboard <ArrowRight size={16} /></button>
          <p className="mt-4 text-center text-xs text-textgray">By continuing, you agree to our <Link to="/terms" className="font-bold text-primary">Terms</Link> and <Link to="/privacy" className="font-bold text-primary">Privacy Policy</Link>.</p>
        </>
      )}
    </AuthShell>
  );
}
