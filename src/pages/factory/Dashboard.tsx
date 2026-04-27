import React, { useState } from 'react';
import { 
  Factory, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  BarChart3, 
  History,
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowDownToLine
} from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const FactoryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 mb-2">Supply Chain</h1>
          <p className="text-textgray text-small">Recovang Processing Factory • Apapa Industrial</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><BarChart3 size={18} /> Analytics</Button>
          <Button variant="gold" onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={18} /> Place Order
          </Button>
        </div>
      </div>

      <div className="flex gap-6 border-b border-bordergray">
        {[
          { id: 'inventory', label: 'Waste Inventory', icon: <Package size={18} /> },
          { id: 'orders', label: 'Purchase Orders', icon: <ClipboardList size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "pb-4 px-2 font-heading font-bold text-ui transition-all relative flex items-center gap-2",
              activeTab === tab.id ? "text-primary" : "text-textgray hover:text-charcoal"
            )}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="factory-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'PET Plastics', stock: '12.4T', color: 'bg-primary', icon: '🥤' },
              { label: 'Aluminum', stock: '4.2T', color: 'bg-accent', icon: '🥫' },
              { label: 'Cardboard', stock: '28.1T', color: 'bg-blue-500', icon: '📦' },
              { label: 'Glass', stock: '2.5T', color: 'bg-error', icon: '🍾' },
            ].map((cat, i) => (
              <div key={i} className="p-6 bg-white border border-bordergray rounded-2xl shadow-soft hover:shadow-card transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                </div>
                <p className="text-textgray text-ui font-bold uppercase mb-1">{cat.label}</p>
                <h3 className="text-h2 font-mono text-charcoal">{cat.stock}</h3>
                <div className="mt-4 pt-4 border-t border-bordergray flex justify-between items-center">
                  <span className="text-ui text-primary font-bold">In Stock</span>
                  <button className="text-textgray hover:text-accent transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-h3">Inflow Feed</h3>
              <div className="space-y-3">
                {[
                  { id: 'SUP-442', hub: 'Ikeja Central', cat: 'PET Plastic', weight: '850kg', time: '14:20', status: 'Inbound' },
                  { id: 'SUP-441', hub: 'Lekki Hub', cat: 'Cardboard', weight: '1.2T', time: '12:45', status: 'Arrived' },
                ].map((sup) => (
                  <div key={sup.id} className="p-4 bg-white border border-bordergray rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all shadow-soft">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        sup.status === 'Arrived' ? "bg-mint text-primary" : "bg-accent/10 text-accent"
                      )}>
                        <ArrowDownToLine size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal text-small">{sup.hub}</h4>
                        <p className="text-ui text-textgray font-medium">{sup.cat} • {sup.weight}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-small font-bold text-charcoal">{sup.time}</p>
                      <span className={sup.status === 'Arrived' ? "badge-success" : "badge-warning"}>
                        {sup.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3">Stock Split</h3>
              <div className="p-8 bg-white border border-bordergray rounded-2xl shadow-soft aspect-square flex flex-col items-center justify-center relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#DDE3E9" strokeWidth="20" fill="transparent" />
                  <circle cx="96" cy="96" r="80" stroke="#1A6B3C" strokeWidth="20" fill="transparent" strokeDasharray="502" strokeDashoffset="150" />
                  <circle cx="96" cy="96" r="80" stroke="#D4A017" strokeWidth="20" fill="transparent" strokeDasharray="502" strokeDashoffset="400" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <p className="text-h2 font-mono text-charcoal">47.2T</p>
                  <p className="text-ui text-textgray font-bold uppercase">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 bg-white border border-bordergray rounded-3xl shadow-soft space-y-6">
              <h3 className="text-h2">Active Orders</h3>
              <div className="space-y-4">
                {[
                  { id: 'ORD-772', hub: 'Ikeja Hub', item: 'PET Plastic', qty: '5T', status: 'Processing' },
                  { id: 'ORD-770', hub: 'Yaba Tech', item: 'Aluminum', qty: '200kg', status: 'Completed' },
                ].map((order) => (
                  <div key={order.id} className="p-5 bg-offwhite border border-bordergray rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-ui font-mono text-accent font-bold">{order.id}</span>
                        <h4 className="font-bold text-charcoal">{order.hub}</h4>
                      </div>
                      <p className="text-small text-textgray mt-1">{order.item} • {order.qty}</p>
                    </div>
                    <span className={order.status === 'Completed' ? "badge-success" : "badge-warning"}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">Download History</Button>
            </div>

            <div className="p-8 bg-white border-2 border-accent/20 rounded-3xl shadow-soft space-y-6">
              <h3 className="text-h2">Quick Order</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-ui text-textgray font-bold uppercase ml-1">Supplier Hub</label>
                  <select className="w-full bg-offwhite border border-bordergray rounded-xl px-4 py-3 text-small outline-none focus:border-accent">
                    <option>Lekki Hub (PremiumPET)</option>
                    <option>Ikeja Central (Mixed)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Plastics', 'Metals', 'Paper', 'Glass'].map(cat => (
                    <button key={cat} className="py-3 bg-offwhite border border-bordergray rounded-xl font-bold text-ui text-textgray hover:border-accent hover:text-accent transition-all">
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-ui text-textgray font-bold uppercase ml-1">Quantity (Tons)</label>
                  <input type="number" step="0.1" placeholder="e.g. 5.0" className="w-full bg-offwhite border border-bordergray rounded-xl px-4 py-3 text-small outline-none focus:border-accent" />
                </div>
                <Button variant="gold" className="w-full py-4 text-body">Place Purchase Order</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default FactoryDashboard;
