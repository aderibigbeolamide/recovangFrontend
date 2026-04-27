import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const LogisticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 mb-2">Fleet Operations</h1>
          <p className="text-textgray text-small">Truck: Reco-T4 • Driver: Samuel Eze</p>
        </div>
        <div className="flex gap-3">
          <Button variant="gold">
            <Activity size={18} /> Go Online
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-bordergray">
            {[
              { id: 'pending', label: 'Pickups', count: 5 },
              { id: 'active', label: 'Live Task', count: 1 },
              { id: 'history', label: 'History', count: 12 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 px-2 font-heading font-bold text-ui transition-all relative flex items-center gap-2",
                  activeTab === tab.id ? "text-primary" : "text-textgray hover:text-charcoal"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-offwhite text-textgray"
                )}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <motion.div layoutId="logistics-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'pending' && (
              <motion.div 
                key="pending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {[
                  { id: 'PKP-101', hub: 'Ikeja Central Hub', weight: '850kg', reward: '₦12,500', eta: '20m' },
                  { id: 'PKP-102', hub: 'Maryland Satellite', weight: '420kg', reward: '₦6,800', eta: '35m' },
                ].map((item) => (
                  <div key={item.id} className="p-6 bg-white border border-bordergray rounded-2xl flex items-center justify-between shadow-soft">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-mint flex items-center justify-center text-primary">
                        <Truck size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-charcoal text-body">{item.hub}</h4>
                          <span className="badge-warning">Priority</span>
                        </div>
                        <p className="text-small text-textgray font-medium">{item.weight} • PET & Aluminum</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-ui text-primary flex items-center gap-1 font-bold">
                            <Navigation size={12} /> {item.eta}
                          </span>
                          <span className="text-ui text-accent font-mono font-bold">{item.reward}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Accept</Button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-8 bg-charcoal rounded-3xl relative overflow-hidden border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="badge-success bg-primary text-white border-none">In Transit</span>
                      <h3 className="text-h2 text-white mt-2">Pick-up from Lekki Hub</h3>
                      <p className="text-white/40 text-small mt-1">Order #PKP-098 • ETA: 14:45</p>
                    </div>
                    <Button variant="ghost" className="h-10 w-10 p-0 text-white hover:bg-white/10"><MoreVertical size={20} /></Button>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/5" />
                    
                    <div className="flex items-start gap-6 relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Lekki Collection Point</p>
                        <p className="text-ui text-white/40 font-medium">Verified at 14:12 • 750kg PET</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 relative">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-charcoal z-10 shrink-0 animate-pulse">
                        <Navigation size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-white">In Transit to Factory</p>
                        <p className="text-ui text-accent font-bold uppercase">Ozumba Mbadiwe Way</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <Button variant="gold" className="flex-1">Status Update</Button>
                    <Button variant="outline" className="flex-1 text-white border-white/20 hover:bg-white/5">Issue Report</Button>
                  </div>
                  
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-h3">Live Tracker</h3>
            <div className="h-[400px] bg-charcoal rounded-3xl relative overflow-hidden border border-white/5">
              {/* Map Sim */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-white/5" />
              </div>

              {/* Vehicle Icon */}
              <motion.div 
                className="absolute z-20"
                animate={{ left: ["25%", "75%"], top: ["33%", "66%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-charcoal shadow-gold rotate-45">
                  <Truck size={20} className="-rotate-45" />
                </div>
              </motion.div>

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-ui text-white/40 font-bold uppercase">Speed</p>
                  <p className="text-h3 font-mono text-white">42 km/h</p>
                </div>
                <div className="text-right">
                  <p className="text-ui text-white/40 font-bold uppercase">Fuel</p>
                  <p className="text-h3 font-mono text-primary">78%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-bordergray rounded-2xl shadow-soft">
            <h3 className="text-h3 mb-4">Fleet Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Tires', status: 'Normal', color: 'text-primary' },
                { label: 'Engine', status: 'Optimal', color: 'text-primary' },
                { label: 'Service', status: '1,200km', color: 'text-accent' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-small">
                  <span className="text-textgray font-medium">{item.label}</span>
                  <span className={cn("font-bold", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default LogisticsDashboard;
