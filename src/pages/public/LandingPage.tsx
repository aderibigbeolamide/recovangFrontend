import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Recycle, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Globe,
  Truck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';

const CATEGORIES = [
  { id: 'pet', name: 'PET Plastics', rate: 120, icon: '🥤' },
  { id: 'aluminum', name: 'Aluminum Cans', rate: 450, icon: '🥫' },
  { id: 'glass', name: 'Glass Bottles', rate: 20, icon: '🍾' },
];

const LandingPage: React.FC = () => {
  const [weeklyWeight, setWeeklyWeight] = useState(25);
  
  const estimatedWeekly = weeklyWeight * 120; // Simplified average
  const estimatedMonthly = estimatedWeekly * 4;

  return (
    <div className="min-h-screen bg-offwhite text-charcoal font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-bordergray px-6 lg:px-12 h-20 flex items-center justify-between">
        <Logo size={32} />
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-small font-bold hover:text-primary transition-colors">How it Works</a>
          <a href="#solutions" className="text-small font-bold hover:text-primary transition-colors">Solutions</a>
          <a href="#impact" className="text-small font-bold hover:text-primary transition-colors">Impact</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-small font-bold hover:text-primary transition-colors">Sign In</Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="hidden sm:flex">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-gradient-to-br from-primary to-[#0D3D22] text-white">
        {/* Animated Bottle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          {/* Subtle bottle SVG pattern could go here */}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-[56px] lg:text-[72px] leading-[1.05] font-heading font-black tracking-tighter">
              Turn Your Waste <br />
              <span className="text-accent">Into Real Cash</span>
            </h1>
            <p className="text-mint text-[20px] font-medium max-w-xl leading-relaxed">
              Collect bottles, cans and plastics. Drop at a hub near you. Earn money straight to your bank, airtime, or pay your bills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-charcoal shadow-gold">Start Earning Now <ArrowRight className="ml-2" size={20} /></Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">How It Works</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/10">
              <img 
                src="/images/hero_professional.png" 
                alt="Nigerian woman using Recovang app" 
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-bordergray relative z-20 shadow-lg -mt-12 mx-6 lg:mx-20 rounded-[32px]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Collectors joined', value: 12450, suffix: '+', icon: <Users2 className="text-primary" /> },
            { label: 'Tonnes Collected', value: 145, suffix: 'T', icon: <Recycle className="text-accent" /> },
            { label: '₦ Paid Out', value: 4.2, suffix: 'M+', icon: <Wallet className="text-blue-500" /> },
            { label: 'Cities Active', value: 12, suffix: '', icon: <MapPin className="text-error" /> },
          ].map((stat, i) => (
            <CounterItem key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 lg:px-12 bg-mint">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-[48px] lg:text-[56px] font-heading font-black text-charcoal">The Recovang Cycle</h2>
            <p className="text-h3 text-textgray max-w-2xl mx-auto">A seamless journey from waste collection to high-value industrial reuse.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: 'Step 1 — Collect', 
                title: 'Gather Waste', 
                desc: 'Gather empty bottles, cans, plastics from home and street.',
                icon: <Recycle size={48} className="text-primary" />
              },
              { 
                step: 'Step 2 — Drop Off', 
                title: 'Find a Hub', 
                desc: 'Find a Recovang hub near you on the map.',
                icon: <MapPin size={48} className="text-accent" />
              },
              { 
                step: 'Step 3 — Get Paid', 
                title: 'Earn Rewards', 
                desc: 'Earn real money — bank transfer, airtime, or pay bills.',
                icon: <Wallet size={48} className="text-blue-500" />
              },
            ].map((item, i) => (
              <div key={i} className="p-12 bg-white rounded-[40px] shadow-soft border border-bordergray group hover:-translate-y-2 transition-all duration-500">
                <span className="text-ui font-black text-primary uppercase tracking-widest mb-6 block">{item.step}</span>
                <div className="w-20 h-20 bg-mint/50 rounded-3xl flex items-center justify-center mb-8">
                  {item.icon}
                </div>
                <h3 className="text-h2 mb-4">{item.title}</h3>
                <p className="text-body text-textgray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earn Calculator */}
      <section className="py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto p-12 bg-charcoal rounded-[48px] text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-h1 text-center mb-12">Earnings Calculator</h2>
            
            <div className="space-y-12 mb-16">
              <div className="space-y-4 text-center">
                <p className="text-h2 font-mono text-accent">I collect {weeklyWeight} kg per week</p>
                <input 
                  type="range" 
                  min="5" 
                  max="500" 
                  value={weeklyWeight}
                  onChange={(e) => setWeeklyWeight(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-ui text-white/40 font-bold">
                  <span>5 kg</span>
                  <span>500 kg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-ui text-white/40 font-bold uppercase mb-2">Estimated Weekly</p>
                  <p className="text-[48px] font-mono font-black text-accent">₦{estimatedWeekly.toLocaleString()}</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-ui text-white/40 font-bold uppercase mb-2">Estimated Monthly</p>
                  <p className="text-[48px] font-mono font-black text-white">₦{estimatedMonthly.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-ui font-bold">{cat.name}: ₦{cat.rate}/kg</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
      </section>

      {/* Waste Categories Grid */}
      <section className="py-32 px-6 lg:px-12 bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div className="space-y-4">
              <h2 className="text-h1">What We Accept</h2>
              <p className="text-h3 text-textgray">Get paid for every gram of these materials.</p>
            </div>
            <Link to="/register">
              <Button variant="primary" className="h-[56px] px-10">Start Collecting <ArrowRight size={20} /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="p-10 bg-white rounded-3xl border border-bordergray shadow-soft hover:border-primary transition-all group">
                <div className="text-[64px] mb-6 group-hover:scale-110 transition-transform block">{cat.icon}</div>
                <h3 className="text-h2 mb-2">{cat.name}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-ui font-bold text-textgray">Currently ₦{cat.rate}/kg</p>
                </div>
                <p className="text-small text-textgray leading-relaxed mb-8">
                  Pure and clean {cat.name.toLowerCase()} sourced directly from your home or neighborhood hubs.
                </p>
                <div className="h-1.5 w-full bg-offwhite rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '85%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h1 text-center mb-24">Collector Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmed Musa', city: 'Ikeja', earnings: '₦42,000', quote: 'Recovang helped me pay my daughter\'s school fees just by collecting bottles from my neighborhood.' },
              { name: 'Blessing Okon', city: 'Maryland', earnings: '₦18,500', quote: 'The instant bank transfer is what I love most. No waiting, no stress. Just recycle and get paid.' },
              { name: 'Samuel Eke', city: 'Lekki', earnings: '₦125,000', quote: 'I started as a small collector, now I run a small team. Recovang changed my life.' },
            ].map((t, i) => (
              <div key={i} className="p-10 bg-offwhite rounded-3xl relative">
                <Quote className="text-primary/20 absolute top-8 right-8" size={48} />
                <div className="space-y-6">
                  <p className="text-body italic text-charcoal leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-mint flex items-center justify-center text-primary font-bold text-xl">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal">{t.name}</h4>
                      <p className="text-ui text-textgray font-medium">{t.city} • <span className="text-primary font-bold">Earned {t.earnings}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section className="py-32 px-6 lg:px-12 bg-charcoal text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-[48px] lg:text-[64px] font-heading font-black leading-tight">
              Is Your Brand <br /> Producing Bottles?
            </h2>
            <p className="text-h3 text-white/60 leading-relaxed">
              Meet your Extended Producer Responsibility (EPR) targets with ease. Track your recovery metrics in real-time.
            </p>
            <Button variant="gold" size="lg" className="px-12 py-5 text-charcoal">Partner With Us</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <ShieldCheck className="text-primary" size={40} />
              <h4 className="font-bold">Compliance</h4>
              <p className="text-ui text-white/40">Automated reporting for NESREA/EPR standards.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <TrendingUp className="text-accent" size={40} />
              <h4 className="font-bold">Recovery</h4>
              <p className="text-ui text-white/40">Track every kg of plastic returned to the supply chain.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 lg:px-12 bg-offwhite border-t border-bordergray">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Logo size={40} />
            <p className="text-small text-textgray leading-relaxed">
              Empowering Nigerians to build a sustainable future through smart waste recovery.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-charcoal uppercase tracking-widest text-ui mb-8">Quick Links</h4>
            <ul className="space-y-4 text-small text-textgray">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/find-hub" className="hover:text-primary transition-colors">Find a Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-charcoal uppercase tracking-widest text-ui mb-8">Support</h4>
            <ul className="space-y-4 text-small text-textgray">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-bold text-charcoal uppercase tracking-widest text-ui mb-8">Contact</h4>
            <p className="text-small text-textgray">hello@recovang.com</p>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white border border-bordergray flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <Globe size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CounterItem: React.FC<{ label: string, value: number, suffix: string, icon: React.ReactNode }> = ({ label, value, suffix, icon }) => {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] text-textgray font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <h3 className="text-[40px] font-heading font-black text-charcoal leading-none">{value}</h3>
        <span className="text-2xl font-black text-primary">{suffix}</span>
      </div>
    </div>
  );
};

function Users2({ className, size }: { className?: string, size?: number }) {
  return (
    <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  );
}

export default LandingPage;
