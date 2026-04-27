import { useState } from "react";
import { ArrowRight, Camera, Check, MapPin, QrCode, Scale, Upload, X } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const CATS = [
  { name: "PET Plastic", rate: 200 },
  { name: "Aluminium Cans", rate: 600 },
  { name: "Mixed Paper", rate: 60 },
  { name: "Cardboard", rate: 80 },
  { name: "Glass Bottles", rate: 30 },
  { name: "E-Waste", rate: 1200 },
];
const HUBS = ["Surulere Hub (0.4 km)", "Yaba Centre (1.2 km)", "Lekki Hub (8.6 km)"];

export default function CollectorSubmit() {
  const [pick, setPick] = useState<Record<string, number>>({ "PET Plastic": 4.2, "Cardboard": 2 });
  const [hub, setHub] = useState(HUBS[0]);
  const [photo, setPhoto] = useState(true);

  const total = Object.entries(pick).reduce((s, [k, v]) => s + v * (CATS.find((c) => c.name === k)?.rate ?? 0), 0);
  const totalKg = Object.values(pick).reduce((s, v) => s + v, 0);

  function setKg(name: string, v: number) {
    setPick((p) => ({ ...p, [name]: Math.max(0, v) }));
  }

  return (
    <>
      <PageHeader
        eyebrow="New submission"
        title="Submit your waste"
        subtitle="Pre-record your drop on the way to the hub. Agent will verify the weights when you arrive."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* Step 1 — categories */}
          <Section n="1" title="Pick categories & estimated weights">
            <div className="grid gap-3 sm:grid-cols-2">
              {CATS.map((c) => {
                const active = pick[c.name] !== undefined;
                return (
                  <div key={c.name} className={`rounded-2xl border p-4 transition ${active ? "border-primary bg-mint/40" : "border-bordergray bg-white hover:border-primary/40"}`}>
                    <div className="flex items-center gap-3">
                      <CategoryIcon category={c.name} size={42} />
                      <div className="flex-1">
                        <div className="text-sm font-extrabold">{c.name}</div>
                        <div className="text-[11px] text-textgray">{formatNaira(c.rate)}/kg · Lagos</div>
                      </div>
                      {active ? (
                        <button onClick={() => { const np = { ...pick }; delete np[c.name]; setPick(np); }} className="grid h-7 w-7 place-items-center rounded-full bg-error-50 text-error">
                          <X size={14} />
                        </button>
                      ) : (
                        <button onClick={() => setKg(c.name, 1)} className="btn-outline btn-sm">Add</button>
                      )}
                    </div>
                    {active && (
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => setKg(c.name, pick[c.name] - 0.5)} className="grid h-9 w-9 place-items-center rounded-xl border border-bordergray bg-white">−</button>
                        <input
                          value={pick[c.name]}
                          onChange={(e) => setKg(c.name, parseFloat(e.target.value) || 0)}
                          step="0.1"
                          type="number"
                          className="input h-9 flex-1 text-center font-mono font-bold"
                        />
                        <span className="text-sm font-bold text-textgray">kg</span>
                        <button onClick={() => setKg(c.name, pick[c.name] + 0.5)} className="grid h-9 w-9 place-items-center rounded-xl border border-bordergray bg-white">+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Step 2 — hub */}
          <Section n="2" title="Pick a hub">
            <div className="grid gap-2">
              {HUBS.map((h) => (
                <label key={h} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${hub === h ? "border-primary bg-mint/40" : "border-bordergray hover:border-primary/40"}`}>
                  <input type="radio" name="hub" checked={hub === h} onChange={() => setHub(h)} className="accent-primary" />
                  <MapPin size={16} className="text-primary" />
                  <span className="flex-1 text-sm font-bold">{h}</span>
                  <span className="badge-mint">Open until 7pm</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Step 3 — photo */}
          <Section n="3" title="Add a photo (optional)">
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="card flex h-32 flex-col items-center justify-center gap-2 border-dashed text-textgray hover:border-primary hover:text-primary">
                <Camera size={24} />
                <span className="text-sm font-bold">Take photo</span>
              </button>
              <div className={`card flex h-32 items-center justify-center ${photo ? "border-primary bg-mint/40" : ""}`}>
                {photo ? (
                  <div className="flex flex-col items-center gap-1 text-success">
                    <Check size={24} />
                    <span className="text-sm font-bold">3 photos attached</span>
                  </div>
                ) : (
                  <button className="btn-ghost"><Upload size={14} /> Upload photos</button>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Right — summary card with QR */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-dark p-7">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Estimated payout</div>
            <div className="mt-2 font-mono text-4xl font-extrabold text-white">
              <span className="text-accent">₦</span>{total.toLocaleString("en-NG")}
            </div>
            <div className="mt-1 text-xs text-white/70">Final amount confirmed at hub</div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="space-y-2 text-sm">
                {Object.entries(pick).map(([k, v]) => {
                  const rate = CATS.find((c) => c.name === k)?.rate ?? 0;
                  return (
                    <div key={k} className="flex justify-between">
                      <span className="text-white/80">{v} kg · {k}</span>
                      <span className="font-mono font-bold">{formatNaira(v * rate)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                  <span className="font-extrabold">Total ({totalKg.toFixed(1)} kg)</span>
                  <span className="font-mono font-extrabold text-accent">{formatNaira(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[auto,1fr] items-center gap-4 rounded-2xl bg-white p-4">
              <div className="grid h-20 w-20 place-items-center rounded-xl bg-charcoal text-accent">
                <QrCode size={48} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Show this code at hub</div>
                <div className="mt-1 font-mono text-sm font-bold text-charcoal">RX-2419-AN</div>
                <div className="text-[10px] text-textgray">Valid 24h</div>
              </div>
            </div>

            <button className="btn-gold btn-lg mt-6 w-full">Generate drop ticket <ArrowRight size={16} /></button>
            <p className="mt-3 text-center text-[11px] text-white/60">
              <Scale size={11} className="mr-1 inline" /> Final payout based on calibrated hub scale
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-charcoal text-[11px] font-extrabold text-white">{n}</span>
        <h3 className="text-h4">{title}</h3>
      </div>
      {children}
    </div>
  );
}
