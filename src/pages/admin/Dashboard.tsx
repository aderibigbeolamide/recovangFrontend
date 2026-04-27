import React from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight,
  TrendingDown,
  Globe,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useAdminDashboard, useWasteByCategory, useRevenueAnalytics } from '../../hooks/useAdmin';

const DATA_CHART = [
  { name: '01 Oct', submissions: 400, revenue: 2400 },
  { name: '05 Oct', submissions: 600, revenue: 3800 },
  { name: '10 Oct', submissions: 800, revenue: 4200 },
  { name: '15 Oct', submissions: 700, revenue: 3900 },
  { name: '20 Oct', submissions: 1100, revenue: 5600 },
  { name: '25 Oct', submissions: 1400, revenue: 8400 },
];

const CATEGORY_DATA = [
  { name: 'PET', value: 4500, color: '#1A6B3C' },
  { name: 'Aluminum', value: 3200, color: '#D4A017' },
  { name: 'Glass', value: 1200, color: '#3b82f6' },
];

const WITHDRAWAL_DATA = [
  { name: 'Bank Transfer', value: 65, color: '#1A6B3C' },
  { name: 'Airtime', value: 25, color: '#D4A017' },
  { name: 'Bills', value: 10, color: '#3b82f6' },
];

const AdminDashboard: React.FC = () => {
  const { data: dashboard, isLoading } = useAdminDashboard();
  const { data: catData } = useWasteByCategory();
  const { data: revData } = useRevenueAnalytics();

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>;

  const stats = {
    totalCollectors: dashboard?.ecosystem?.totalCollectors ?? 0,
    totalAgents: dashboard?.ecosystem?.totalAgents ?? 0,
    totalWasteKg: dashboard?.impact?.totalWasteCollectedKg ?? 0,
    totalPayouts: dashboard?.impact?.totalPayoutsNGN ?? 0,
    totalHubs: dashboard?.ecosystem?.totalHubs ?? 0,
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-h1 mb-2">Platform Overview</h1>
          <p className="text-textgray text-small">Real-time performance metrics and ecosystem health.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12"><Download size={18} /> Export</Button>
          <Button variant="primary" className="h-12 shadow-glow"><Filter size={18} /> Filters</Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Collectors', 
            value: stats.totalCollectors.toLocaleString(), 
            change: '+12%', 
            up: true, 
            icon: <Users className="text-primary" /> 
          },
          { 
            label: 'Total Waste (kg)', 
            value: stats.totalWasteKg.toLocaleString(), 
            change: '+8.4%', 
            up: true, 
            icon: <Package className="text-accent" /> 
          },
          { 
            label: 'Total Payouts', 
            value: `₦${(stats.totalPayouts / 1000).toFixed(1)}k`, 
            change: '+15.2%', 
            up: true, 
            icon: <TrendingUp className="text-success" /> 
          },
          { 
            label: 'Active Hubs', 
            value: stats.totalHubs.toString(), 
            change: '100% Active', 
            up: true, 
            icon: <Globe className="text-blue-500" /> 
          },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 border-white/40 shadow-soft hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-offwhite flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={cn(
                "text-ui font-black px-3 py-1 rounded-full flex items-center gap-1",
                stat.up ? "bg-success/10 text-success" : "bg-error/10 text-error"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-textgray font-black uppercase tracking-[0.1em] mb-1">{stat.label}</p>
              <p className="text-h1 text-charcoal font-black">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-h3">Submission Volume</h3>
                <p className="text-small text-textgray">Daily verified waste drop-offs</p>
              </div>
              <select className="bg-offwhite border border-bordergray rounded-xl px-4 py-2 text-ui font-bold outline-none focus:border-primary transition-all">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DATA_CHART} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1C1C2E', border: 'none', borderRadius: '20px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    itemStyle={{ color: '#D4A017' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#1A6B3C" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#1A6B3C', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 10, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <h3 className="text-h3 mb-2">Revenue by Material</h3>
              <p className="text-small text-textgray mb-8">Performance per waste category</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_DATA}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} dy={5} />
                    <Tooltip cursor={{ fill: '#f8fafc', radius: 10 }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-h3 mb-2">Payout Methods</h3>
              <p className="text-small text-textgray mb-8">Collector withdrawal preferences</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={WITHDRAWAL_DATA}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {WITHDRAWAL_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-h3 flex items-center gap-3">
                Live Feed <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
              </h3>
              <p className="text-small text-textgray">Real-time platform activity</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
            {[
              { type: 'payment', title: '₦42,000 Payout', desc: 'Samuel Musa (Access Bank)', time: 'Just now' },
              { type: 'submission', title: 'New: 42kg PET', desc: 'Ikeja Hub by Ahmed M.', time: '2m ago' },
              { type: 'fraud', title: 'Variance Alert', desc: 'Hub #12: 10% discrepancy', time: '5m ago' },
              { type: 'signup', title: 'New Collector', desc: 'Maryland, Lagos', time: '12m ago' },
              { type: 'payment', title: '₦1,500 Airtime', desc: 'MTN - 08012345678', time: '20m ago' },
            ].map((feed, i) => (
              <div key={i} className="p-6 bg-white border border-bordergray rounded-[32px] shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                    feed.type === 'payment' ? "bg-success/10 text-success" :
                    feed.type === 'submission' ? "bg-accent/10 text-accent" :
                    feed.type === 'fraud' ? "bg-error/10 text-error" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {feed.type === 'payment' ? <CreditCard size={20} /> :
                     feed.type === 'submission' ? <Package size={20} /> :
                     feed.type === 'fraud' ? <AlertTriangle size={20} /> : <Users size={20} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-charcoal leading-tight text-body group-hover:text-primary transition-colors">{feed.title}</p>
                    <p className="text-ui text-textgray font-medium">{feed.desc}</p>
                    <p className="text-[10px] text-textgray/40 font-black uppercase tracking-widest pt-2">{feed.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full h-14 rounded-2xl font-bold">View System Logs</Button>
        </div>
      </div>

      <GlassCard className="p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h3">National Submission Heatmap</h3>
            <p className="text-small text-textgray">Activity density across Nigeria</p>
          </div>
          <div className="px-5 py-2 bg-mint/50 rounded-full border border-primary/10">
            <span className="text-ui font-black text-primary">Top Region: Lagos Central</span>
          </div>
        </div>
        <div className="bg-mint/10 rounded-[48px] p-16 aspect-video flex items-center justify-center border border-primary/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="text-center space-y-6 relative z-10">
            <Globe size={140} className="text-primary/10 mx-auto animate-spin-slow" />
            <div className="space-y-2">
              <p className="text-h3 text-primary/60 font-black uppercase tracking-widest">Interactive GIS Map</p>
              <p className="text-small text-textgray/60 max-w-xs mx-auto">Click any state to drill down into hub performance and material flow.</p>
            </div>
            <Button variant="primary" className="h-14 px-10">Launch Map View</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
