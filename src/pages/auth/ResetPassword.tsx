import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { AuthShell } from "./Login";
import { resetPassword } from "@/services/auth.service";

export default function ResetPassword() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (email && refs.current[0]) refs.current[0]?.focus();
  }, [email]);

  function setDigit(i: number, v: string) {
    const cleaned = v.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[i] = cleaned;
    setCode(next);
    if (cleaned && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function pasteCode(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""].map((_, i) => text[i] ?? "");
    setCode(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({ email: email.trim(), code: code.join(""), password });
      setDone(true);
      setTimeout(() => nav("/auth/login"), 1500);
      void res;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <Link to="/auth/forgot-password" className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-textgray hover:text-charcoal">
        <ArrowLeft size={14} /> Use a different email
      </Link>
      <h1 className="text-h1 font-extrabold leading-tight text-balance">Set a new password.</h1>
      <p className="mt-2 text-textgray">
        Enter the 6-digit code we sent to <span className="font-bold text-charcoal">{email || "your email"}</span> and choose a new password.
      </p>

      {done ? (
        <div className="mt-7 rounded-2xl border border-success/20 bg-success-50 p-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-success" size={20} />
            <div>
              <div className="font-extrabold text-charcoal">Password updated</div>
              <p className="mt-1 text-charcoal/70">Redirecting you to sign in…</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          {!params.get("email") && (
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="label">6-digit code</label>
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onPaste={i === 0 ? pasteCode : undefined}
                  className="h-12 w-full max-w-[48px] rounded-xl border border-bordergray bg-white text-center font-mono text-lg font-extrabold focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-14 sm:text-xl"
                />
              ))}
            </div>
            <div className="help mt-2">Didn't get it? <Link to="/auth/forgot-password" className="font-bold text-primary">Resend code</Link></div>
          </div>

          <div>
            <label className="label" htmlFor="pw">New password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
              <input
                id="pw"
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10 pr-10"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-charcoal"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="cpw">Confirm new password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
              <input
                id="cpw"
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input pl-10"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-error/20 bg-error-50 px-3 py-2 text-sm text-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full disabled:opacity-70">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Resetting…</>
            ) : (
              <>Reset password <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
