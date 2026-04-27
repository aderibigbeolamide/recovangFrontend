import { AlertTriangle, ArrowRight, Camera, CheckCircle2, Clock, FileWarning, MessageCircle, Plus, Scale, X } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { useState } from "react";
import { formatNaira } from "@/lib/cn";

const DISPUTES = [
  {
    id: "DSP-1042",
    drop: "RX-2318",
    date: "Apr 04, 2026",
    hub: "Yaba Centre",
    agent: "Tope D.",
    cat: "Cardboard",
    claimedKg: 6.2,
    recordedKg: 4.0,
    diff: 176,
    status: "open",
    reply: "We've received your dispute. Our ops team is reviewing the photo and weighing receipt. Expect a decision by tomorrow.",
    replyAt: "5h ago",
  },
  {
    id: "DSP-1029",
    drop: "RX-2271",
    date: "Mar 21, 2026",
    hub: "Surulere Hub",
    agent: "Bola A.",
    cat: "PET Bottles",
    claimedKg: 5.4,
    recordedKg: 3.8,
    diff: 320,
    status: "won",
    reply: "Resolution: weighing scale was 0.6kg under-calibrated. We've credited the difference plus a ₦100 apology.",
    replyAt: "2d ago",
  },
  {
    id: "DSP-1014",
    drop: "RX-2204",
    date: "Mar 11, 2026",
    hub: "Surulere Hub",
    agent: "Bola A.",
    cat: "Aluminium Cans",
    claimedKg: 1.4,
    recordedKg: 1.1,
    diff: 180,
    status: "lost",
    reply: "Resolution: photo evidence shows wet drink residue inflated your home-scale reading. Hub scale was correct.",
    replyAt: "5d ago",
  },
];

const STATUS_MAP: Record<string, { color: string; label: string; icon: any }> = {
  open: { color: "warning", label: "Under review", icon: Clock },
  won: { color: "success", label: "Resolved · adjusted", icon: CheckCircle2 },
  lost: { color: "error", label: "Closed · upheld", icon: X },
};

export default function CollectorDisputes() {
  const [active, setActive] = useState(DISPUTES[0].id);
  const sel = DISPUTES.find((d) => d.id === active)!;
  return (
    <>
      <PageHeader
        eyebrow="Disputes"
        title="Disagree with a drop?"
        subtitle="Raise a dispute within 14 days. Our ops team reviews photo, scale and timestamp evidence — usually within 4 hours."
        actions={<button className="btn-primary"><Plus size={14} /> New dispute</button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Open" value="1" sub="Avg response: 4h" icon={Clock} variant="default" />
        <KPICard label="Resolved in your favour" value="6" sub="₦18,400 recovered" icon={CheckCircle2} variant="primary" />
        <KPICard label="Win rate" value="74%" sub="Lifetime · 9 disputes" icon={Scale} variant="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* List */}
        <div className="space-y-3 lg:col-span-5">
          {DISPUTES.map((d) => {
            const s = STATUS_MAP[d.status];
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`card w-full p-5 text-left transition ${active === d.id ? "border-primary ring-4 ring-primary/10" : "hover:border-primary/40"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs font-bold text-primary">{d.id}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryIcon category={d.cat} size={26} />
                      <span className="text-sm font-extrabold">{d.cat}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-textgray">Drop {d.drop} · {d.date}</div>
                  </div>
                  <span className={`badge bg-${s.color}-50 text-${s.color}`}>{s.label}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-bordergray pt-3 text-xs">
                  <span className="text-textgray">Claimed vs hub</span>
                  <span className="font-mono font-extrabold">{d.claimedKg}kg → {d.recordedKg}kg</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-7">
          <div className="card overflow-hidden">
            <div className="flex items-start justify-between border-b border-bordergray bg-cream/40 p-6">
              <div>
                <div className="font-mono text-xs font-bold text-primary">{sel.id}</div>
                <h3 className="mt-1 text-h3">{sel.cat} · {sel.recordedKg} kg recorded</h3>
                <div className="mt-1 text-sm text-textgray">{sel.hub} · {sel.date}</div>
              </div>
              <span className={`badge bg-${STATUS_MAP[sel.status].color}-50 text-${STATUS_MAP[sel.status].color} inline-flex items-center gap-1`}>
                <AlertTriangle size={11} /> {STATUS_MAP[sel.status].label}
              </span>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-3">
              <Stat label="You claimed" value={`${sel.claimedKg} kg`} />
              <Stat label="Hub recorded" value={`${sel.recordedKg} kg`} />
              <Stat label="In dispute" value={`+${formatNaira(sel.diff)}`} highlight />
            </div>

            <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-dashed border-bordergray p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-textgray">
                  <Camera size={12} /> Hub photo
                </div>
                <div className="mt-2 grid h-32 place-items-center rounded-xl bg-grad-mint">
                  <Camera size={24} className="text-primary" />
                </div>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-bordergray p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-textgray">
                  <Scale size={12} /> Scale receipt
                </div>
                <div className="mt-2 grid h-32 place-items-center rounded-xl bg-cream">
                  <span className="font-mono text-2xl font-extrabold text-charcoal">{sel.recordedKg.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            <div className="border-t border-bordergray p-6">
              <div className="flex items-start gap-3">
                <Avatar name="Recovang Ops" size={36} />
                <div className="flex-1 rounded-2xl bg-cream p-4">
                  <div className="text-xs font-bold text-primary">Recovang Operations</div>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal">{sel.reply}</p>
                  <div className="mt-2 text-[11px] text-textgray">{sel.replyAt}</div>
                </div>
              </div>
              {sel.status === "open" && (
                <div className="mt-4 flex items-center gap-2">
                  <input className="input flex-1" placeholder="Add more details or evidence…" />
                  <button className="btn-primary"><MessageCircle size={14} /> Reply</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-grad-gold-soft" : "bg-cream"}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">{label}</div>
      <div className={`mt-1 font-mono text-xl font-extrabold ${highlight ? "text-accent-700" : "text-charcoal"}`}>{value}</div>
    </div>
  );
}
