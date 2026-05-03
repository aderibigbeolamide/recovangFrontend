import { useState } from "react";
import { X, Mail, User, ShieldPlus } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface InviteAgentModalProps {
  onClose: () => void;
}

export function InviteAgentModal({ onClose }: InviteAgentModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    type: "FIXED"
  });

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/agent/invite", form);
      toast.success("Invitation request submitted! An admin will review it soon.");
      queryClient.invalidateQueries({ queryKey: ["agent-hub"] });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-lift animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <ShieldPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-charcoal">Request Team Member</h3>
              <p className="text-xs text-textgray">Submit a recruitment request for your hub</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-cream p-2 text-textgray hover:text-charcoal transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
                <input
                  required
                  type="email"
                  className="input h-11 pl-9"
                  placeholder="agent@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-1.5 block">First Name</label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
                        <input
                            required
                            className="input h-11 pl-9"
                            placeholder="John"
                            value={form.firstName}
                            onChange={e => setForm({...form, firstName: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-1.5 block">Last Name</label>
                    <input
                        required
                        className="input h-11"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={e => setForm({...form, lastName: e.target.value})}
                    />
                </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-1.5 block">Agent Type</label>
              <select 
                className="input h-11"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="FIXED">Hub Agent (Fixed)</option>
                <option value="MOBILE">Mobile Agent</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex-1"
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
