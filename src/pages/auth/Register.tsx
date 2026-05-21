import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent, useCallback } from "react";
import { ArrowRight, Building2, Check, ChevronRight, Eye, EyeOff, Factory, Loader2, Lock, Mail, Phone, Truck, User, Wallet } from "lucide-react";
import { AuthShell } from "./Login";
import { useAuth, type UserRole } from "@/store/auth";
import { register as registerApi, googleLogin, verifyEmail, resendVerification } from "@/services/auth.service";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import locationsData from "@/constants/locations.json";

const ROLES: { v: UserRole; t: string; d: string; icon: any }[] = [
  { v: "collector", t: "I collect waste", d: "Drop bottles, cans, paper. Earn cash.", icon: Wallet },
  { v: "agent", t: "I want to run a hub", d: "Start a business hub or join as an agent.", icon: User },
  { v: "logistics", t: "I have vehicles", d: "Move material between hubs and recyclers.", icon: Truck },
  { v: "brand", t: "I represent a brand", d: "Track EPR compliance & sustainability.", icon: Building2 },
  { v: "factory", t: "I run a recycling plant", d: "Buy processed raw material from hubs.", icon: Factory },
];

export default function Register() {
  const nav = useNavigate();
  const { setSession, user } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("collector");
  const [agentSubType, setAgentSubType] = useState<"individual" | "official" | null>(null);
  const [workMode, setWorkMode] = useState<"hub" | "mobile" | null>(null);
  const [firstName, setFirstName] = useState("Adaeze");
  const [lastName, setLastName] = useState("Nwosu");
  const [email, setEmail] = useState("adaeze@example.com");
  const [phone, setPhone] = useState("+234 803 555 0182");
  const [password, setPassword] = useState("demo-pass");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [manualState, setManualState] = useState("");
  const [manualLga, setManualLga] = useState("");
  const [manualWard, setManualWard] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const steps = ["Account", "Location", "Role", "Verify"];

  const resendOtp = useCallback(async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await resendVerification(email);
      setResendTimer(60);
      toast.success("New code sent!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "";
      if (msg.toLowerCase().includes("already verified")) {
        toast.success("Account already verified!");
        // Update store and move forward
        const { user: currentUser, setSession } = useAuth.getState();
        if (currentUser) {
            const updatedUser = { ...currentUser, isEmailVerified: true };
            const token = useAuth.getState().token;
            if (token) setSession(updatedUser, token);
            
            if (updatedUser.role === "agent" && updatedUser.agentSubType === "official") setStep(5);
            else nav(`/${updatedUser.role}/dashboard`, { replace: true });
        }
      } else {
        toast.error("Failed to resend code");
      }
    } finally {
      setLoading(false);
    }
  }, [resendTimer, email, nav]);

  // Resume verification if session exists but unverified
  useEffect(() => {
    // 1. If verified but unapproved official agent, show Step 5
    if (user && user.isEmailVerified && user.role === "agent" && user.agentSubType === "official" && !user.isApproved) {
      setStep(5);
      return;
    }

    // 2. Only auto-jump to step 4 if we are at the beginning (step 1)
    // This prevents double-OTP generation during the registration flow
    if (user && !user.isEmailVerified && step === 1) {
      setStep(4);
      setEmail(user.email);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setRole(user.role as any || "collector");
      // We DON'T call resendOtp() here because the initial registration 
      // or previous session already triggered an OTP.
      // User can click "Resend" manually if needed.
    }
  }, [user, step]);

  // Handle Resend Timer
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function startVerification() {
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await registerApi({
        firstName, lastName, email: email.trim(), phone: phone.trim(), password, role,
        agentSubType,
        workMode,
        state: state === "others" ? manualState : state,
        lga: lga === "others" ? manualLga : lga,
        ward: ward === "others" ? manualWard : ward
      });
      setSession(user, token);
      setStep(4);
      setResendTimer(60);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  async function complete() {
    const code = otp.join("");
    if (code.length < 6) {
        setError("Please enter the 6-digit code sent to your email.");
        return;
    }

    setError(null);
    setLoading(true);
    try {
      const { user: currentUser, setSession } = useAuth.getState();
      if (!currentUser) throw new Error("Session lost. Please try again.");
      
      await verifyEmail({ email: currentUser.email, otp: code });
      toast.success("Email verified successfully!");

      // Update the user in the store to be verified
      const updatedUser = { ...currentUser, isEmailVerified: true };
      const token = useAuth.getState().token;
      if (token) setSession(updatedUser, token);

      if (updatedUser.role === "agent" && updatedUser.agentSubType === "official") {
        setStep(5);
      } else {
        nav(`/${updatedUser.role}/dashboard`, { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next
    if (val !== "" && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };



  function step1Submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !email.trim() || password.length < 6) {
      setError("Please fill in your name, email and a password of at least 6 characters.");
      return;
    }
    setStep(2);
  }

  function step2Submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if ((state === "others" && !manualState) || (lga === "others" && !manualLga)) {
      setError("Please provide the name of your location.");
      return;
    }
    setStep(3);
  }

  const handleGoogleSuccess = async (response: any) => {
// ... existing google logic (lines 61-90) ...
    setLoading(true);
    try {
      const { user, token } = await googleLogin(response.credential);
      setSession(user, token);
      nav(`/${user.role}/dashboard`, { replace: true });
      toast.success("Signed in with Google!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });
    }
  }, []);

  const triggerGoogle = () => {
    // @ts-ignore
    window.google.accounts.id.prompt();
  };

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
          <form onSubmit={step1Submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="fn">First name</label>
                <input id="fn" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="ln">Last name</label>
                <input id="ln" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="em">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input id="em" type="email" className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ph">Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input id="ph" type="tel" className="input pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="pw">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input
                  id="pw"
                  className="input pl-10 pr-10"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-charcoal"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="help">6+ characters. Mix in a number for bonus security.</div>
            </div>
            {error && (
              <div className="rounded-xl border border-error/20 bg-error-50 px-3 py-2 text-sm text-error">{error}</div>
            )}
            <button type="submit" className="btn-primary btn-lg w-full">Continue <ChevronRight size={16} /></button>
            <div className="relative my-4">
              <div className="divider" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-textgray">Or</span>
            </div>
            <button type="button" onClick={triggerGoogle} className="btn-outline w-full">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="h-4 w-4 mr-2" alt="" />
              Continue with Google
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Where are you?</h1>
          <p className="mt-2 text-textgray">This helps us connect you to the nearest hubs.</p>
          <form onSubmit={step2Submit} className="mt-6 space-y-4">
            <div>
              <label className="label">State</label>
              <select 
                className="input" 
                value={state} 
                onChange={(e) => {
                  setState(e.target.value);
                  setLga("");
                  setWard("");
                }}
                required
              >
                <option value="">Select State</option>
                {locationsData.map(s => <option key={s.state} value={s.state}>{s.state.toUpperCase()}</option>)}
                <option value="others">OTHERS (NOT LISTED)</option>
              </select>
            </div>

            {state === "others" && (
              <div>
                <label className="label">Specify State</label>
                <input 
                  className="input" 
                  placeholder="Enter your state name" 
                  value={manualState} 
                  onChange={(e) => setManualState(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            {(state && state !== "others") && (
              <div>
                <label className="label">LGA</label>
                <select 
                  className="input" 
                  value={lga} 
                  onChange={(e) => {
                    setLga(e.target.value);
                    setWard("");
                  }}
                  required
                >
                  <option value="">Select Local Government</option>
                  {locationsData.find(s => s.state === state)?.lgas.map(l => (
                    <option key={l.lga} value={l.lga}>{l.lga.replace(/-/g, " ").toUpperCase()}</option>
                  ))}
                  <option value="others">OTHERS (NOT LISTED)</option>
                </select>
              </div>
            )}

            {(state === "others" || lga === "others") && state !== "" && (
               <div>
                <label className="label">Specify LGA</label>
                <input 
                  className="input" 
                  placeholder="Enter your local government" 
                  value={manualLga} 
                  onChange={(e) => setManualLga(e.target.value)} 
                  required 
                />
              </div>
            )}

            {(lga && lga !== "others") && (
              <div>
                <label className="label">Ward (Optional)</label>
                <select 
                  className="input" 
                  value={ward} 
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option value="">Select Ward</option>
                  {locationsData.find(s => s.state === state)?.lgas.find(l => l.lga === lga)?.wards.map(w => (
                    <option key={w} value={w}>{w.replace(/-/g, " ").toUpperCase()}</option>
                  ))}
                  <option value="others">OTHERS (NOT LISTED)</option>
                </select>
              </div>
            )}

            {ward === "others" && (
              <div>
                <label className="label">Specify Ward</label>
                <input 
                  className="input" 
                  placeholder="Enter your ward name" 
                  value={manualWard} 
                  onChange={(e) => setManualWard(e.target.value)} 
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-error/20 bg-error-50 px-3 py-2 text-sm text-error">{error}</div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
              <button type="submit" className="btn-primary flex-1">Continue <ChevronRight size={16} /></button>
            </div>
          </form>
        </>
      )}

      {step === 3 && (
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
                  <r.icon size={18} />
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
            <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
            <button 
                onClick={() => {
                    if (role === "agent") setStep(3.5);
                    else startVerification();
                }} 
                disabled={loading}
                className="btn-primary flex-1"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Continue <ChevronRight size={16} /></>}
            </button>
          </div>
        </>
      )}

      {step === 3.5 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Hub Type</h1>
          <p className="mt-2 text-textgray">How would you like to partner with Recovang?</p>
          <div className="mt-6 space-y-4">
            <button
                onClick={() => setAgentSubType("individual")}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    agentSubType === "individual" ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/50"
                }`}
            >
                <div className="h-10 w-10 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center font-black">1</div>
                <div>
                    <div className="text-base font-extrabold">I want to create my own Hub</div>
                    <div className="text-xs text-textgray">Start your own independent recycling business under our umbrella.</div>
                </div>
                {agentSubType === "individual" && <Check className="ml-auto text-primary" size={20} />}
            </button>

            <button
                onClick={() => setAgentSubType("official")}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    agentSubType === "official" ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/50"
                }`}
            >
                <div className="h-10 w-10 shrink-0 rounded-full bg-cream text-charcoal flex items-center justify-center font-black">2</div>
                <div>
                    <div className="text-base font-extrabold">I want to work for Recovang</div>
                    <div className="text-xs text-textgray">Apply to join our official field or mobile agent fleet.</div>
                </div>
                {agentSubType === "official" && <Check className="ml-auto text-primary" size={20} />}
            </button>
          </div>

          {agentSubType === "official" && (
              <div className="mt-6 rounded-2xl bg-charcoal p-6 text-white">
                  <h3 className="text-sm font-bold mb-2">Notice for Official Agents</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                      You are applying to join our official field fleet in <span className="text-accent font-bold">{state?.toUpperCase()}</span>. 
                      Our hiring team will review your profile and contact you via <span className="text-accent font-bold">{email}</span> if you are fit for the position.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-success">
                      <Check size={12} /> Data will be captured for review
                  </div>
              </div>
          )}

          <div className="mt-8 flex gap-3">
            <button onClick={() => setStep(3)} className="btn-outline flex-1">Back</button>
            <button 
                disabled={!agentSubType || loading}
                onClick={() => {
                    if (agentSubType === "official") setStep(3.6);
                    else startVerification();
                }} 
                className="btn-primary flex-1 disabled:opacity-50"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Continue <ChevronRight size={16} /></>}
            </button>
          </div>
        </>
      )}
      
      {step === 3.6 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Work Mode</h1>
          <p className="mt-2 text-textgray">Where will you be operating from?</p>
          <div className="mt-6 space-y-4">
            <button
                onClick={() => setWorkMode("hub")}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    workMode === "hub" ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/50"
                }`}
            >
                <div className="h-10 w-10 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center font-black">H</div>
                <div>
                    <div className="text-base font-extrabold">Hub Agent</div>
                    <div className="text-xs text-textgray">I will work from an official Recovang hub facility.</div>
                </div>
                {workMode === "hub" && <Check className="ml-auto text-primary" size={20} />}
            </button>

            <button
                onClick={() => setWorkMode("mobile")}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    workMode === "mobile" ? "border-primary bg-mint ring-4 ring-primary/10" : "border-bordergray hover:border-primary/50"
                }`}
            >
                <div className="h-10 w-10 shrink-0 rounded-full bg-cream text-charcoal flex items-center justify-center font-black">M</div>
                <div>
                    <div className="text-base font-extrabold">Mobile Agent</div>
                    <div className="text-xs text-textgray">I will operate in the field across designated collection points.</div>
                </div>
                {workMode === "mobile" && <Check className="ml-auto text-primary" size={20} />}
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={() => setStep(3.5)} className="btn-outline flex-1">Back</button>
            <button 
                disabled={!workMode || loading}
                onClick={startVerification} 
                className="btn-primary flex-1 disabled:opacity-50"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Complete Registration <ChevronRight size={16} /></>}
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h1 className="text-h1 font-extrabold leading-tight text-balance">Verify your email</h1>
          <p className="mt-2 text-textgray">We sent a 6-digit code to <span className="font-bold text-charcoal">{email}</span>. Enter it below.</p>
          <div className="mt-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="h-14 w-12 rounded-xl border border-bordergray bg-white text-center font-mono text-xl font-extrabold focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              ))}
            </div>
            <div className="help mt-3 text-center">
                Didn't get it?{" "}
                <button 
                    type="button"
                    disabled={resendTimer > 0 || loading} 
                    onClick={resendOtp}
                    className="font-bold text-primary disabled:opacity-50"
                >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend now"}
                </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-xl border border-error/20 bg-error-50 px-3 py-2 text-sm text-error">{error}</div>
          )}
          <button
            onClick={complete}
            disabled={loading}
            className="btn-primary btn-lg mt-7 w-full disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Verifying…</>
            ) : (
              <>Verify & Complete <ArrowRight size={16} /></>
            )}
          </button>
          <p className="mt-4 text-center text-xs text-textgray">By continuing, you agree to our <Link to="/terms" className="font-bold text-primary">Terms</Link> and <Link to="/privacy" className="font-bold text-primary">Privacy Policy</Link>.</p>
        </>
      )}

      {step === 5 && (
        <div className="text-center py-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-h1 font-extrabold leading-tight text-balance">Application Received!</h1>
          <p className="mt-3 text-textgray">
            Thank you for applying to join the Recovang fleet. 
            Your profile is now in our <span className="font-bold text-charcoal">Review Queue</span>.
          </p>
          
          <div className="mt-8 rounded-2xl bg-cream p-6 text-left border border-bordergray/50">
            <h3 className="text-sm font-bold text-charcoal mb-2">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-textgray">
                <div className="h-5 w-5 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">1</div>
                <span>Our team reviews your credentials and location suitability.</span>
              </li>
              <li className="flex gap-3 text-xs text-textgray">
                <div className="h-5 w-5 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">2</div>
                <span>You will receive an email once your account is <span className="text-success font-bold underline">Approved</span>.</span>
              </li>
              <li className="flex gap-3 text-xs text-textgray">
                <div className="h-5 w-5 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">3</div>
                <div className="flex-1">
                    Please send your <span className="font-bold text-charcoal text-balance">CV and Cover Letter</span> to <a href="mailto:hr@recovang.com" className="text-primary font-bold underline">hr@recovang.com</a> for review. 
                    Include your registered email (<span className="italic">{email}</span>) in the subject.
                </div>
              </li>
              <li className="flex gap-3 text-xs text-textgray">
                <div className="h-5 w-5 shrink-0 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px] font-bold">4</div>
                <span>Only then can you sign in to access your agent dashboard.</span>
              </li>
            </ul>
          </div>

          <Link to="/" className="btn-primary btn-lg mt-8 w-full">
            Back to homepage
          </Link>
          <p className="mt-4 text-xs text-textgray italic">
            Check your email regularly for updates.
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-textgray">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-bold text-primary hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
