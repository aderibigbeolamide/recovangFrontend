import { useState } from "react";
import { ArrowRight, Camera, Check, ChevronRight, QrCode, Scale, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { Avatar, PageHeader } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const QUEUE = [
  { id: "RX-2419", name: "Adaeze Nwosu", phone: "+234 803 555 0182", cat: "PET Bottles", est: 4.2, photos: 3, eta: "5 min" },
  { id: "RX-2418", name: "Tunde Bello", phone: "+234 803 555 0211", cat: "Cardboard", est: 6.0, photos: 2, eta: "12 min" },
  { id: "RX-2417", name: "Maryam Sani", phone: "+234 803 555 0344", cat: "Aluminium Cans", est: 1.8, photos: 4, eta: "Arrived" },
  { id: "RX-2416", name: "Joy Eze", phone: "+234 803 555 0455", cat: "Mixed Paper", est: 3.4, photos: 1, eta: "8 min" },
  { id: "RX-2415", name: "Wale Aboderin", phone: "+234 803 555 0566", cat: "Glass Bottles", est: 9.2, photos: 2, eta: "15 min" },
  { id: "RX-2414", name: "Aisha Yusuf", phone: "+234 803 555 0677", cat: "PET Bottles", est: 5.6, photos: 3, eta: "20 min" },
  { id: "RX-2413", name: "Chinedu Okeke", phone: "+234 803 555 0788", cat: "E-Waste", est: 0.8, photos: 5, eta: "—" },
];

const RATES: Record<string, number> = {
  "PET Bottles": 200, "Cardboard": 80, "Aluminium Cans": 600, "Mixed Paper": 60, "Glass Bottles": 30, "E-Waste": 1200,
};

export default function AgentVerify() {
  const [active, setActive] = useState(QUEUE[0].id);
  const [actualKg, setActualKg] = useState(4.2);
  const sel = QUEUE.find((q) => q.id === active)!;
  const rate = RATES[sel.cat];
  const payout = Math.round(actualKg * rate);

  return (
    <>
      <PageHeader
        eyebrow="Verify drops"
        title="Drop verifier"
        subtitle="Scan QR, weigh, snap, confirm. Average verification time today: 47 seconds."
        actions={<button className="btn-primary"><QrCode size={14} /> Scan QR</button>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Queue */}
        <div className="lg:col-span-5">
          <div className="card p-3">
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
              <input className="input h-9 pl-9 text-sm" placeholder="Search by name, phone or drop ID" />
            </div>
            <div className="space-y-2">
              {QUEUE.map((q) => (
                <button
                  key={q.id}
                  onClick={() => { setActive(q.id); setActualKg(q.est); }}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    active === q.id ? "border-primary bg-mint" : "border-transparent hover:bg-cream"
                  }`}
                >
                  <Avatar name={q.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-extrabold">{q.name}</span>
                      <span className="font-mono text-[10px] text-primary">{q.id}</span>
                    </div>
                    <div className="text-xs text-textgray">{q.cat} · ~{q.est}kg</div>
                  </div>
                  <span className={`badge ${q.eta === "Arrived" ? "badge-success" : "bg-cream text-textgray"}`}>{q.eta}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verifier */}
        <div className="lg:col-span-7">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-bordergray bg-cream/40 p-6">
              <div className="flex items-center gap-3">
                <Avatar name={sel.name} size={48} />
                <div>
                  <div className="font-extrabold text-charcoal">{sel.name}</div>
                  <div className="text-xs text-textgray">{sel.phone} · Drop {sel.id}</div>
                </div>
              </div>
              <span className="badge-mint inline-flex items-center gap-1"><ShieldCheck size={12} /> Verified collector</span>
            </div>

            <div className="p-6">
              <div className="grid items-stretch gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-bordergray bg-cream p-5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={sel.cat} size={48} />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Material</div>
                      <div className="text-base font-extrabold">{sel.cat}</div>
                      <div className="font-mono text-xs text-primary">{formatNaira(rate)}/kg</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between border-t border-bordergray pt-3">
                    <span className="text-xs text-textgray">Collector estimated</span>
                    <span className="font-mono font-extrabold">{sel.est} kg</span>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-primary bg-mint/40 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Scale size={12} /> Hub-scale weight
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => setActualKg((k) => Math.max(0, k - 0.1))} className="grid h-10 w-10 place-items-center rounded-xl border border-bordergray bg-white">−</button>
                    <input
                      value={actualKg.toFixed(1)}
                      onChange={(e) => setActualKg(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      type="number"
                      className="input h-10 flex-1 text-center font-mono text-2xl font-extrabold"
                    />
                    <button onClick={() => setActualKg((k) => k + 0.1)} className="grid h-10 w-10 place-items-center rounded-xl border border-bordergray bg-white">+</button>
                  </div>
                  <div className="mt-2 text-center text-xs text-textgray">Auto-pulled from scale Bluetooth</div>
                </div>
              </div>

              {/* Photos */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Photos · {sel.photos} attached</div>
                  <button className="btn-outline btn-sm"><Camera size={12} /> Add photo</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl ${i < sel.photos ? "bg-grad-mint" : "border-2 border-dashed border-bordergray bg-cream"} grid place-items-center`}>
                      {i < sel.photos ? <Camera size={18} className="text-primary" /> : <span className="text-xs text-textgray/50">—</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout summary */}
              <div className="card-dark mt-5 flex items-center gap-5 p-5">
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Pay collector</div>
                  <div className="mt-1 font-mono text-3xl font-extrabold text-white">
                    <span className="text-accent">₦</span>{payout.toLocaleString("en-NG")}
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">{actualKg.toFixed(1)} kg × {formatNaira(rate)}/kg · Hub commission ₦{Math.round(payout * 0.06)}</div>
                </div>
                <button className="btn-gold btn-lg">
                  Approve & pay <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-3 flex justify-between text-xs">
                <button className="font-bold text-error hover:underline inline-flex items-center gap-1"><X size={12} /> Reject (with reason)</button>
                <button className="font-bold text-textgray hover:underline">Save & next <ChevronRight size={12} className="inline" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
