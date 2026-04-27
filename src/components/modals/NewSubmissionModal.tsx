import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  Package, 
  Scale, 
  ChevronRight, 
  ArrowLeft,
  MapPin,
  CheckCircle2,
  QrCode,
  Recycle,
  Building2
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { db } from '../../lib/db';
import { useAuth } from '../../store/auth.store';
import { usePricing, useNearbyHubs } from '../../hooks/useCollector';
import api from '../../services/api';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Logo from '../ui/Logo';
import { cn } from '../../lib/utils';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { data: pricingData } = usePricing();
  const { data: hubData } = useNearbyHubs(6.5244, 3.3792); // Default to Lagos coords for now
  
  const categories = pricingData || [];
  const hubs = hubData || [];

  const [step, setStep] = useState(1);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [items, setItems] = useState<{ catId: string, weight: number }[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPhoto(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const reset = () => {
    setStep(1);
    setSelectedHub(null);
    setItems([]);
    setPhoto(null);
    setSubmissionId(null);
    onClose();
  };

  const totalAmount = items.reduce((sum, item) => {
    const cat = categories.find((c: any) => c.id === item.catId);
    return sum + (item.weight * (cat?.price || 0));
  }, 0);

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const handleSubmit = async () => {
    if (!user || !selectedHub) return;
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('hubId', selectedHub.id);
      formData.append('items', JSON.stringify(items));
      if (photo) formData.append('photo', photo);

      const response = await api.post('/collector/submit-waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSubmissionId(response.data.data.id);
      setStep(4);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = (catId: string) => {
    setItems([...items, { catId, weight: 1 }]);
  };

  const updateWeight = (index: number, weight: number) => {
    const newItems = [...items];
    newItems[index].weight = weight;
    setItems(newItems);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-bordergray flex items-center justify-between bg-offwhite">
              <div className="flex items-center gap-3">
                <Logo variant="icon" size={32} />
                <h3 className="text-ui font-black text-charcoal uppercase tracking-widest">Submit Waste</h3>
              </div>
              <button onClick={reset} className="p-2 text-textgray hover:text-charcoal transition-colors bg-white rounded-full shadow-soft">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Progress Steps */}
              {step < 4 && (
                <div className="flex gap-2 mb-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-500",
                      step >= i ? "bg-primary" : "bg-bordergray/30"
                    )} />
                  ))}
                </div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-h2">Step 1 — Choose Hub</h4>
                    <p className="text-textgray text-small">Select a hub where you'll drop off your waste.</p>
                  </div>
                  <div className="space-y-3">
                    {hubs.map((hub: any) => (
                      <button 
                        key={hub.id}
                        onClick={() => { setSelectedHub(hub); setStep(2); }}
                        className="w-full flex items-center justify-between p-5 bg-offwhite hover:bg-mint border border-bordergray rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-soft group-hover:bg-primary group-hover:text-white transition-all">
                            <MapPin size={24} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-charcoal">{hub.name}</p>
                            <p className="text-ui text-textgray font-medium">{hub.distance} • <span className="text-success">{hub.status}</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-1.5 bg-bordergray/20 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-primary" style={{ width: `${hub.capacity}%` }} />
                          </div>
                          <p className="text-[10px] text-textgray font-bold uppercase">{hub.capacity}% Cap.</p>
                        </div>
                      </button>
                    ))}
                    {hubs.length === 0 && <p className="text-center text-textgray py-4">No hubs found nearby.</p>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep(1)} className="p-2 -ml-2 text-textgray hover:text-charcoal"><ArrowLeft size={20} /></button>
                    <h4 className="text-h2">Step 2 — Add Items</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      {categories.map((cat: any) => (
                        <button 
                          key={cat.id} 
                          onClick={() => addItem(cat.id)}
                          className="flex flex-col items-center gap-2 p-4 bg-offwhite border border-bordergray rounded-2xl hover:border-primary transition-all group"
                        >
                          <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon || '📦'}</span>
                          <span className="text-[10px] font-black text-charcoal uppercase">{cat.name}</span>
                        </button>
                      ))}
                    </div>

                    {items.length > 0 && (
                      <div className="space-y-3">
                        {items.map((item, idx) => {
                          const cat = categories.find((c: any) => c.id === item.catId);
                          return (
                            <div key={idx} className="flex items-center justify-between p-4 bg-mint/30 rounded-2xl border border-primary/10">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{cat?.icon || '📦'}</span>
                                <span className="font-bold text-charcoal">{cat?.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <input 
                                  type="number" 
                                  value={item.weight} 
                                  onChange={(e) => updateWeight(idx, parseFloat(e.target.value))}
                                  className="w-20 bg-white border border-bordergray rounded-xl px-3 py-1 font-mono font-bold text-center outline-none focus:border-primary"
                                />
                                <span className="text-small font-bold text-textgray">kg</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-ui font-black text-textgray uppercase tracking-widest ml-1">Photo Evidence (Required)</label>
                      <div 
                        {...getRootProps()} 
                        className={cn(
                          "border-2 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center transition-all cursor-pointer",
                          photo ? "bg-mint/30 border-primary" : "bg-offwhite border-bordergray hover:border-primary"
                        )}
                      >
                        <input {...getInputProps()} />
                        {photo ? (
                          <div className="text-center">
                            <CheckCircle2 size={32} className="text-primary mx-auto mb-2" />
                            <p className="text-primary font-bold text-small">Photo Captured</p>
                            <p className="text-[10px] text-primary/60">{photo.name}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="mx-auto mb-2 text-textgray/30" size={40} />
                            <p className="text-small text-textgray font-bold">Tap to capture before-photo</p>
                            <p className="text-[10px] text-textgray/60 uppercase mt-1 tracking-widest">Required for verification</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-bordergray pt-6">
                    <div className="text-left">
                      <p className="text-ui text-textgray font-bold uppercase">Estimated Earning</p>
                      <p className="text-h2 text-accent font-mono font-black">₦{totalAmount.toLocaleString()}</p>
                    </div>
                    <Button variant="primary" className="px-10 h-[64px]" onClick={() => setStep(3)} disabled={items.length === 0 || !photo}>
                      Confirm <ChevronRight size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep(2)} className="p-2 -ml-2 text-textgray hover:text-charcoal"><ArrowLeft size={20} /></button>
                    <h4 className="text-h2">Step 3 — Confirm</h4>
                  </div>

                  <div className="p-8 bg-charcoal rounded-[32px] text-white space-y-6 shadow-glow">
                    <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="text-ui text-white/40 uppercase font-bold tracking-widest">Hub Location</p>
                        <p className="text-body font-bold">{selectedHub?.name}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {items.map((item, idx) => {
                        const cat = categories.find((c: any) => c.id === item.catId);
                        return (
                          <div key={idx} className="flex justify-between items-center text-small">
                            <span className="text-white/60">{cat?.name} ({item.weight}kg)</span>
                            <span className="font-mono font-bold text-accent">₦{(item.weight * (cat?.price || 0)).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-h3 font-black uppercase">Total to Earn</span>
                      <span className="text-[40px] font-mono font-black text-white tracking-tighter">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Button variant="primary" className="w-full h-[72px] text-body" onClick={handleSubmit} isLoading={isSubmitting}>
                      Confirm Submission
                    </Button>
                    <p className="text-center text-[10px] text-textgray font-bold uppercase tracking-widest">Pending balance updates immediately after confirm</p>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8 py-6">
                  <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[32px] font-heading font-black text-charcoal">Submission Logged!</h3>
                    <p className="text-textgray max-w-xs mx-auto">Show this QR code to the agent at <span className="font-bold text-charcoal">{selectedHub?.name}</span> to complete verification.</p>
                  </div>

                  <div className="p-8 bg-white border border-bordergray rounded-[32px] shadow-soft inline-block mx-auto">
                    <QRCode value={submissionId || 'REC-XXXXX'} size={180} />
                    <p className="mt-6 font-mono font-black text-charcoal text-xl tracking-widest">{submissionId}</p>
                  </div>

                  <div className="pt-6">
                    <Button variant="outline" className="w-full h-[64px]" onClick={reset}>Back to Dashboard</Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewSubmissionModal;
