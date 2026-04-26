import { useState } from "react";
import { Camera, Plus, Recycle, Save, Trash2 } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const CATEGORIES = [
  { id: "pet", name: "PET Plastic", price: 200 },
  { id: "hdpe", name: "HDPE Plastic", price: 180 },
  { id: "alu", name: "Aluminium Cans", price: 600 },
  { id: "tin", name: "Tin / Steel Cans", price: 120 },
  { id: "card", name: "Cardboard", price: 60 },
  { id: "paper", name: "Mixed Paper", price: 50 },
  { id: "glass", name: "Glass Bottles", price: 40 },
  { id: "ewaste", name: "E-Waste — Small", price: 1200 },
];

interface Line {
  id: string;
  category: string;
  weight: number;
}

export default function CollectorSubmit() {
  const [lines, setLines] = useState<Line[]>([
    { id: "1", category: "pet", weight: 4.2 },
  ]);
  const [hub, setHub] = useState("surulere");

  const total = lines.reduce((sum, l) => {
    const c = CATEGORIES.find((cat) => cat.id === l.category);
    return sum + (c ? c.price * l.weight : 0);
  }, 0);

  return (
    <>
      <PageHeader
        title="Submit waste"
        subtitle="Add each material category, then drop your load at the chosen hub. The agent will weigh and verify before payout."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="1. Choose a hub">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { id: "surulere", name: "Surulere Hub", dist: "1.2 km", cap: "68%" },
                { id: "yaba", name: "Yaba Recovery Centre", dist: "3.7 km", cap: "45%" },
                { id: "lekki", name: "Lekki Phase 1", dist: "8.4 km", cap: "82%" },
                { id: "ikorodu", name: "Ikorodu Garage", dist: "12.1 km", cap: "30%" },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHub(h.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    hub === h.id
                      ? "border-primary bg-mint"
                      : "border-bordergray hover:border-primary/40"
                  }`}
                >
                  <div className="font-display font-bold">{h.name}</div>
                  <div className="text-xs text-textgray">{h.dist} away · {h.cap} full</div>
                </button>
              ))}
            </div>
          </Section>

          <Section
            title="2. Material categories"
            description="Add a line for each material you'll be dropping."
            action={
              <button
                onClick={() =>
                  setLines((l) => [...l, { id: String(Date.now()), category: "pet", weight: 0 }])
                }
                className="btn-outline"
              >
                <Plus size={14} /> Add category
              </button>
            }
          >
            <div className="space-y-3">
              {lines.map((line) => {
                const c = CATEGORIES.find((cat) => cat.id === line.category)!;
                return (
                  <div
                    key={line.id}
                    className="grid gap-3 rounded-xl border border-bordergray p-3 sm:grid-cols-[1fr_140px_120px_40px] sm:items-end"
                  >
                    <div>
                      <label className="label">Material</label>
                      <select
                        className="input"
                        value={line.category}
                        onChange={(e) =>
                          setLines((arr) =>
                            arr.map((l) => (l.id === line.id ? { ...l, category: e.target.value } : l))
                          )
                        }
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} — ₦{cat.price}/kg
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Weight (kg)</label>
                      <input
                        className="input font-mono"
                        type="number"
                        step="0.1"
                        value={line.weight}
                        onChange={(e) =>
                          setLines((arr) =>
                            arr.map((l) => (l.id === line.id ? { ...l, weight: parseFloat(e.target.value) || 0 } : l))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Subtotal</label>
                      <div className="font-mono font-bold text-success">
                        {formatNaira(c.price * line.weight)}
                      </div>
                    </div>
                    <button
                      onClick={() => setLines((arr) => arr.filter((l) => l.id !== line.id))}
                      className="rounded-xl border border-bordergray p-2 text-textgray hover:border-error hover:text-error"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="3. Photo of load">
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-bordergray bg-offwhite text-textgray hover:border-primary hover:text-primary"
                >
                  <Camera size={22} />
                  <span className="mt-2 text-xs font-semibold">Photo {i}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-textgray">
              Up to 3 photos. Clear, well-lit shots speed up verification.
            </p>
          </Section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 card">
            <h3 className="font-display text-lg font-bold">Estimated payout</h3>
            <p className="mt-1 text-xs text-textgray">Final amount confirmed at hub weigh-in.</p>
            <div className="mt-4 rounded-xl bg-gradient-gold p-5 text-charcoal">
              <p className="text-xs uppercase tracking-wider opacity-70">You'll earn approx.</p>
              <p className="mt-1 font-mono text-3xl font-extrabold">{formatNaira(total)}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {lines.map((l) => {
                const c = CATEGORIES.find((cat) => cat.id === l.category)!;
                return (
                  <div key={l.id} className="flex items-center justify-between text-textgray">
                    <span className="flex items-center gap-2">
                      <Recycle size={14} className="text-primary" /> {c.name} · {l.weight} kg
                    </span>
                    <span className="font-mono font-semibold text-charcoal">
                      {formatNaira(c.price * l.weight)}
                    </span>
                  </div>
                );
              })}
            </div>
            <button className="btn-primary mt-5 w-full">
              <Save size={16} /> Save & generate QR
            </button>
            <p className="mt-2 text-center text-xs text-textgray">
              Show your QR at the hub — agent scans, weighs and pays you instantly.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
