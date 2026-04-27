import { useState } from "react";
import { Bell, Building2, Camera, Check, CreditCard, Eye, EyeOff, Globe2, Lock, Mail, Phone, Shield, Smartphone, Trash2, User2 } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useAuth } from "@/store/auth";
import { Modal, ConfirmModal } from "@/components/Modal";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "profile", label: "Profile", icon: User2 },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Globe2 },
  { id: "payouts", label: "Payouts & banking", icon: CreditCard },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
  const { user, updateUser, signOut } = useAuth();
  const [tab, setTab] = useState<TabId>("profile");
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [pwModal, setPwModal] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [company, setCompany] = useState(user?.company ?? "");

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2200);
  }

  function saveProfile() {
    updateUser({ name, email, phone, city, company });
    flash("Profile updated");
  }

  return (
    <>
      <PageHeader
        eyebrow={`${user?.role?.toUpperCase()} portal · Settings`}
        title="Account settings"
        subtitle="Manage your profile, security, payouts and how Recovang reaches you."
      />

      {saved && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-success/20 bg-success-50 px-4 py-3 text-sm font-bold text-success animate-slideUp">
          <Check size={16} /> {saved}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Side tabs */}
        <aside className="lg:col-span-3">
          <div className="card overflow-hidden p-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition",
                  tab === t.id ? "bg-mint text-primary" : "text-charcoal hover:bg-cream"
                )}
              >
                <t.icon size={15} className={tab === t.id ? "text-primary" : "text-textgray"} />
                {t.label}
              </button>
            ))}
          </div>
          <div className="card mt-4 p-4 text-xs">
            <div className="font-extrabold uppercase tracking-widest text-textgray">Need help?</div>
            <p className="mt-2 text-textgray">Reach our team — we reply in under 30 minutes during business hours.</p>
            <a href="mailto:hello@recovang.com" className="mt-3 inline-flex items-center gap-2 font-bold text-primary">
              hello@recovang.com
            </a>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9">
          {tab === "profile" && (
            <div className="card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl bg-mint font-display text-2xl font-extrabold text-primary">
                    {user?.avatarLetters ?? "?"}
                  </div>
                  <button className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-charcoal text-white shadow-soft hover:bg-charcoal/90">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <div className="text-h4">{name || "Your name"}</div>
                  <div className="text-xs uppercase tracking-widest text-textgray">{user?.role} account</div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" icon={User2}>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="Phone" icon={Phone}>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                {user?.role === "brand" || user?.role === "factory" ? (
                  <Field label="Company" icon={Building2}>
                    <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </Field>
                ) : (
                  <Field label="City / Hub" icon={Globe2}>
                    <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button onClick={saveProfile} className="btn-primary">Save changes</button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-6">
              <div className="card p-6 sm:p-8">
                <h3 className="text-h4 flex items-center gap-2"><Lock size={16} className="text-primary" /> Password</h3>
                <p className="mt-1 text-sm text-textgray">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
                <button onClick={() => setPwModal(true)} className="btn-outline mt-4">Change password</button>
              </div>
              <div className="card p-6 sm:p-8">
                <h3 className="text-h4 flex items-center gap-2"><Shield size={16} className="text-primary" /> Two-factor authentication</h3>
                <p className="mt-1 text-sm text-textgray">Add an extra layer of security with SMS one-time codes.</p>
                <div className="mt-4 flex items-center gap-3">
                  <Toggle defaultOn={false} onChange={(v) => flash(v ? "2FA enabled" : "2FA disabled")} />
                  <span className="text-sm font-bold text-charcoal">Enable SMS 2FA</span>
                </div>
              </div>
              <div className="card border-error/20 bg-error-50/30 p-6 sm:p-8">
                <h3 className="text-h4 text-error flex items-center gap-2"><Trash2 size={16} /> Delete account</h3>
                <p className="mt-1 text-sm text-textgray">This permanently deletes your Recovang account and all data. This cannot be undone.</p>
                <button onClick={() => setConfirmDel(true)} className="btn-outline mt-4 !border-error/30 !text-error hover:!bg-error/10">
                  Delete my account
                </button>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-h4">How we reach you</h3>
              <p className="mt-1 text-sm text-textgray">Pick how you'd like to hear about drops, payouts and announcements.</p>
              <div className="mt-5 divide-y divide-bordergray">
                {[
                  { t: "Drop verifications", d: "When an agent verifies your drop", channels: ["app", "sms"] },
                  { t: "Payouts", d: "Bank transfers, airtime and bills", channels: ["app", "sms", "email"] },
                  { t: "Streak reminders", d: "Don't lose your earning streak", channels: ["app"] },
                  { t: "Leaderboard updates", d: "Weekly rank changes", channels: ["email"] },
                  { t: "Promotions", d: "Bonus events, double-cash weekends", channels: ["email"] },
                ].map((row) => (
                  <div key={row.t} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-charcoal">{row.t}</div>
                      <div className="text-xs text-textgray">{row.d}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["app", "email", "sms"] as const).map((ch) => (
                        <Toggle key={ch} defaultOn={row.channels.includes(ch)} label={ch.toUpperCase()} onChange={() => flash("Preferences saved")} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "preferences" && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-h4">Preferences</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Language">
                  <select className="input" defaultValue="en-NG" onChange={() => flash("Language saved")}>
                    <option value="en-NG">English (Nigeria)</option>
                    <option value="en-GH">English (Ghana)</option>
                    <option value="en-KE">English (Kenya)</option>
                    <option value="fr">Français</option>
                    <option value="yo">Yorùbá</option>
                    <option value="ha">Hausa</option>
                    <option value="ig">Igbo</option>
                  </select>
                </Field>
                <Field label="Currency">
                  <select className="input" defaultValue="NGN" onChange={() => flash("Currency saved")}>
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="GHS">Ghanaian Cedi (GH₵)</option>
                    <option value="KES">Kenyan Shilling (KSh)</option>
                  </select>
                </Field>
                <Field label="Theme">
                  <select className="input" defaultValue="light" onChange={() => flash("Theme saved")}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Match system</option>
                  </select>
                </Field>
                <Field label="Timezone">
                  <select className="input" defaultValue="WAT" onChange={() => flash("Timezone saved")}>
                    <option>Africa/Lagos (WAT)</option>
                    <option>Africa/Accra (GMT)</option>
                    <option>Africa/Nairobi (EAT)</option>
                  </select>
                </Field>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Toggle defaultOn label="Offline mode" onChange={() => flash("Preferences saved")} />
                <span className="text-sm text-textgray">Cache the last 30 days of data for low-network situations.</span>
              </div>
            </div>
          )}

          {tab === "payouts" && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-h4">Payouts & banking</h3>
              <p className="mt-1 text-sm text-textgray">We verify every account through Paystack before sending money.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Bank">
                  <select className="input" defaultValue="058">
                    <option value="058">GTBank</option>
                    <option value="044">Access Bank</option>
                    <option value="011">First Bank</option>
                    <option value="057">Zenith Bank</option>
                    <option value="033">UBA</option>
                  </select>
                </Field>
                <Field label="Account number">
                  <input className="input font-mono" defaultValue="0123456789" />
                </Field>
                <Field label="Account name (auto)">
                  <input className="input" defaultValue={user?.name ?? ""} disabled />
                </Field>
                <Field label="Default payout method">
                  <select className="input" defaultValue="bank">
                    <option value="bank">Bank transfer</option>
                    <option value="airtime">Airtime</option>
                    <option value="bills">Bill payment</option>
                  </select>
                </Field>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => flash("Bank details saved")} className="btn-primary">Save bank details</button>
              </div>
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => { signOut(); window.location.href = "/"; }}
        tone="danger"
        title="Delete your account?"
        description="All your earnings history, drops and connections will be permanently deleted. You cannot undo this."
        confirmLabel="Yes, delete forever"
      />

      <Modal
        open={pwModal}
        onClose={() => setPwModal(false)}
        title="Change password"
        description="Use a fresh password you don't use anywhere else."
        footer={
          <>
            <button className="btn-outline" onClick={() => setPwModal(false)}>Cancel</button>
            <button
              className="btn-primary"
              onClick={() => { setPwModal(false); flash("Password updated"); }}
            >
              Update password
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <PasswordInput label="Current password" />
          <PasswordInput label="New password" />
          <PasswordInput label="Confirm new password" />
        </div>
      </Modal>
    </>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />}
        <div className={Icon ? "[&_input]:pl-10 [&_select]:pl-10" : ""}>{children}</div>
      </div>
    </div>
  );
}

function PasswordInput({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input className="input pr-10" type={show ? "text" : "password"} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false, label, onChange }: { defaultOn?: boolean; label?: string; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => { setOn(!on); onChange?.(!on); }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition",
        on ? "border-primary bg-mint text-primary" : "border-bordergray bg-white text-textgray"
      )}
    >
      <span className={cn("h-3 w-6 rounded-full p-0.5 transition", on ? "bg-primary" : "bg-bordergray")}>
        <span className={cn("block h-2 w-2 rounded-full bg-white transition", on && "translate-x-3")} />
      </span>
      {label ?? (on ? "On" : "Off")}
    </button>
  );
}
