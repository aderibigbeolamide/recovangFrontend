import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  ArrowLeft,
  Building2,
  ShieldCheck,
  Recycle,
  Truck,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import { cn } from '../../lib/utils';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        ...formData,
        role: role as any
      });
      
      if (response.data.status === 'success') {
        handleNext();
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const ROLES = [
    { id: 'collector', title: 'Collector', desc: 'Recycle waste and earn money.', icon: <Recycle size={32} /> },
    { id: 'agent', title: 'Hub Agent', desc: 'Verify and manage hub operations.', icon: <ShieldCheck size={32} /> },
    { id: 'brand', title: 'Brand Partner', desc: 'EPR compliance and impact tracking.', icon: <Building2 size={32} /> },
    { id: 'factory', title: 'Factory', desc: 'Source raw recycled materials.', icon: <Building2 size={32} /> },
    { id: 'logistics', title: 'Logistics', desc: 'Manage fleet and pickup tasks.', icon: <Truck size={32} /> },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-6 py-20">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <Logo size={48} variant="stacked" />
          </Link>
          <h1 className="text-h1">Join Recovang</h1>
          <p className="text-textgray text-small">Building a cleaner world, one piece at a time.</p>
        </div>

        <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-soft border border-bordergray">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                step >= i ? "bg-primary" : "bg-offwhite"
              )} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-h2">Choose your role</h3>
                  <p className="text-textgray text-small">Select how you want to participate in the ecosystem.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROLES.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => { setRole(r.id); handleNext(); }}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 group",
                        role === r.id ? "border-primary bg-mint" : "border-offwhite bg-offwhite hover:border-primary/20"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        role === r.id ? "bg-primary text-white" : "bg-white text-textgray group-hover:text-primary"
                      )}>
                        {r.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{r.title}</h4>
                        <p className="text-ui text-textgray leading-tight">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <button onClick={handleBack} className="p-2 -ml-2 text-textgray hover:text-charcoal"><ArrowLeft size={20} /></button>
                  <h3 className="text-h2">Account Info</h3>
                </div>
                {error && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-ui font-bold">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField 
                    label="First Name" 
                    placeholder="Samuel" 
                    icon={<User size={20} />} 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <TextField 
                    label="Last Name" 
                    placeholder="Musa" 
                    icon={<User size={20} />} 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  <TextField 
                    label="Email Address" 
                    type="email" 
                    placeholder="sam@example.com" 
                    icon={<Mail size={20} />} 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <TextField 
                    label="Phone Number" 
                    placeholder="08012345678" 
                    icon={<Phone size={20} />} 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <TextField 
                      label="Password" 
                      type="password" 
                      placeholder="••••••••" 
                      icon={<Lock size={20} />} 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="w-full h-[56px]" onClick={handleRegister} isLoading={isLoading}>
                  Create Account <ChevronRight size={20} />
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 text-center py-6"
              >
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-h2">Almost there!</h3>
                  <p className="text-textgray">We've sent a verification link to your email. Click it to activate your account.</p>
                </div>
                <div className="pt-4 space-y-4">
                  <Button className="w-full" onClick={() => navigate('/login')}>Go to Login</Button>
                  <button className="text-ui font-bold text-primary hover:underline">Resend Email</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Register;
