import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  Smartphone, 
  Lightbulb, 
  Tv, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Zap,
  Globe
} from 'lucide-react';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
import Logo from '../ui/Logo';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

type Step = 'selection' | 'bank' | 'airtime' | 'utility' | 'confirm' | 'success';
type UtilityType = 'electricity' | 'cable' | 'data';

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, balance }) => {
  const [step, setStep] = useState<Step>('selection');
  const [selectedUtility, setSelectedUtility] = useState<UtilityType | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string>('');

  const reset = () => {
    setStep('selection');
    setSelectedUtility(null);
    setAmount('');
    setMethod('');
    onClose();
  };

  const handleWithdraw = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStep('success');
  };

  const renderStep = () => {
    switch (step) {
      case 'selection':
        return (
          <div className="space-y-6 pt-4">
            <div className="space-y-1">
              <h3 className="text-h2 text-charcoal">Withdraw Funds</h3>
              <p className="text-textgray text-small">Select how you want to receive your earnings.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              {[
                { id: 'bank', title: 'Bank Transfer', desc: 'Send to any Nigerian bank', icon: <Building2 size={24} />, color: 'primary' },
                { id: 'airtime', title: 'Airtime & Data', desc: 'MTN, Airtel, Glo, 9mobile', icon: <Smartphone size={24} />, color: 'accent' },
                { id: 'utility', title: 'Utility Bills', desc: 'Electricity, DSTV, WAEC, etc.', icon: <Zap size={24} />, color: 'blue-500' },
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => { setMethod(m.title); setStep(m.id as any); }}
                  className="flex items-center gap-4 p-5 bg-offwhite hover:bg-mint border border-bordergray rounded-2xl transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${m.color}/10 flex items-center justify-center text-${m.color} group-hover:bg-${m.color} group-hover:text-white transition-all`}>
                    {m.icon}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-charcoal">{m.title}</h4>
                    <p className="text-ui text-textgray">{m.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-textgray opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('selection')} className="p-2 -ml-2 text-textgray hover:text-charcoal transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-h3 text-charcoal">Bank Transfer</h3>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-charcoal rounded-2xl border-none text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Available to Withdraw</p>
                  <p className="text-[32px] font-mono font-black text-accent">₦{balance.toLocaleString()}</p>
                </div>
                <Logo variant="white" size={60} className="absolute -right-4 -bottom-4 opacity-5 rotate-12" />
              </div>

              <div className="space-y-4">
                <TextField label="Select Bank" placeholder="Search for bank..." />
                <TextField label="Account Number" placeholder="0123456789" />
                <div className="space-y-2">
                  <TextField label="Amount to Withdraw" type="number" placeholder="Min ₦500" value={amount} onChange={e => setAmount(e.target.value)} />
                  <div className="flex gap-2">
                    {['1000', '5000', '10000'].map(v => (
                      <button key={v} onClick={() => setAmount(v)} className="px-3 py-1 bg-offwhite border border-bordergray rounded-lg text-ui font-bold hover:border-primary transition-all">₦{v}</button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button className="w-full py-4" variant="primary" onClick={() => setStep('confirm')} disabled={!amount}>
                Continue
              </Button>
            </div>
          </div>
        );

      case 'airtime':
        return (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('selection')} className="p-2 -ml-2 text-textgray hover:text-charcoal transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-h3 text-charcoal">Airtime & Data</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'MTN', color: 'bg-yellow-400' },
                  { name: 'Airtel', color: 'bg-red-500' },
                  { name: 'Glo', color: 'bg-green-500' },
                  { name: '9mobile', color: 'bg-emerald-600' }
                ].map(n => (
                  <button key={n.name} className="flex flex-col items-center gap-2 p-3 bg-offwhite border border-bordergray rounded-2xl hover:border-primary transition-all group">
                    <div className={`w-12 h-12 rounded-full ${n.color} flex items-center justify-center text-white font-bold text-[10px] shadow-soft group-hover:scale-110 transition-transform`}>{n.name}</div>
                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-tighter">{n.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 bg-primary text-white rounded-xl text-ui font-bold">Airtime</button>
                  <button className="py-2 bg-offwhite text-textgray border border-bordergray rounded-xl text-ui font-bold">Data Bundle</button>
                </div>
                <TextField label="Phone Number" placeholder="0801 234 5678" icon={<Smartphone size={18} />} />
                <TextField label="Amount" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <Button className="w-full py-4" variant="primary" onClick={() => setStep('confirm')} disabled={!amount}>
                Recharge Now
              </Button>
            </div>
          </div>
        );

      case 'utility':
        return (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('selection')} className="p-2 -ml-2 text-textgray hover:text-charcoal transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-h3 text-charcoal">Utility Bills</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { title: 'Electricity', icon: <Zap size={20} />, desc: 'Pay for EKEDC, IKEDC, etc.' },
                { title: 'Cable TV', icon: <Tv size={20} />, desc: 'DSTV, GOtv, StarTimes' },
                { title: 'Internet', icon: <Globe size={20} />, desc: 'Smile, Spectranet, SWIFT' },
                { title: 'Education', icon: <Building2 size={20} />, desc: 'WAEC, JAMB Pin' },
              ].map(u => (
                <button key={u.title} onClick={() => setStep('confirm')} className="flex items-center gap-4 p-4 bg-offwhite border border-bordergray rounded-xl hover:border-primary transition-all group text-left">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {u.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-charcoal text-small">{u.title}</p>
                    <p className="text-[10px] text-textgray font-medium">{u.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-textgray" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-h2">Confirm Payout</h3>
                <p className="text-textgray">Please verify the transaction details below.</p>
              </div>
            </div>

            <div className="bg-offwhite rounded-[24px] border border-bordergray p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-ui font-bold text-textgray uppercase">Method</span>
                <span className="font-bold text-charcoal">{method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ui font-bold text-textgray uppercase">Amount</span>
                <span className="font-bold text-charcoal">₦{Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ui font-bold text-textgray uppercase">Fee</span>
                <span className="font-bold text-primary">₦0.00</span>
              </div>
              <div className="pt-4 border-t border-bordergray flex justify-between items-center">
                <span className="text-small font-black text-charcoal uppercase">Total Debit</span>
                <span className="text-h2 font-black text-primary font-mono">₦{Number(amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 py-4" onClick={() => setStep('selection')}>Cancel</Button>
              <Button variant="primary" className="flex-1 py-4" onClick={handleWithdraw} isLoading={loading}>Withdraw Now</Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-8 pt-8 text-center pb-4">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }} 
              animate={{ scale: 1, rotate: 0 }} 
              className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-[32px] font-heading font-black text-charcoal">Request Sent!</h3>
              <p className="text-textgray max-w-xs mx-auto">Your payout request has been received and is being processed. You'll receive an alert shortly.</p>
            </div>
            <div className="pt-4">
              <Button className="w-full py-4 text-body" variant="outline" onClick={reset}>Back to Wallet</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 lg:p-10">
              <div className="flex justify-between items-center mb-4">
                <Logo variant="icon" size={32} />
                <button onClick={reset} className="p-2 text-textgray hover:text-charcoal transition-colors">
                  <X size={24} />
                </button>
              </div>
              {renderStep()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawalModal;
