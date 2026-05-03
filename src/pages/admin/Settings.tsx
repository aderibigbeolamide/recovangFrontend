import { PageHeader, Avatar } from "@/components/ui";
import { useSettings, useUpdateSetting, useSetup2FA, useVerify2FA, useAuditLogs } from "@/hooks/useAdmin";
import { Save, Settings2, ShieldAlert, Globe, Percent, Wallet, Info, Lock, CheckCircle2, QrCode, Bell, Zap, Database, History, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
  const { user } = useAuth();
  const isSuper = user?.role?.toLowerCase() === "super_admin";
  const { data: settings, isLoading, isError } = useSettings(isSuper);
  const { mutate: updateSetting, isPending } = useUpdateSetting();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("operations");

  // Fetch recent setting changes for the sidebar
  const { data: auditData } = useAuditLogs({ action: "SYSTEM_SETTING_UPDATED", limit: 5 }, isSuper);


  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (!isSuper) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-red-50 text-red-500">
          <ShieldAlert size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-charcoal">Access Denied</h3>
          <p className="text-sm text-textgray max-w-xs">
            System configuration is restricted to Super Administrators only. Please contact your system owner for access.
          </p>
        </div>
        <button onClick={() => window.history.back()} className="btn-outline mt-4">
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center text-textgray">Loading system configuration...</div>;
  if (isError) return <div className="flex h-64 items-center justify-center text-error font-bold">Failed to load system configuration.</div>;


  const tabs = [
    { id: "operations", label: "Operations", icon: Zap },
    { id: "finance", label: "Financials", icon: Wallet },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const categories: Record<string, any[]> = {
    operations: [
      { key: "MAINTENANCE_MODE", label: "Maintenance Mode", type: "boolean", helper: "Only Super Admins can access the platform when enabled." },
      { key: "KYC_REQUIRED_FOR_WITHDRAWAL", label: "Mandatory KYC", type: "boolean", helper: "Require verified ID before users can request payouts." },
      { key: "ID_AUTO_VERIFICATION", label: "Auto-Verify KYC", type: "boolean", helper: "Attempt AI-based verification before manual admin review." },
    ],
    finance: [
      { key: "PLATFORM_TAX_RATE", label: "Platform Tax Rate", type: "number", helper: "Global tax applied to transactions (e.g. 0.075 for 7.5%)." },
      { key: "BASE_SERVICE_FEE", label: "Base Service Fee", type: "naira", helper: "Flat fee added to logistics and processing (₦)." },
      { key: "MIN_WITHDRAWAL_AMOUNT", label: "Min Withdrawal", type: "naira", helper: "Minimum amount a user can request for payout." },
      { key: "REFERRAL_BONUS_RATE", label: "Referral Reward", type: "number", helper: "Percentage reward for successful agent/collector referrals." },
    ],
    security: [
      { key: "OTP_EXPIRY_MINUTES", label: "OTP Expiry", type: "number", helper: "Minutes before a verification code becomes invalid." },
      { key: "MAX_LOGIN_ATTEMPTS", label: "Max Login Attempts", type: "number", helper: "Number of failures before an IP is temporary blocked." },
      { key: "SESSION_TIMEOUT_HOURS", label: "Session Timeout", type: "number", helper: "Hours before an admin is automatically logged out." },
    ],
    notifications: [
      { key: "SMS_PROVIDER", label: "SMS Gateway", type: "select", options: ["Termii", "Twilio", "AWS SNS"], helper: "Primary provider for sending verification codes." },
      { key: "EMAIL_NOTIFICATIONS_ENABLED", label: "Email Alerts", type: "boolean", helper: "Send system alerts to administrative emails." },
    ]
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        eyebrow="System Control"
        title="Configuration Center"
        subtitle="Manage the global variables that power the Recovang ecosystem. Changes take effect instantly across all clusters."
        icon={Settings2}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Settings Area */}
        <div className="flex-1 space-y-6">
          {/* Custom Tabs */}
          <div className="flex items-center gap-1 p-1 bg-cream rounded-2xl w-fit border border-bordergray">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-textgray hover:text-charcoal"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {categories[activeTab].map((item) => (
              <div key={item.key} className="card p-6 border-bordergray/60 hover:border-primary/20 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-charcoal">{item.label}</h4>
                      <code className="text-[9px] bg-cream px-1.5 py-0.5 rounded text-primary font-mono">{item.key}</code>
                    </div>
                    <p className="text-xs text-textgray mt-1 flex items-center gap-1.5">
                      <Info size={12} className="opacity-50" />
                      {item.helper}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.type === "boolean" ? (
                      <button 
                        onClick={() => {
                          const val = localSettings[item.key] === "true" ? "false" : "true";
                          setLocalSettings({ ...localSettings, [item.key]: val });
                        }}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          localSettings[item.key] === "true" ? "bg-primary" : "bg-bordergray"
                        }`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          localSettings[item.key] === "true" ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    ) : item.type === "select" ? (
                      <select 
                        className="input h-10 min-w-[120px] py-0"
                        value={localSettings[item.key] || ""}
                        onChange={(e) => setLocalSettings({ ...localSettings, [item.key]: e.target.value })}
                      >
                        {item.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <div className="relative">
                        {item.type === "naira" && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-textgray">₦</span>}
                        <input
                          type="text"
                          className={`input h-10 w-32 ${item.type === "naira" ? "pl-7" : ""}`}
                          value={localSettings[item.key] || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, [item.key]: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    
                    <button
                      className={`btn-primary h-10 w-10 p-0 flex items-center justify-center transition-all ${
                        !settings || localSettings[item.key] === settings[item.key] ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                      }`}
                      onClick={() => handleUpdate(item.key)}
                      disabled={isPending}
                    >
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <TwoFactorSection />
          </div>
        </div>

        {/* Sidebar: Recent Changes */}
        <div className="lg:w-80 space-y-6">
          <div className="card p-6 border-mint/20 bg-mint/5">
            <div className="flex items-center gap-2 mb-6">
              <History size={18} className="text-primary" />
              <h3 className="font-extrabold text-charcoal">Recent Changes</h3>
            </div>
            
            <div className="space-y-6">
              {auditData?.items?.length > 0 ? auditData.items.map((log: any) => (
                <div key={log.id} className="relative pl-4 border-l-2 border-bordergray pb-1">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-bordergray" />
                  <div className="text-[10px] font-bold text-textgray uppercase tracking-wider mb-1">
                    {new Date(log.createdAt).toLocaleDateString()} · {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs font-extrabold text-charcoal mb-1">
                    {log.after?.key || "Setting"} updated
                  </div>
                  <div className="text-[10px] text-textgray leading-relaxed flex items-center gap-1">
                    <Avatar name={`${log.admin?.firstName} ${log.admin?.lastName}`} size={14} />
                    by {log.admin?.firstName}
                  </div>
                </div>
              )) : (
                <p className="text-xs text-textgray italic">No recent configuration changes found.</p>
              )}
            </div>
            
            <button className="btn-outline btn-sm w-full mt-6 gap-2">
              <Search size={12} /> View full audit trail
            </button>
          </div>

          <div className="card p-6 bg-charcoal text-white border-none relative overflow-hidden">
             <Database size={48} className="absolute -right-4 -bottom-4 opacity-10" />
             <h4 className="font-bold text-accent text-sm uppercase tracking-widest mb-2">Cluster Status</h4>
             <div className="space-y-3">
               <StatusItem label="API Node" status="Healthy" color="bg-mint" />
               <StatusItem label="Database" status="Synchronized" color="bg-mint" />
               <StatusItem label="CDN Cache" status="Active" color="bg-mint" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-white/60">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
        <span className="text-[11px] font-bold">{status}</span>
      </div>
    </div>
  );
}

function TwoFactorSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const { mutate: setup, data: setupData, isPending: settingUp } = useSetup2FA();
  const { mutate: verify, isPending: verifying } = useVerify2FA();

  const handleStartSetup = () => {
    setup(undefined, {
      onSuccess: () => setModalOpen(true)
    });
  };

  const handleVerify = () => {
    if (token.length !== 6) return;
    verify(token, {
      onSuccess: () => {
        setModalOpen(false);
        setToken("");
      }
    });
  };

  return (
    <div className="rounded-3xl border border-charcoal/10 bg-charcoal p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-accent">
            <Lock size={24} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-extrabold mb-2">Two-Factor Authentication (2FA)</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Add an extra layer of security to your account. We use TOTP compatible with Google Authenticator and Authy.
            </p>
          </div>
        </div>

        <button 
          onClick={handleStartSetup}
          disabled={settingUp}
          className="btn-accent px-8 h-12 font-bold shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:scale-105 transition-all"
        >
          {settingUp ? "Generating..." : "Setup 2FA Now"}
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Secure your account">
        <div className="p-6">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="p-4 bg-white rounded-3xl shadow-soft">
              {setupData?.qrCodeUrl ? (
                <img src={setupData.qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 grid place-items-center"><QrCode size={48} className="animate-pulse text-textgray" /></div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-charcoal">Scan this QR Code</p>
              <p className="text-xs text-textgray px-8">
                Open your authenticator app and scan the code above.
                <code className="block mt-2 p-2 bg-cream rounded-lg text-primary font-mono">{setupData?.secret}</code>
              </p>
            </div>

            <div className="w-full space-y-4 pt-4 border-t border-bordergray">
              <div className="text-xs font-bold text-textgray uppercase tracking-widest text-center">Enter 6-digit code</div>
              <input 
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="input text-center text-2xl tracking-[1em] font-mono h-14"
                placeholder="000000"
              />
              <button 
                onClick={handleVerify}
                disabled={verifying || token.length !== 6}
                className="btn-primary w-full h-12"
              >
                {verifying ? "Verifying..." : "Enable 2FA"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

