import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Blob } from "@/components/illustrations";
import { useAuth, DEMO_USERS } from "@/store/auth";
import { login, googleLogin } from "@/services/auth.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setSession, user, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user) nav(`/${user.role}/dashboard`, { replace: true });
  }, [token, user, nav]);

  const fromState = (loc.state as { from?: string } | null)?.from;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await login({ email: email.trim(), password });
      setSession(user, token);
      nav(fromState || `/${user.role}/dashboard`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (response: any) => {
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-h1 font-extrabold leading-tight text-balance">Welcome back.</h1>
        <p className="mt-2 text-textgray">Sign in and we'll take you straight to your dashboard.</p>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 space-y-4"
      >
        <div>
          <label className="label" htmlFor="email">Email or phone</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input
              id="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input pl-10" placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-1.5" htmlFor="pw">Password</label>
            <Link to="/auth/forgot-password" className="text-xs font-bold text-primary hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
            <input
              id="pw" type={show ? "text" : "password"} autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-10" placeholder="Enter your password"
            />
            <button
              type="button" onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-charcoal"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-xl border border-error/20 bg-error-50 px-3 py-2 text-sm text-error"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit" disabled={loading}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn-primary btn-lg w-full disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : (
            <>Sign in <ArrowRight size={16} /></>
          )}
        </motion.button>

        <div className="relative my-2">
          <div className="divider" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-textgray">
            Or
          </span>
        </div>

        <button type="button" onClick={triggerGoogle} className="btn-outline w-full">
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="h-4 w-4 mr-2" alt="" />
          Continue with Google
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DemoHint onPick={(em) => { setEmail(em); setPassword("demo-pass"); }} />
        <p className="mt-6 text-center text-sm text-textgray">
          New to Recovang?{" "}
          <Link to="/auth/register" className="font-bold text-primary hover:text-primary-700">
            Create an account
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}

function DemoHint({ onPick }: { onPick: (email: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 rounded-xl border border-bordergray bg-cream/60 p-3 text-xs">
      <button
        type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between font-bold text-charcoal/80"
      >
        <span>Use a demo account</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-textgray"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-1.5">
              {Object.values(DEMO_USERS).map((u) => (
                <button
                  key={u.id} type="button" onClick={() => onPick(u.email)}
                  className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-left transition hover:bg-mint"
                >
                  <span className="font-mono text-[11px] text-charcoal">{u.email}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{u.role}</span>
                </button>
              ))}
              <p className="mt-1 text-textgray">
                Password for all demo accounts: <span className="font-mono">demo-pass</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left — form */}
        <div className="flex flex-col bg-cream">
          <div className="container-page flex h-16 items-center justify-between sm:h-20">
            <Link to="/"><Logo /></Link>
            <Link to="/" className="flex items-center gap-1 text-sm font-bold text-textgray transition hover:text-charcoal">
              <ArrowLeft size={14} /> Back to site
            </Link>
          </div>
          <div className="flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:px-6 sm:py-10">
            <div className="card w-full max-w-md p-6 sm:p-8 md:p-10">{children}</div>
          </div>
          <p className="px-6 pb-6 text-center text-xs text-textgray">
            © 2026 Recovang Technologies Ltd. RC 1948-2204.
          </p>
        </div>

        {/* Right — photo panel */}
        <div className="relative hidden overflow-hidden bg-charcoal text-white lg:block">
          <motion.img
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1400&q=70"
            alt="A young African woman smiling while using the Recovang app on her phone"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/90 via-charcoal/55 to-primary/30" />
          <Blob className="left-[-10%] top-[-10%] h-[400px] w-[400px]" color="from-accent/30 to-accent/0" />
          <Blob className="right-[-15%] bottom-[-15%] h-[400px] w-[400px]" color="from-primary/40 to-primary/0" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Live across Africa · starting in Nigeria
              </span>
              <h2 className="mt-8 text-display font-extrabold leading-[0.98] text-balance">
                Recover. <br /> Earn. <br />
                <span className="text-accent">Sustain.</span>
              </h2>
              <p className="mt-6 max-w-sm text-white/75 leading-relaxed">
                62,418 Africans earn weekly from waste they used to throw away. Pan-African mission, Nigerian first.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { v: "₦284M", l: "Paid out" },
                { v: "1.2M kg", l: "Recovered" },
                { v: "412", l: "Hubs live" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="font-mono text-xl font-extrabold text-accent">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/55">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
