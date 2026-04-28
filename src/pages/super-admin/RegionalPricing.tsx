import { useState } from "react";
import { Coins, Globe, History, Save, ShieldCheck } from "lucide-react";
import { KPICard, PageHeader } from "@/components/ui";
import { formatNaira } from "@/lib/cn";

const STATES = ["Lagos", "Abuja FCT", "Port Harcourt", "Ibadan", "Kano", "Kaduna", "Calabar", "Enugu"];
const CATEGORIES = [
  { id: "PET", name: "PET Plastic", base: 200, factory: 240 },
  { id: "ALU", name: "Aluminium Cans", base: 600, factory: 720 },
  { id: "HDPE", name: "HDPE Plastic", base: 180, factory: 220 },
  { id: "CARDBOARD", name: "Cardboard", base: 60, factory: 90 },
  { id: "GLASS", name: "Glass", base: 30, factory: 50 },
  { id: "PAPER", name: "Mixed Paper", base: 50, factory: 75 },
  { id: "EWASTE", name: "E-Waste", base: 1200, factory: 1800 },
];

const REGIONAL_MULTIPLIERS: Record<string, number> = {
  "Lagos": 1.0,
  "Abuja FCT": 1.05,
  "Port Harcourt": 1.08,
  "Ibadan": 0.95,
  "Kano": 0.92,
  "Kaduna": 0.92,
  "Calabar": 1.04,
  "Enugu": 0.96,
};

const CHANGES = [
  { time: "Today 09:42", who: "Olamide A.", what: "PET · Lagos", from: 180, to: 200 },
  { time: "Yesterday", who: "Funmi A.", what: "Aluminium · Port Harcourt", from: 580, to: 648 },
  { time: "23 Apr", who: "Olamide A.", what: "Cardboard · all regions", from: 50, to: 60 },
  { time: "21 Apr", who: "Funmi A.", what: "PET · Kano", from: 160, to: 184 },
];

export default function SuperAdminRegionalPricing() {
  const [region, setRegion] = useState(STATES[0]);
  const [drafts, setDrafts] = useState<Record<string, number>>({});

  const mult = REGIONAL_MULTIPLIERS[region] ?? 1;
  const dirty = Object.keys(drafts).length > 0;

  function setDraft(catId: string, value: number) {
    setDrafts((prev) => ({ ...prev, [catId]: value }));
  }

  function publish() {
    setDrafts({});
  }

  return (
    <>
      <PageHeader
        eyebrow="Super Admin · Pricing engine"
        title="Regional pricing matrix"
        subtitle="Set the naira-per-kg payout for each material in each state. Changes are versioned and roll out to every collector phone within 60 seconds."
        actions={
          <>
            <button className="btn-outline"><History size={14} /> Change log</button>
            <button className="btn-primary" disabled={!dirty} onClick={publish}><Save size={14} /> {dirty ? `Publish ${Object.keys(drafts).length} change${Object.keys(drafts).length === 1 ? "" : "s"}` : "Nothing to publish"}</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Material categories" value={String(CATEGORIES.length)} sub="Globally tracked" icon={Coins} variant="primary" />
        <KPICard label="Regions priced" value={`${STATES.length} states`} sub="Multipliers per region" icon={Globe} />
        <KPICard label="Effective version" value="v3.18" sub="Published 2 hours ago" icon={ShieldCheck} variant="dark" />
        <KPICard label="Roll-out" value="60s" sub="Avg push to collector apps" icon={Save} variant="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Region picker */}
        <aside className="card p-4 lg:col-span-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Pick a region</div>
          <div className="mt-3 grid gap-1">
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setRegion(s)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition ${region === s ? "bg-charcoal text-white" : "text-charcoal hover:bg-cream"}`}
              >
                <span>{s}</span>
                <span className={`font-mono text-[10px] ${region === s ? "text-white/70" : "text-textgray"}`}>×{(REGIONAL_MULTIPLIERS[s] ?? 1).toFixed(2)}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-mint/40 p-3 text-[11px] text-charcoal">
            <div className="font-extrabold">Regional multiplier</div>
            <div className="mt-1">Lagos is the base region (×1.00). Other regions adjust automatically when you set the base price for a material.</div>
          </div>
        </aside>

        {/* Pricing grid */}
        <div className="card overflow-hidden lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bordergray bg-cream/40 p-4">
            <div>
              <h3 className="text-h4">{region} · payout rates</h3>
              <p className="text-xs text-textgray">Multiplier ×{mult.toFixed(2)} applied to base prices.</p>
            </div>
            <span className="badge-success text-[10px]">Effective immediately on publish</span>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Material</th>
                  <th className="text-right">Factory buy (₦/kg)</th>
                  <th className="text-right">Collector payout (₦/kg)</th>
                  <th className="text-right">Margin</th>
                  <th className="min-w-[200px]">Adjust payout</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((c) => {
                  const effective = Math.round(c.base * mult);
                  const draft = drafts[c.id] ?? effective;
                  const margin = c.factory - draft;
                  const marginPct = Math.round((margin / c.factory) * 100);
                  return (
                    <tr key={c.id}>
                      <td className="font-extrabold">{c.name}</td>
                      <td className="text-right font-mono">{formatNaira(c.factory)}</td>
                      <td className="text-right font-mono font-extrabold">{formatNaira(draft)}</td>
                      <td className={`text-right font-mono ${margin >= 0 ? "text-success" : "text-error"}`}>
                        {margin >= 0 ? "+" : ""}{formatNaira(margin)} <span className="text-[10px]">({marginPct}%)</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={Math.round(c.factory * 0.4)}
                            max={Math.round(c.factory * 0.95)}
                            step={5}
                            value={draft}
                            onChange={(e) => setDraft(c.id, Number(e.target.value))}
                            className="flex-1 accent-primary"
                          />
                          <input
                            type="number"
                            value={draft}
                            onChange={(e) => setDraft(c.id, Number(e.target.value))}
                            className="input h-9 w-20 text-right font-mono text-xs"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Change log */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-5">
          <h3 className="text-h4 flex items-center gap-2"><History size={16} className="text-primary" /> Recent pricing changes</h3>
          <button className="btn-outline btn-sm">Export CSV</button>
        </div>
        <div className="divide-y divide-bordergray">
          {CHANGES.map((c, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <div>
                <div className="font-extrabold">{c.what}</div>
                <div className="text-[11px] text-textgray">{c.who} · {c.time}</div>
              </div>
              <div className="font-mono">
                <span className="text-textgray line-through">{formatNaira(c.from)}</span>{" "}
                <span className="font-extrabold text-primary">→ {formatNaira(c.to)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
