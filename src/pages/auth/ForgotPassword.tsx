import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthShell } from "./Login";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await forgotPassword({ email: email.trim() });
      setSent(res.message);
      // Auto-advance to reset screen with email prefilled after a beat
      setTimeout(() => nav(`/auth/reset-password?email=${encodeURIComponent(email.trim())}`), 1400);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Could not send code. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <Link to="/auth/login" className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-textgray hover:text-charcoal">
        <ArrowLeft size={14} /> Back to sign in
      </Link>
      <h1 className="text-h1 font-extrabold leading-tight text-balance">Forgot your password?</h1>
      <p className="mt-2 text-textgray">
        Enter the email tied to your Recovang account. We'll send a 6-digit code so you can set a new one.
      </p>

      {sent ? (
        <div className="mt-7 rounded-2xl border border-success/20 bg-success-50 p-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-success" size={20} />
            <div>
              <div className="font-extrabold text-charcoal">Check your inbox</div>
              <p className="mt-1 text-charcoal/70">{sent}</p>
              <p className="mt-2 text-xs text-textgray">Taking you to the reset page…</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-4">
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
                placeholder="you@example.com"
                autoComplete="email"
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
              <><Loader2 size={16} className="animate-spin" /> Sending code…</>
            ) : (
              <>Send reset code <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-textgray">
        Remembered your password?{" "}
        <Link to="/auth/login" className="font-bold text-primary hover:text-primary-700">
          Sign in instead
        </Link>
      </p>
    </AuthShell>
  );
}
