import React from 'react';
import { 
  Leaf, 
  Download, 
  CreditCard, 
  TrendingUp,
  Award,
  Calendar,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const BrandDashboard: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Corporate Sustainability</h1>
          <p className="text-white/50">Coca-Cola Nigeria • EPR Compliance ID: NG-7721</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={18} /> Impact Report
          </Button>
          <Button variant="gold">
            <CreditCard size={18} /> Pay Compliance Fee
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-2 bg-gradient-forest border-none p-8 flex justify-between items-center overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-1 uppercase tracking-widest font-bold">2024 Compliance Status</p>
            <h3 className="text-5xl font-bold text-white mb-4">92%</h3>
            <p className="text-white/80 text-sm">You have offset 14.5 Tons of plastic waste this quarter.</p>
          </div>
          <div className="w-32 h-32 rounded-full border-8 border-white/20 border-t-white animate-[spin_3s_linear_infinite] flex items-center justify-center relative z-10">
            <Leaf size={48} className="text-white" />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <Award size={24} />
            </div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Eco Ranking</p>
          </div>
          <h3 className="text-3xl font-bold text-white">#12</h3>
          <p className="text-white/40 text-[10px] mt-2">Top 5% of compliant brands in Nigeria</p>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
              <TrendingUp size={24} />
            </div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Impact Score</p>
          </div>
          <h3 className="text-3xl font-bold text-white">840</h3>
          <p className="text-white/40 text-[10px] mt-2">+120 points from last month</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white">Compliance History</h3>
          <div className="space-y-3">
            {[
              { period: 'Q1 2024', target: '15.0T', offset: '14.5T', status: 'In Progress', cost: '₦1.2M' },
              { period: 'Q4 2023', target: '12.0T', offset: '12.2T', status: 'Compliant', cost: '₦950k' },
              { period: 'Q3 2023', target: '10.0T', offset: '10.5T', status: 'Compliant', cost: '₦820k' },
            ].map((item, i) => (
              <GlassCard key={i} className="p-5 hover:bg-white/10" animate={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-white/40 font-bold">{item.period}</p>
                      <Calendar size={18} className="text-white/20 mx-auto mt-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.offset} / {item.target} Offset</h4>
                      <div className="w-32 bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-forest h-full w-[92%]" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-white">{item.cost}</p>
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                      item.status === 'Compliant' ? "bg-forest/20 text-forest-light" : "bg-gold/20 text-gold"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Financial Summary</h3>
          <GlassCard className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/40 text-xs font-bold uppercase">Total EPR Fees Paid</p>
                  <p className="text-2xl font-bold font-mono text-white">₦4,850,200</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-forest/20 flex items-center justify-center text-forest">
                  <CreditCard size={20} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-white/40 font-bold uppercase">Recent Transactions</p>
                {[
                  { label: 'Q1 Compliance Fee', amount: '₦1,200,000', date: 'Apr 12' },
                  { label: 'Certificate Issuance', amount: '₦25,000', date: 'Mar 28' },
                ].map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl text-sm">
                    <div>
                      <p className="font-bold text-white">{t.label}</p>
                      <p className="text-[10px] text-white/40">{t.date}</p>
                    </div>
                    <p className="font-mono text-white">{t.amount}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Full Transaction History <ChevronRight size={16} />
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default BrandDashboard;
