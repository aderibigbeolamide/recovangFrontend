import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "./Login";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { UserRole } from "@/store/auth";
import { useAuth } from "@/store/auth";

const ROLES: { value: UserRole; label: string; desc: string; to: string }[] = [
  { value: "collector", label: "Collector", desc: "I want to drop waste and earn money.", to: "/collector/dashboard" },
  { value: "agent", label: "Hub Agent", desc: "I run or work at a recovery hub.", to: "/agent/dashboard" },
  { value: "logistics", label: "Logistics partner", desc: "I move material between hubs and factories.", to: "/logistics/dashboard" },
  { value: "brand", label: "Brand / Producer", desc: "I'm a brand looking to meet EPR obligations.", to: "/" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("collector");
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();

  function finish() {
    setToken("demo-token");
    setUser({
      id: "u_demo",
      name: "New Recovang User",
      email: "new@recovang.com",
      phone: "+2348012345678",
      role,
    });
    const dest = ROLES.find((r) => r.value === role)?.to ?? "/";
    nav(dest);
  }

  return (
    <AuthShell title="Create your Recovang account" subtitle="Join 62,000+ Nigerians earning real naira from waste.">
      <Stepper step={step} />
      {step === 1 && (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" placeholder="Adaeze" />
            <Field label="Last name" placeholder="Nwosu" />
          </div>
          <Field label="Email" placeholder="adaeze@example.com" type="email" />
          <Field label="Phone number" placeholder="0801 234 5678" />
          <Field label="Create password" placeholder="••••••••" type="password" />
          <button type="submit" className="btn-primary w-full">
            Continue <ArrowRight size={16} />
          </button>
        </form>
      )}
      {step === 2 && (
        <div className="mt-6 space-y-3">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                role === r.value
                  ? "border-primary bg-mint"
                  : "border-bordergray bg-white hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold">{r.label}</span>
                {role === r.value && <CheckCircle2 size={18} className="text-primary" />}
              </div>
              <p className="mt-1 text-sm text-textgray">{r.desc}</p>
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">
              <ArrowLeft size={16} /> Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="mt-6 space-y-4">
          {role === "collector" && (
            <>
              <Field label="Address" placeholder="Block 5, Apt 3, Bode Thomas Surulere" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" placeholder="Lagos" />
                <Field label="LGA" placeholder="Surulere" />
              </div>
              <Field label="NIN (optional, speeds up KYC)" placeholder="••••••••••" />
            </>
          )}
          {role === "agent" && (
            <>
              <Field label="Hub name" placeholder="Surulere Hub" />
              <Field label="Hub address" placeholder="12 Bode Thomas, Surulere" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hub size (sqm)" placeholder="120" />
                <Field label="Daily capacity (kg)" placeholder="500" />
              </div>
            </>
          )}
          {role === "logistics" && (
            <>
              <Field label="Company name" placeholder="Kunle Logistics Ltd" />
              <Field label="Fleet size" placeholder="3 trucks" />
              <Field label="Cities served" placeholder="Lagos, Ogun, Oyo" />
            </>
          )}
          {role === "brand" && (
            <>
              <Field label="Brand name" placeholder="Sunshine Beverages Ltd" />
              <Field label="RC number" placeholder="RC1234567" />
              <Field label="EPR category" placeholder="Plastic packaging" />
            </>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">
              <ArrowLeft size={16} /> Back
            </button>
            <button type="button" onClick={finish} className="btn-primary flex-1">
              Finish & enter <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-textgray">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              step >= i ? "bg-primary text-white" : "bg-bordergray text-textgray"
            }`}
          >
            {step > i ? <CheckCircle2 size={14} /> : i}
          </div>
          {i < 3 && (
            <div className={`h-0.5 flex-1 ${step > i ? "bg-primary" : "bg-bordergray"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...p} />
    </div>
  );
}
