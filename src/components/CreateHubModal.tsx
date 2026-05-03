import { useState } from "react";
import { Building2, MapPin, Navigation, Phone, X, Loader2 } from "lucide-react";
import { useAgentDashboard } from "@/hooks/useAgent";
import { toast } from "react-hot-toast";

interface CreateHubModalProps {
  onClose: () => void;
}

export function CreateHubModal({ onClose }: CreateHubModalProps) {
  const { refetch } = useAgentDashboard();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "Lagos",
    lga: "Ikeja",
    phone: "",
    lat: 6.5244,
    lng: 3.3792
  });

  async function handleSubmit() {
    setLoading(true);
    try {
        // Mocking API call for now - would connect to createHub endpoint
        await new Promise(r => setTimeout(r, 1500));
        toast.success("Hub created successfully! Welcome to Recovang.");
        refetch();
        onClose();
    } catch (err) {
        toast.error("Failed to create hub. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between border-b border-bordergray bg-cream/30 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-grad-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">Set up your Hub</h2>
              <p className="text-xs text-textgray">Enter your business location details</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-cream transition-colors">
            <X size={20} className="text-textgray" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="label">Hub / Business Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                  <input 
                    className="input pl-11" 
                    placeholder="e.g. Green Planet Recyclers" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="label">Physical Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                  <input 
                    className="input pl-11" 
                    placeholder="e.g. 123 Herbert Macaulay Way" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">State</label>
                  <select 
                    className="input"
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                  >
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Ogun</option>
                  </select>
                </div>
                <div>
                  <label className="label">LGA</label>
                  <input 
                    className="input" 
                    placeholder="e.g. Ikeja" 
                    value={formData.lga}
                    onChange={e => setFormData({...formData, lga: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="label">Contact Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                  <input 
                    className="input pl-11" 
                    placeholder="+234..." 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.address}
                className="btn-primary btn-lg w-full mt-4"
              >
                Continue to Mapping <Navigation size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="aspect-video rounded-2xl bg-cream border-2 border-dashed border-bordergray flex flex-col items-center justify-center p-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
                  <Navigation size={32} />
                </div>
                <h4 className="font-bold">Google Maps Integration</h4>
                <p className="text-xs text-textgray mt-2">
                  We'll use your address to pinpoint your hub on the network map for collectors.
                </p>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-textgray">Detected Coordinates</span>
                    <span className="font-mono text-sm font-bold bg-white px-3 py-1 rounded-full border border-bordergray shadow-sm">
                        {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                    </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 py-4"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Complete Hub Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
