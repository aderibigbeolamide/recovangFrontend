import { useState } from "react";
import { Coins, CheckCircle2, History } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { useAdminPricing } from "@/hooks/useAdmin";

const CATEGORIES = [
  { id: "PET", name: "PET Plastic", currentPrice: 200 },
  { id: "ALUMINUM", name: "Aluminum Cans", currentPrice: 150 },
  { id: "HDPE", name: "HDPE Plastic", currentPrice: 180 },
  { id: "CARDBOARD", name: "Cardboard/Paper", currentPrice: 50 },
];

export default function AdminPricing() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [newPrice, setNewPrice] = useState<number | "">("");
  const { mutate: updatePricing, isPending } = useAdminPricing();

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

  const activeCat = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <>
      <PageHeader
        eyebrow="Financial control"
        title="Pricing Console"
        subtitle="Manage global material pricing per kilogram. Changes will immediately reflect for all future collector drops."
      />

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Coins size={18} className="text-primary" /> Update Material Pricing
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">Select Material Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedCategory === cat.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-bordergray hover:border-textgray/30"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{cat.name}</div>
                      <div className="text-xl font-black mt-1">₦{cat.currentPrice}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2">New Price per KG (₦)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input w-full"
                    placeholder={`Current: ₦${activeCat?.currentPrice}`}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Effective Date</label>
                  <input
                    type="text"
                    disabled
                    className="input w-full bg-cream/50 text-textgray"
                    value="Immediately"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-bordergray flex justify-end gap-3">
                <button type="button" className="btn-ghost" onClick={() => setNewPrice("")}>Reset</button>
                <button type="submit" className="btn-primary" disabled={!newPrice || isPending}>
                  {isPending ? "Updating..." : "Publish New Price"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <History size={16} /> Recent Changes
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <div className="text-sm font-bold">PET Plastic updated to ₦200</div>
                  <div className="text-xs text-textgray">By Olamide · 2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <div className="text-sm font-bold">Aluminum updated to ₦150</div>
                  <div className="text-xs text-textgray">By Olamide · 2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
