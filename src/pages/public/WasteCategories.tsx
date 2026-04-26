import { Recycle, TrendingUp } from "lucide-react";

const CATS = [
  { name: "PET Plastic Bottles", price: 200, examples: "Water, soda, juice bottles", demand: "Very high" },
  { name: "HDPE Plastic", price: 180, examples: "Detergent, milk, bleach jugs", demand: "High" },
  { name: "Aluminium Cans", price: 600, examples: "Soft drink, beer cans", demand: "Very high" },
  { name: "Tin / Steel Cans", price: 120, examples: "Food cans, evaporated milk tins", demand: "Medium" },
  { name: "Cardboard", price: 60, examples: "Boxes, packaging, cartons", demand: "High" },
  { name: "Mixed Paper", price: 50, examples: "Newspapers, magazines, office paper", demand: "Medium" },
  { name: "Glass Bottles", price: 40, examples: "Beer, wine, spirit bottles", demand: "Medium" },
  { name: "E-Waste — Small", price: 1200, examples: "Phones, chargers, cables, earphones", demand: "Very high" },
  { name: "E-Waste — Large", price: 800, examples: "Laptops, monitors, printers", demand: "High" },
  { name: "Used Cooking Oil", price: 300, examples: "Filtered restaurant or home oil", demand: "Medium" },
  { name: "Textile Scrap", price: 80, examples: "Clean clothing, fabric offcuts", demand: "Low" },
  { name: "Lead Batteries", price: 1500, examples: "Inverter, car batteries", demand: "Very high" },
];

export default function WasteCategories() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge bg-mint text-primary">Pricing</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          What we pay, by the kilo.
        </h1>
        <p className="mt-4 text-textgray">
          Prices are updated weekly based on factory demand. Submit verified, clean material to maximize your payout.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((c) => (
          <div key={c.name} className="card transition-shadow hover:shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-primary">
                <Recycle size={18} />
              </div>
              <span className="badge bg-accent/10 text-accent-500">
                <TrendingUp size={12} /> {c.demand}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold">{c.name}</h3>
            <p className="mt-1 text-sm text-textgray">{c.examples}</p>
            <div className="mt-4 flex items-end justify-between border-t border-bordergray pt-3">
              <span className="text-xs uppercase tracking-wider text-textgray">Pays you</span>
              <span className="font-mono text-2xl font-extrabold text-charcoal">
                ₦{c.price.toLocaleString()}
                <span className="text-sm font-normal text-textgray">/kg</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
