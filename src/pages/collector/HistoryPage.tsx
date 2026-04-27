import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  MoreHorizontal,
  Recycle,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import GlassCard from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

const SUBMISSIONS = [
  { id: 'SUB-9921', category: 'PET Plastic', weight: '12.5kg', value: '₦1,500', date: '24 Oct 2024', time: '14:20', status: 'verified', hub: 'Maryland Hub' },
  { id: 'SUB-9890', category: 'Aluminum Cans', weight: '5.2kg', value: '₦2,340', date: '21 Oct 2024', time: '10:15', status: 'pending', hub: 'Ikeja Hub' },
  { id: 'SUB-9875', category: 'PET Plastic', weight: '45.0kg', value: '₦5,400', date: '18 Oct 2024', time: '09:00', status: 'verified', hub: 'Maryland Hub' },
  { id: 'SUB-9842', category: 'Glass Bottles', weight: '8.0kg', value: '₦160', date: '15 Oct 2024', time: '16:45', status: 'rejected', hub: 'Ikeja Hub' },
  { id: 'SUB-9810', category: 'Aluminum Cans', weight: '2.1kg', value: '₦945', date: '12 Oct 2024', time: '11:30', status: 'verified', hub: 'Lekki Hub' },
];

const HistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-h1">Submission History</h1>
          <p className="text-textgray text-small">Track every gram you've recycled and its impact.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-bordergray">
            {['all', 'verified', 'pending'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-ui font-bold uppercase tracking-widest transition-all",
                  filter === f ? "bg-primary text-white" : "text-textgray hover:text-charcoal"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline"><Calendar size={18} /> Date Range</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <TextField 
              placeholder="Search by ID, Category or Hub..." 
              icon={<Search size={20} />} 
              className="pl-12 h-[56px]"
            />
          </div>

          <div className="bg-white border border-bordergray rounded-[32px] overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-offwhite border-b border-bordergray">
                    <th className="p-6 text-ui font-black text-textgray uppercase tracking-widest">Submission ID</th>
                    <th className="p-6 text-ui font-black text-textgray uppercase tracking-widest">Material</th>
                    <th className="p-6 text-ui font-black text-textgray uppercase tracking-widest">Weight / Value</th>
                    <th className="p-6 text-ui font-black text-textgray uppercase tracking-widest">Date & Hub</th>
                    <th className="p-6 text-ui font-black text-textgray uppercase tracking-widest">Status</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bordergray">
                  {SUBMISSIONS.map((sub) => (
                    <tr key={sub.id} className="hover:bg-mint/30 transition-colors group">
                      <td className="p-6">
                        <p className="font-mono font-bold text-charcoal">{sub.id}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center text-xl">
                            {sub.category === 'PET Plastic' ? '🥤' : sub.category === 'Aluminum Cans' ? '🥫' : '🍾'}
                          </div>
                          <span className="font-bold text-charcoal">{sub.category}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-mono font-black text-charcoal">{sub.weight}</p>
                          <p className="text-ui font-bold text-primary">{sub.value}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="text-small font-bold text-charcoal">{sub.date}</p>
                          <p className="text-[10px] text-textgray uppercase font-bold tracking-widest">{sub.hub}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                          sub.status === 'verified' ? "bg-success/10 text-success" : 
                          sub.status === 'pending' ? "bg-warning/10 text-warning" : 
                          "bg-error/10 text-error"
                        )}>
                          {sub.status === 'verified' ? <CheckCircle2 size={12} /> : 
                           sub.status === 'pending' ? <Clock size={12} /> : 
                           <AlertCircle size={12} />}
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 text-textgray hover:text-charcoal transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-offwhite border-t border-bordergray text-center">
              <button className="text-small font-bold text-primary hover:underline">Show 25 More Submissions</button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <GlassCard className="p-6 bg-charcoal text-white overflow-hidden relative">
            <div className="relative z-10 space-y-6">
              <h3 className="text-h3 font-bold">Monthly Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-ui font-bold uppercase">Total Weight</span>
                  <span className="font-mono font-bold">156.4 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-ui font-bold uppercase">Est. Value</span>
                  <span className="font-mono font-bold text-accent">₦18,200</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '65%' }} />
                </div>
                <p className="text-[10px] text-white/30 text-center font-bold">65% of last month's collection</p>
              </div>
            </div>
            <Recycle size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
          </GlassCard>

          <div className="p-8 bg-mint rounded-[32px] border border-primary/10 space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-soft">
              <Scale size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-h3 text-charcoal">Accuracy First</h4>
              <p className="text-ui text-textgray leading-relaxed">
                All weights are verified at verified Recovang hubs using digital scales. Disputes? Contact support.
              </p>
            </div>
            <Button variant="outline" className="w-full border-primary/20 text-primary">Dispute Transaction</Button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HistoryPage;
