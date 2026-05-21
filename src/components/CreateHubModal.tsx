import { useState } from "react";
import { 
  Building2, MapPin, Store, CheckCircle, ChevronRight, ChevronLeft, Info 
} from "lucide-react";
import { useAgentDashboard } from "@/hooks/useAgent";
import { useCreateHub } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { cn } from "@/lib/cn";
import locationsData from "@/constants/locations.json";

interface CreateHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHubModal({ isOpen, onClose }: CreateHubModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    lga: "",
    capacityKg: 5000,
    landmark: "",
    whatsapp: "",
  });

  const { mutate: createHub, isPending } = useCreateHub();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    createHub({
        ...formData,
        location: `${formData.lga}, ${formData.state}`
    }, {
      onSuccess: () => {
        toast.success("Hub creation request submitted!");
        onClose();
      }
    });
  };

  const steps = [
    { title: "Location", icon: MapPin },
    { title: "Business Info", icon: Store },
    { title: "Confirm", icon: CheckCircle },
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Set up your Recovang Hub"
      description="Launch your own waste collection business and start earning commissions."
      size="lg"
    >
      <div className="flex flex-col gap-6">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all",
                step === i + 1 ? "bg-charcoal text-white scale-110 shadow-lg" : 
                step > i + 1 ? "bg-primary text-white" : "bg-cream text-textgray"
              )}>
                {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                step === i + 1 ? "text-charcoal" : "text-textgray"
              )}>{s.title}</span>
              {i < steps.length - 1 && <div className="h-px w-8 bg-bordergray" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">State</label>
                  <select 
                    className="input w-full"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value, lga: "" })}
                  >
                    <option value="">Select State</option>
                    {locationsData.map(s => <option key={s.state} value={s.state}>{s.state.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">LGA</label>
                  <select 
                    className="input w-full"
                    value={formData.lga}
                    onChange={e => setFormData({ ...formData, lga: e.target.value })}
                    disabled={!formData.state}
                  >
                    <option value="">Select LGA</option>
                    {formData.state && locationsData.find(s => s.state === formData.state)?.lgas.map(l => (
                      <option key={l.lga} value={l.lga}>{l.lga.replace(/-/g, " ").toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Street Address</label>
                <input 
                  className="input w-full"
                  placeholder="e.g. 123 Ikorodu Road"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!formData.state || !formData.lga || !formData.address}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Hub Name</label>
                <input 
                  className="input w-full"
                  placeholder="e.g. Ikeja Central Hub"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">WhatsApp Business Number</label>
                  <input 
                    className="input w-full"
                    placeholder="+234..."
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textgray">Storage Capacity (Kg)</label>
                  <input 
                    className="input w-full"
                    type="number"
                    value={formData.capacityKg}
                    onChange={e => setFormData({ ...formData, capacityKg: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button className="btn-ghost" onClick={handleBack}><ChevronLeft size={16} /> Back</button>
                <button 
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!formData.name || !formData.whatsapp}
                >
                  Review Application <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="rounded-3xl bg-cream/50 p-6 space-y-4 border border-bordergray/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-charcoal grid place-items-center text-white">
                    <Store size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-charcoal">{formData.name}</h4>
                    <p className="text-xs text-textgray">{formData.address}, {formData.lga}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-textgray">State</div>
                    <div className="text-sm font-bold text-charcoal">{formData.state}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-textgray">Capacity</div>
                    <div className="text-sm font-bold text-charcoal">{formData.capacityKg}Kg</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 text-primary text-xs leading-relaxed">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>By submitting, you agree to Recovang's Hub Operational Standards. Your application will be reviewed within 24-48 hours.</p>
              </div>

              <div className="flex justify-between pt-2">
                <button className="btn-ghost" onClick={handleBack}><ChevronLeft size={16} /> Back</button>
                <button 
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
