import { useState, useEffect } from "react";
import { 
  X, Mail, MapPin, Shield, ShieldCheck, ShieldOff, Clock, 
  Activity, Save, AlertCircle, Trash2, CheckCircle2
} from "lucide-react";
import { StatusPill } from "./ui";
import { useUpdateAdminPermissions, useSuspendUser, useUnsuspendUser } from "@/hooks/useAdmin";
import { PERMISSION_LABELS, type Permission } from "@/lib/permissions";
import { toast } from "react-hot-toast";

interface StaffDetailDrawerProps {
  admin: any | null;
  onClose: () => void;
}

export function StaffDetailDrawer({ admin, onClose }: StaffDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("permissions");
  const [draftPerms, setDraftPerms] = useState<Permission[]>([]);
  
  const { mutate: updatePermissions, isPending: isUpdating } = useUpdateAdminPermissions();
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: unsuspendUser, isPending: isUnsuspending } = useUnsuspendUser();

  useEffect(() => {
    if (admin) {
      setDraftPerms([...(admin.permissions || [])]);
      setActiveTab("permissions");
    }
  }, [admin]);

  if (!admin) return null;

  const isSuper = admin.role === "super_admin" || admin.role === "SUPER_ADMIN";

  const togglePerm = (p: Permission) => {
    if (isSuper) return;
    setDraftPerms((prev) => 
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSavePerms = () => {
    updatePermissions({ id: admin.id, permissions: draftPerms }, {
      onSuccess: () => {
        toast.success("Permissions updated successfully");
        onClose();
      }
    });
  };

  const handleStatusToggle = () => {
    if (isSuper) return;
    if (admin.status === "suspended" || !admin.isActive) {
        unsuspendUser(admin.id, { onSuccess: onClose });
    } else {
        suspendUser(admin.id, { onSuccess: onClose });
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform ${admin ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-xl ${isSuper ? "bg-charcoal text-white" : "bg-primary/10 text-primary"}`}>
              {admin.name?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-xl font-black">{admin.name}</h2>
              <div className="text-xs text-textgray uppercase tracking-widest font-bold flex items-center gap-2">
                {admin.role} {isSuper && <ShieldCheck size={12} className="text-gold" />}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bordergray bg-cream/30 px-6">
          {[
            { id: "permissions", label: "Permissions", icon: <Shield size={13} /> },
            { id: "activity", label: "Activity", icon: <Activity size={13} /> },
            { id: "settings", label: "Account Settings", icon: <AlertCircle size={13} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-textgray hover:text-charcoal"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black">Role-based Access Control</h3>
                  <p className="text-xs text-textgray">Grant or revoke specific capabilities for this admin.</p>
                </div>
                {!isSuper && (
                  <button 
                    onClick={handleSavePerms}
                    disabled={isUpdating}
                    className="btn-primary btn-sm px-4 gap-2"
                  >
                    <Save size={14} /> Save Changes
                  </button>
                )}
              </div>

              {isSuper ? (
                <div className="rounded-2xl bg-charcoal p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-gold" size={20} />
                    <span className="font-bold uppercase tracking-wider">Super Admin Privileges</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    This account has global override permissions. Individual capabilities cannot be revoked from a Super Admin account for security reasons.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {(Object.keys(PERMISSION_LABELS) as Permission[]).map((p) => {
                    const checked = draftPerms.includes(p);
                    const meta = PERMISSION_LABELS[p];
                    const isAll = p === "ALL";
                    if (isAll) return null; // Don't show ALL for regular admins

                    return (
                      <label key={p} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${checked ? "border-primary bg-mint/30 shadow-sm" : "border-bordergray hover:bg-cream/50"}`}>
                        <input 
                            type="checkbox" 
                            className="mt-1 accent-primary h-4 w-4 rounded" 
                            checked={checked} 
                            onChange={() => togglePerm(p)} 
                        />
                        <div className="flex-1">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal flex items-center gap-2">
                            {meta.label}
                          </div>
                          <div className="mt-0.5 text-[10px] text-textgray leading-tight">{meta.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="card p-4 bg-cream/30">
                    <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Total Actions</div>
                    <div className="text-2xl font-black mt-1">{admin.actions || 0}</div>
                  </div>
                  <div className="card p-4 bg-cream/30">
                    <div className="text-[10px] font-bold text-textgray uppercase tracking-widest">Last Seen</div>
                    <div className="text-sm font-bold mt-2 flex items-center gap-1.5"><Clock size={12}/> {admin.lastSeen || "Unknown"}</div>
                  </div>
               </div>

               <section>
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Audit Trail</h3>
                 <div className="space-y-4 relative border-l border-bordergray ml-2 pl-4 py-2">
                    <div className="text-xs text-textgray italic">Activity logs for this admin will appear here in the next update.</div>
                 </div>
               </section>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
                <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Critical Actions</h3>
                    <div className="card border-error/20 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-sm">Account Status</div>
                                <div className="text-xs text-textgray">Current: {admin.isActive ? "Active" : "Suspended"}</div>
                            </div>
                            <button 
                                onClick={handleStatusToggle}
                                disabled={isSuper || isSuspending || isUnsuspending}
                                className={`btn-sm px-4 ${admin.isActive ? "btn-outline border-error/20 text-error hover:bg-error hover:text-white" : "btn-primary"}`}
                            >
                                {admin.isActive ? "Suspend Admin" : "Activate Admin"}
                            </button>
                        </div>
                        
                        <div className="pt-4 border-t border-bordergray flex items-center justify-between">
                            <div>
                                <div className="font-bold text-sm text-error">Remove from Team</div>
                                <div className="text-xs text-textgray">This action cannot be undone.</div>
                            </div>
                            <button 
                                disabled={isSuper}
                                className="btn-ghost text-error btn-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-3">Contact Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-cream/20 border border-bordergray/50">
                            <Mail size={14} className="text-textgray" />
                            <span className="text-sm font-bold">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-cream/20 border border-bordergray/50">
                            <MapPin size={14} className="text-textgray" />
                            <span className="text-sm font-bold">{admin.region}</span>
                        </div>
                    </div>
                </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
