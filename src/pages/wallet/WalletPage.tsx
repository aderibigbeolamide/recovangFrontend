import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Filter, 
  Search,
  Building2,
  Phone,
  Lightbulb,
  MoreVertical,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import WithdrawalModal from '../../components/modals/WithdrawalModal';

const WalletPage: React.FC = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 mb-2">My Wallet</h1>
          <p className="text-textgray text-small">Manage your earnings and payouts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download size={18} /> Statement</Button>
          <Button variant="primary" onClick={() => setIsWithdrawModalOpen(true)}>
            <ArrowUpRight size={18} /> Withdraw Funds
          </Button>
        </div>
      </div>

      <WithdrawalModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
        balance={128450} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance & Summary */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="bg-charcoal border-none p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <WalletIcon size={160} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <span className="text-ui font-bold uppercase tracking-widest">Available Balance</span>
              </div>
              <h2 className="text-display text-accent mb-10">₦128,450.00</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-ui text-white/40 font-bold uppercase">Life Time Earnings</p>
                  <p className="text-h3 text-white font-mono">₦1,420,500.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-ui text-white/40 font-bold uppercase">Pending Verification</p>
                  <p className="text-h3 text-warning font-mono">₦12,200.00</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'This Month', value: '₦42,000', icon: <TrendingUp className="text-primary" /> },
              { label: 'Total Withdrawals', value: '₦1.2M', icon: <ArrowUpRight className="text-error" /> },
              { label: 'Referral Bonus', value: '₦5,400', icon: <Plus className="text-accent" /> },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-ui text-textgray font-bold uppercase mb-1">{stat.label}</p>
                <p className="text-h3 text-charcoal">{stat.value}</p>
              </GlassCard>
            ))}
          </div>

          {/* Transaction History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-h3">Transaction History</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-ui"><Filter size={14} /> Filter</Button>
                <Button variant="ghost" size="sm" className="text-ui"><Search size={14} /> Search</Button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { type: 'withdrawal', title: 'Bank Transfer to Access Bank', amount: '-₦12,000', date: 'Oct 24, 14:20', status: 'success' },
                { type: 'deposit', title: 'Waste Submission #9921', amount: '+₦4,500', date: 'Oct 23, 09:12', status: 'success' },
                { type: 'airtime', title: 'MTN Airtime Recharge', amount: '-₦1,000', date: 'Oct 22, 18:45', status: 'success' },
                { type: 'deposit', title: 'Waste Submission #9890', amount: '+₦2,800', date: 'Oct 21, 12:30', status: 'pending' },
              ].map((tx, i) => (
                <div key={i} className="p-5 bg-white border border-bordergray rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all shadow-soft group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      tx.type === 'deposit' ? "bg-mint text-primary group-hover:bg-primary group-hover:text-white" : 
                      tx.type === 'withdrawal' ? "bg-error/10 text-error group-hover:bg-error group-hover:text-white" : 
                      "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-charcoal"
                    )}>
                      {tx.type === 'deposit' ? <ArrowDownLeft size={24} /> : 
                       tx.type === 'withdrawal' ? <Building2 size={24} /> : 
                       <Phone size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal">{tx.title}</h4>
                      <p className="text-ui text-textgray font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-h3 font-mono",
                      tx.amount.startsWith('+') ? "text-primary" : "text-charcoal"
                    )}>{tx.amount}</p>
                    <span className={tx.status === 'success' ? "badge-success" : "badge-warning"}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Load More Transactions</Button>
          </div>
        </div>

        {/* Right Column: Linked Accounts & Quick Actions */}
        <div className="space-y-8">
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-h3">Linked Accounts</h3>
              <button className="text-primary text-ui font-bold hover:underline">Add New</button>
            </div>
            <div className="space-y-4">
              {[
                { bank: 'Access Bank', acc: '012***789', name: 'S. Musa' },
                { bank: 'GTBank', acc: '003***442', name: 'S. Musa' },
              ].map((bank, i) => (
                <div key={i} className="p-4 bg-offwhite border border-bordergray rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-small font-bold text-charcoal">{bank.bank}</p>
                      <p className="text-ui text-textgray font-mono">{bank.acc}</p>
                    </div>
                  </div>
                  <button className="text-textgray hover:text-charcoal"><MoreVertical size={16} /></button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4 border-primary/20">
            <h3 className="text-h3">Quick Recharge</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-mint/50 border border-primary/10 rounded-2xl hover:border-primary transition-all">
                <Phone size={24} className="text-primary" />
                <span className="text-ui font-bold uppercase">Airtime</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/10 rounded-2xl hover:border-blue-500 transition-all">
                <Lightbulb size={24} className="text-blue-500" />
                <span className="text-ui font-bold uppercase">Electricity</span>
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-gradient-gold border-none text-charcoal">
            <h3 className="text-h2 mb-2">Refer & Earn</h3>
            <p className="text-charcoal/70 text-small mb-6">Earn ₦500 for every collector you refer to Recovang.</p>
            <div className="p-3 bg-white/20 rounded-xl border border-white/30 flex items-center justify-between mb-4">
              <span className="font-mono font-bold">RECO-SAM-442</span>
              <button className="text-ui font-bold underline">Copy</button>
            </div>
            <Button variant="primary" className="w-full bg-charcoal text-white border-none shadow-none">Share Link</Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default WalletPage;
