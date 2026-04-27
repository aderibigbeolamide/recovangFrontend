import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  QrCode, 
  Camera, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Package,
  History,
  TrendingUp,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import Logo from '../../components/ui/Logo';
import { cn } from '../../lib/utils';
import { useAgentDashboard, usePendingSubmissions, useVerifySubmission } from '../../hooks/useAgent';

const AgentDashboard: React.FC = () => {
  const { data: dashboard, isLoading: isDashLoading } = useAgentDashboard();
  const { data: pendingQueue, isLoading: isQueueLoading } = usePendingSubmissions(dashboard?.hub?.id);
  const verifyMutation = useVerifySubmission();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeVerification, setActiveVerification] = useState<any>(null);
  const [actualWeight, setActualWeight] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const queue = pendingQueue || [];
  const stats = dashboard || { dailyVolume: 0, capacity: 0, avgTime: '0m', accuracy: '0%' };

  const handleVerify = async () => {
    if (!activeVerification || !actualWeight) return;
    
    verifyMutation.mutate({
      submissionId: activeVerification.id,
      weight: parseFloat(actualWeight)
    }, {
      onSuccess: () => {
        setIsSuccess(true);
      }
    });
  };

  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render((decodedText) => {
        const found = queue.find((q: any) => q.id === decodedText);
        if (found) {
          setActiveVerification(found);
          setIsScannerOpen(false);
          scanner.clear();
        }
      }, (error) => {
        // Handle scan error
      });
      return () => scanner.clear();
    }
  }, [isScannerOpen, queue]);

  if (isDashLoading) return <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>;

  const reset = () => {
    setActiveVerification(null);
    setIsSuccess(false);
    setActualWeight('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-h1 mb-2">Agent Dashboard</h1>
          <p className="text-textgray text-small">{stats.hub?.name || 'Loading Hub...'} • <span className="text-success font-bold uppercase tracking-widest">Active Now</span></p>
        </div>
        <Button variant="primary" size="lg" className="h-[64px] px-8 shadow-glow" onClick={() => setIsScannerOpen(true)}>
          <QrCode size={24} /> Scan Collector QR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Stats & Performance */}
        <div className="space-y-6">
          <GlassCard className="p-6 bg-charcoal text-white overflow-hidden relative">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Hub Volume (Today)</p>
                <TrendingUp size={16} className="text-primary" />
              </div>
              <h2 className="text-[40px] font-mono font-black text-accent">{stats.dailyVolume || 0}<span className="text-white/50">kg</span></h2>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(stats.dailyVolume / (stats.capacity || 1000)) * 100}%` }} />
              </div>
              <p className="text-ui text-white/40 font-medium">Capacity: {stats.capacity || 0}kg</p>
            </div>
            <Package size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
          </GlassCard>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Avg Verify Time', value: stats.avgTime, icon: <History className="text-primary" /> },
              { label: 'Accuracy Score', value: stats.accuracy, icon: <ShieldCheck className="text-accent" /> },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-offwhite flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] text-textgray font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-h3 text-charcoal">{stat.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Middle Column: Pending Queue */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 flex items-center gap-3">
              Verification Queue <span className="px-3 py-1 bg-primary text-white text-ui rounded-full">{queue.length}</span>
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-10"><Filter size={16} /></Button>
              <Button variant="ghost" size="sm" className="h-10"><Search size={16} /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map((item: any) => (
              <motion.div 
                layoutId={item.id}
                key={item.id} 
                className="p-6 bg-white border border-bordergray rounded-[32px] shadow-soft hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center text-primary font-black text-xl group-hover:bg-primary group-hover:text-white transition-all">
                      {item.collector?.user?.firstName?.[0] || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal">{item.collector?.user?.firstName} {item.collector?.user?.lastName}</h4>
                      <p className="text-ui text-textgray font-bold uppercase tracking-widest">{item.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-offwhite rounded-2xl border border-bordergray/50">
                    <p className="text-[10px] text-textgray font-bold uppercase mb-1">Material</p>
                    <p className="font-bold text-charcoal truncate">{item.category}</p>
                  </div>
                  <div className="p-4 bg-offwhite rounded-2xl border border-bordergray/50">
                    <p className="text-[10px] text-textgray font-bold uppercase mb-1">Claimed Weight</p>
                    <p className="font-bold text-primary">{item.estimatedWeight}kg</p>
                  </div>
                </div>

                <Button variant="primary" className="w-full h-[56px]" onClick={() => setActiveVerification(item)}>
                  Start Verification <ArrowRight size={18} />
                </Button>
              </motion.div>
            ))}
            {queue.length === 0 && !isQueueLoading && (
              <div className="md:col-span-2 p-12 text-center bg-offwhite rounded-[40px] border-2 border-dashed border-bordergray">
                <p className="text-textgray font-bold">No pending drop-offs at this hub.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsScannerOpen(false)}
              className="absolute inset-0 bg-charcoal/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-bordergray flex items-center justify-between">
                <Logo variant="icon" size={32} />
                <h3 className="text-body font-black uppercase tracking-widest">Scan Collector QR</h3>
                <button onClick={() => setIsScannerOpen(false)} className="p-2 text-textgray"><X size={24} /></button>
              </div>
              <div className="p-8">
                <div id="reader" className="w-full aspect-square bg-offwhite rounded-[32px] overflow-hidden border-2 border-primary/20" />
                <div className="mt-8 flex items-center gap-4 p-4 bg-mint/50 rounded-2xl border border-primary/10">
                  <AlertCircle className="text-primary shrink-0" size={24} />
                  <p className="text-ui font-medium text-primary">Position the QR code within the frame to automatically verify the collector.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification Flow Modal */}
      <AnimatePresence>
        {activeVerification && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={reset}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              {!isSuccess ? (
                <>
                  <div className="p-8 border-b border-bordergray bg-offwhite">
                    <div className="flex justify-between items-center mb-6">
                      <Logo variant="icon" size={32} />
                      <button onClick={reset} className="p-2 text-textgray"><X size={24} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white text-2xl font-black">
                        {activeVerification.collector?.user?.firstName?.[0] || 'C'}
                      </div>
                      <div>
                        <h4 className="text-h2 text-charcoal">{activeVerification.collector?.user?.firstName} {activeVerification.collector?.user?.lastName}</h4>
                        <p className="text-ui text-textgray font-bold uppercase tracking-widest">{activeVerification.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-offwhite rounded-3xl border border-bordergray space-y-2">
                        <p className="text-[10px] text-textgray font-black uppercase tracking-widest">Claimed Material</p>
                        <p className="text-h3 text-charcoal truncate">{activeVerification.category}</p>
                      </div>
                      <div className="p-6 bg-mint rounded-3xl border border-primary/10 space-y-2">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">Claimed Weight</p>
                        <p className="text-h3 text-primary font-black font-mono">{activeVerification.estimatedWeight}kg</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-ui font-black text-textgray uppercase tracking-widest ml-1">Input Scale Weight (kg)</label>
                        <TextField 
                          placeholder="0.00" 
                          type="number" 
                          icon={<Scale size={20} />} 
                          value={actualWeight}
                          onChange={(e) => setActualWeight(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-ui font-black text-textgray uppercase tracking-widest ml-1">Scale Photo Evidence</label>
                        <div className="border-2 border-dashed border-bordergray rounded-[32px] p-10 flex flex-col items-center justify-center bg-offwhite hover:border-primary transition-all cursor-pointer group">
                          <Camera className="text-textgray/30 group-hover:text-primary transition-colors mb-2" size={48} />
                          <p className="text-small text-textgray font-bold">Capture Scale Reading</p>
                          <p className="text-[10px] text-textgray/50 uppercase tracking-widest mt-1">Required for Payout</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-bordergray pt-6">
                      <div className="text-left">
                        <p className="text-ui text-textgray font-bold uppercase tracking-widest">Payout Amount</p>
                        <p className="text-[40px] text-accent font-mono font-black tracking-tighter">₦{(parseFloat(actualWeight || '0') * 120).toLocaleString()}</p>
                      </div>
                      <Button variant="primary" className="px-10 h-[64px] text-body" onClick={handleVerify} isLoading={verifyMutation.isPending} disabled={!actualWeight}>
                        Confirm & Pay <ArrowRight size={20} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center space-y-8">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-h1">Payout Successful!</h3>
                    <p className="text-textgray max-w-xs mx-auto">Collector <span className="font-bold text-charcoal">{activeVerification.collector?.user?.firstName}</span> has been credited immediately.</p>
                  </div>
                  <div className="p-6 bg-offwhite rounded-3xl border border-bordergray">
                    <div className="flex justify-between items-center text-small mb-2">
                      <span className="text-textgray uppercase font-bold">Verified Weight</span>
                      <span className="font-mono font-black">{actualWeight} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-small">
                      <span className="text-textgray uppercase font-bold">Total Paid</span>
                      <span className="font-mono font-black text-primary">₦{(parseFloat(actualWeight || '0') * 120).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-[64px]" onClick={reset}>Back to Queue</Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDashboard;
