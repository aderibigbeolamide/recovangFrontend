import { useState, useEffect } from "react";
import { Coins, CheckCircle2, History, Plus, X, Zap, TrendingUp } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { useAdminPricing, usePricing, useCreateCategory, usePricingHistory, useToggleSurge } from "@/hooks/useAdmin";
import { formatNaira } from "@/lib/cn";

export default function AdminPricing() {
  const { data: categories = [], isLoading } = usePricing();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [isAdding, setIsAdding] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", description: "", initialPrice: "" });
  
  const { data: history = [] } = usePricingHistory();
  const { mutate: updatePricing, isPending } = useAdminPricing();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: toggleSurge, isPending: isSurging } = useToggleSurge();

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id || categories[0].slug);
    }
  }, [categories]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) return;
    
    updatePricing({
      categoryId: selectedCategory,
      pricePerKg: Number(newPrice),
      effectiveDate: new Date().toISOString()
    }, {
      onSuccess: () => {
        setNewPrice("");
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({
      ...catForm,
      initialPrice: Number(catForm.initialPrice)
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setCatForm({ name: "", slug: "", description: "", initialPrice: "" });
      }
    });
  };

  const activeCat = categories.find((c: any) => (c.id === selectedCategory || c.slug === selectedCategory));

  const handleToggleSurge = () => {
    if (!activeCat) return;
    toggleSurge({
      id: activeCat.id,
      isActive: !activeCat.isSurgeActive,
      multiplier: activeCat.isSurgeActive ? 1.0 : 1.5 // Default 1.5x for surge
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Financial control"
        title="Material Pricing & Surge"
        subtitle="Manage global material rates and supply-demand multipliers to optimize collection volume."
        actions={
          <button className="btn-primary gap-2" onClick={() => setIsAdding(true)}>
            <Plus size={14} /> New Material
          </button>
        }
      />

      {isAdding && (
        <div className="card border-primary/20 bg-primary/5 p-6 mb-6 relative animate-in zoom-in-95 duration-300">
          <button onClick={() => setIsAdding(false)} className="absolute right-4 top-4 text-textgray hover:text-charcoal"><X size={18} /></button>
          <h3 className="font-black text-lg mb-6 uppercase tracking-tight">Register New Waste Category</h3>
          <form onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-textgray">Category Name</label>
              <input 
                className="inp w-full" 
                placeholder="e.g. Glass" 
                required 
                value={catForm.name}
                onChange={e => setCatForm({...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-textgray">Slug</label>
              <input className="inp w-full bg-cream/50 cursor-not-allowed" placeholder="glass" disabled value={catForm.slug} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-textgray">Initial Price (₦)</label>
              <input 
                type="number" 
                className="inp w-full" 
                placeholder="100" 
                required
                value={catForm.initialPrice}
                onChange={e => setCatForm({...catForm, initialPrice: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full h-11 font-black uppercase tracking-widest text-xs" disabled={isCreating}>{isCreating ? "Saving..." : "Create Material"}</button>
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-textgray">Description</label>
              <input 
                className="inp w-full" 
                placeholder="Brief description of the material quality standards"
                value={catForm.description}
                onChange={e => setCatForm({...catForm, description: e.target.value})}
              />
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border-2 border-primary/5 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl flex items-center gap-2 uppercase tracking-tight">
                <Coins size={22} className="text-primary" /> Pricing Control
              </h3>
              {activeCat && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all ${activeCat.isSurgeActive ? 'bg-gold/10 border-gold text-gold' : 'bg-charcoal/5 border-bordergray text-textgray'}`}>
                  <Zap size={16} className={activeCat.isSurgeActive ? 'fill-gold' : ''} />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-tighter">Surge Pricing</span>
                    <span className="text-xs font-bold leading-none">{activeCat.isSurgeActive ? `Active (${activeCat.surgeMultiplier}x)` : 'Inactive'}</span>
                  </div>
                  <button 
                    onClick={handleToggleSurge}
                    disabled={isSurging}
                    className={`ml-2 h-5 w-10 rounded-full relative transition-all ${activeCat.isSurgeActive ? 'bg-gold' : 'bg-textgray/30'}`}
                  >
                    <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${activeCat.isSurgeActive ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              )}
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-textgray mb-4">Material Category Selection</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {isLoading ? (
                    <div className="col-span-4 py-12 text-center text-textgray animate-pulse font-black uppercase tracking-widest text-xs">Accessing Pricing Server...</div>
                  ) : categories.length === 0 ? (
                    <div className="col-span-4 py-12 text-center text-textgray border-2 border-dashed border-bordergray rounded-3xl bg-cream/10">
                      No materials found.
                    </div>
                  ) : categories.map((cat: any) => (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id || cat.slug)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                        selectedCategory === (cat.id || cat.slug)
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                          : "border-bordergray hover:border-primary/30 bg-white"
                      }`}
                    >
                      {cat.isSurgeActive && <div className="absolute top-0 right-0 p-1 bg-gold text-white rounded-bl-lg"><Zap size={10} className="fill-white" /></div>}
                      <div className="text-[10px] font-black uppercase tracking-tighter text-textgray group-hover:text-primary transition-colors">{cat.name}</div>
                      <div className="text-2xl font-black mt-1 text-charcoal">{formatNaira(cat.currentPrice || 0)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 p-6 bg-cream/20 rounded-3xl border border-bordergray/50">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-textgray">New Base Rate (₦/KG)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-charcoal">₦</span>
                    <input
                      type="number"
                      required
                      min="1"
                      className="inp pl-8 w-full h-12 text-lg font-black"
                      placeholder={`${activeCat?.currentPrice || 0}`}
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-textgray px-1 uppercase tracking-tighter">Collectors will receive this base rate + any active surge.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-textgray">Effective Timeline</label>
                  <div className="inp w-full h-12 flex items-center bg-white/50 border-dashed text-sm font-bold text-success gap-2">
                    <CheckCircle2 size={16} /> Instant Global Deployment
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" className="btn-outline px-8" onClick={() => setNewPrice("")}>Clear</button>
                <button type="submit" className="btn-primary px-12 h-12 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20" disabled={!newPrice || isPending}>
                  {isPending ? "Syncing..." : "Update Base Rate"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border-2 border-charcoal/5 shadow-lg">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
              <History size={18} className="text-textgray" /> Pricing History
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-xs text-textgray text-center py-12 font-bold uppercase tracking-widest opacity-30">No transaction logs</div>
              ) : history.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl border border-bordergray hover:bg-cream/10 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <TrendingUp size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-black text-charcoal">{item.category?.name || "Global Update"}</div>
                      <div className="text-sm font-black text-primary">{formatNaira((item.collectorPayoutRate || 0) / 100)}</div>
                    </div>
                    <div className="text-[10px] font-bold text-textgray mt-1 uppercase tracking-tighter">
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card p-6 bg-charcoal text-cream border-0 shadow-2xl shadow-charcoal/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-gold grid place-items-center"><Zap size={20} className="text-charcoal fill-charcoal" /></div>
              <h4 className="font-black text-sm uppercase tracking-widest">Surge Strategy</h4>
            </div>
            <p className="text-xs text-cream/70 leading-relaxed font-medium">
              Activate Surge Pricing during high-demand holidays or material shortages. Multipliers typically range from 1.1x to 1.5x.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
