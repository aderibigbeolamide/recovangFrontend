import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Package, 
  Zap, 
  History,
  MapPin,
  Plus,
  Calculator,
  Award,
  Wallet as WalletIcon,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import NewSubmissionModal from '../../components/modals/NewSubmissionModal';
import { cn } from '../../lib/utils';
import { useAuth } from '../../store/auth.store';
import { useDashboard } from '../../hooks/useCollector';

const CollectorDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  const stats = dashboard || {
    wallet: { balance: 0, pending: 0 },
    stats: { totalWeight: 0, points: 0, streak: 0, rank: 0 },
    recentSubmissions: []
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 mb-2">Good morning, {user?.firstName}!</h1>
          <p className="text-textgray text-small">Ready to turn your waste into real cash today?</p>
        </div>
      </div>

      <NewSubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Top — Wallet Card (full width, green gradient) */}
      <GlassCard className="relative overflow-hidden group bg-gradient-to-br from-primary to-[#0D3D22] border-none p-10 lg:p-12 shadow-glow">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <WalletIcon size={200} className="text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-2">
            <p className="text-mint text-ui font-black uppercase tracking-[0.2em]">Your Balance</p>
            <h2 className="text-[56px] lg:text-[80px] leading-none font-mono font-black text-white tracking-tighter">
              ₦{stats.wallet.balance.toLocaleString()}<span className="text-accent">.00</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <Button variant="gold" size="lg" className="px-10 h-[64px] text-charcoal shadow-gold">
              <ArrowUpRight size={24} /> Withdraw
            </Button>
            <Button variant="outline" size="lg" className="px-10 h-[64px] border-white text-white hover:bg-white/10">
              <History size={24} /> History
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Main CTA (Yellow, full width, large) */}
      <Button 
        variant="gold" 
        className="w-full h-[80px] text-h2 text-charcoal shadow-gold rounded-[32px] group relative overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
        Submit Waste Today
        <div className="absolute right-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <Recycle size={48} />
        </div>
      </Button>

      {/* Quick Stats Row (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Weight', value: `${stats.stats.totalWeight} kg`, desc: 'All time', icon: <Package className="text-primary" /> },
          { label: 'Pending', value: `₦${stats.wallet.pending.toLocaleString()}`, desc: 'In verification', icon: <TrendingUp className="text-accent" /> },
          { label: 'City Rank', value: `#${stats.stats.rank || 'N/A'}`, desc: 'Lagos', icon: <Award className="text-blue-500" /> },
          { label: 'Streak', value: `${stats.stats.streak} Days`, desc: 'Keep it up!', icon: <Zap className="text-warning" /> },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 border-bordergray/50 hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-ui font-bold text-textgray uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-h2 text-charcoal font-black">{stat.value}</p>
            <p className="text-ui font-medium text-textgray">{stat.desc}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-h3">Recent Activity</h3>
            <button className="text-primary text-ui font-bold hover:underline">View All History</button>
          </div>
          <div className="space-y-3">
            {stats.recentSubmissions.map((sub: any) => (
              <div key={sub.id} className="p-5 bg-white border border-bordergray rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all shadow-soft group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {sub.category.includes('PET') ? <Recycle size={24} /> : <Package size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal">{sub.category}</h4>
                    <p className="text-ui text-textgray font-medium">{new Date(sub.createdAt).toLocaleDateString()} • <span className="font-mono font-bold">{sub.estimatedWeight}kg</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-h3 text-accent font-mono font-black">₦{sub.estimatedValue?.toLocaleString() || '0'}</p>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                    sub.status === 'verified' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {sub.status === 'verified' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentSubmissions.length === 0 && (
              <div className="p-10 text-center bg-offwhite rounded-3xl border border-dashed border-bordergray">
                <p className="text-textgray font-medium">No recent activity found. Start recycling today!</p>
              </div>
            )}
          </div>
        </div>

        {/* Nearby Hubs Widget */}
        <div className="space-y-6">
          <h3 className="text-h3">Nearby Hubs</h3>
          <div className="p-4 bg-white border border-bordergray rounded-[32px] shadow-soft space-y-6">
            {/* Small Map Preview Placeholder */}
            <div className="h-48 bg-mint rounded-[24px] relative overflow-hidden flex items-center justify-center">
              <MapPin size={48} className="text-primary/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white text-[10px] font-bold uppercase tracking-widest">Live Map View</p>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Ikeja Hub', distance: '1.2km', status: 'Open', capacity: 85 },
                { name: 'Maryland Point', distance: '2.8km', status: 'Open', capacity: 40 },
                { name: 'Oregun Express', distance: '4.5km', status: 'Closing Soon', capacity: 10 },
              ].map((hub, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-offwhite rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-offwhite flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal text-small">{hub.name}</p>
                      <p className="text-ui text-textgray font-medium">{hub.distance} • <span className={hub.status === 'Open' ? 'text-success' : 'text-warning'}>{hub.status}</span></p>
                    </div>
                  </div>
                  <div className="w-12 h-1.5 bg-offwhite rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full",
                      hub.capacity > 80 ? "bg-error" : hub.capacity > 50 ? "bg-warning" : "bg-primary"
                    )} style={{ width: `${hub.capacity}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-[56px] text-body">Open Hub Finder</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Recycle({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 11V7a5 5 0 0 1 8.8-3.08L20 8" /><path d="M17 13v4a5 5 0 0 1-8.8 3.08L4 16" /><path d="M15 17H9" /><path d="M9 7h6" /></svg>
  );
}

export default CollectorDashboard;
