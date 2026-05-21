import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Coins, Package, QrCode, Scale, Users } from "lucide-react";
import { KPICard, PageHeader, DashboardSkeleton } from "@/components/ui";
import { BarChart, Donut, ProgressRing } from "@/components/charts";
import { useAgentDashboard } from "@/hooks/useAgent";
import { formatNaira, formatKg } from "@/lib/cn";
import { useState, useEffect } from "react";
import { CreateHubModal } from "@/components/CreateHubModal";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
});

const HOURLY = [
  { label: "8a", value: 4 }, { label: "9a", value: 12 }, { label: "10a", value: 18 },
  { label: "11a", value: 22 }, { label: "12p", value: 28 }, { label: "1p", value: 24 },
  { label: "2p", value: 19 }, { label: "3p", value: 16 }, { label: "4p", value: 14 },
];

export default function AgentDashboard() {
  const { data, isLoading, error } = useAgentDashboard();
  const [showSetup, setShowSetup] = useState(false);
  const [pickupRequested, setPickupRequested] = useState(false);

  useEffect(() => {
    if (data && !data.agent.hubExists) setShowSetup(true);
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="p-20 text-center text-error font-bold">Failed to load dashboard. Please check your connection.</div>;
  if (!data) return <div className="p-20 text-center text-textgray">No agent data found.</div>;

  const QUEUE = data.queue || [];
  const capacity = data.capacity || { current: 0, max: 1000, percentage: 0 };
  const breakdown = data.breakdown || [];
  const stats = data.stats || { drops: 0, volume: 0, commission: 0, collectors: 0 };

  return (
    <>
      <PageHeader
        eyebrow={`Agent portal · ${data.agent.hubName}`}
        title={`Good morning, ${data.agent.name.split(" ")[0]}.`}
        subtitle={`${QUEUE.length} collectors in queue. Hub at ${capacity.percentage}% capacity.`}
        actions={
          <>
            <Link to="/agent/reports" className="btn-outline"><ClipboardList size={14} /> Daily report</Link>
            <Link to="/agent/verify" className="btn-primary"><QrCode size={14} /> Verify drops</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard index={0} label="Today's drops" value={stats.drops} sub="Verified today" icon={Package} variant="primary" />
        <KPICard index={1} label="Today's volume" value={`${stats.volume} kg`} sub="HDPE & PET dominant" icon={Scale} />
        <KPICard index={2} label="Hub commission" value={formatNaira(stats.commission)} sub={`${formatNaira(stats.commission * 6)} paid to collectors`} icon={Coins} variant="gold" />
        <KPICard index={3} label="Active collectors" value={stats.collectors} sub="9 first-time today" icon={Users} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Verification Queue */}
        <motion.div {...fadeUp(0.15)} className="card overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Verification queue</h3>
              <p className="text-sm text-textgray">Collectors who pre-recorded their drops</p>
            </div>
            <Link to="/agent/verify" className="text-sm font-bold text-primary">
              Open verifier <ArrowRight size={12} className="inline" />
            </Link>
          </div>
          <div className="divide-y divide-bordergray">
            {QUEUE.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center text-textgray">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cream text-primary">
                  <QrCode size={22} />
                </div>
                <div className="font-bold">No collectors in queue</div>
                <div className="text-sm">Drops will appear here when collectors check in.</div>
              </div>
            ) : QUEUE.map((q: any, i: number) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-bold text-primary text-lg">
                    {q.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold truncate">{q.name}</span>
                      <span className="font-mono text-[10px] text-textgray shrink-0">{q.id}</span>
                    </div>
                    <div className="text-[11px] text-textgray truncate">{q.cat} · ~{q.est}kg estimated</div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-bordergray/40 pt-2.5 sm:border-0 sm:pt-0">
                  <span className="badge-mint shrink-0">{q.eta}</span>
                  <Link to={`/agent/verify?id=${q.fullId}`} className="btn-primary btn-sm">Verify</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hub Capacity */}
        <motion.div {...fadeUp(0.2)} className="card-dark p-6 lg:col-span-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Hub capacity</div>
          <div className="mt-5 flex items-center gap-5">
            <ProgressRing value={capacity.percentage} color="#D4A017" label="full" />
            <div className="flex-1">
              <div className="font-display text-2xl font-extrabold text-white">
                {formatKg(capacity.current)} / {formatKg(capacity.max)}
              </div>
              <p className="mt-1 text-xs text-white/65 leading-snug">
                {100 - capacity.percentage}% capacity remaining. Logistics pickup recommended when above 85%.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {breakdown.length === 0
              ? [1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)
              : breakdown.slice(0, 3).map((s: any, i: number) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/6 p-3">
                  <div className="font-mono text-lg font-extrabold text-white">{Math.round(s.value).toLocaleString()}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/55">{s.label} kg</div>
                </div>
              ))
            }
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setPickupRequested(true)}
            disabled={pickupRequested}
            className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-bold transition ${
              pickupRequested
                ? "bg-success text-white cursor-default"
                : "btn-gold"
            }`}
          >
            {pickupRequested ? "✓ Pickup Requested" : "Request early pickup"}
          </motion.button>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <motion.div {...fadeUp(0.25)} className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-h4">Drops by hour</h3>
            <span className="badge bg-cream text-textgray">Today</span>
          </div>
          <BarChart data={HOURLY} height={180} barColor="#1A6B3C" />
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material breakdown</h3>
          <p className="mb-5 text-sm text-textgray">Total hub inventory by category</p>
          <Donut
            centerValue={formatKg(capacity.current, { compact: true })}
            centerLabel="Total"
            data={breakdown}
          />
          {breakdown.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-textgray truncate flex-1">{item.label}</span>
                  <span className="font-bold text-charcoal">
                    {capacity.current > 0 ? Math.round((item.value / capacity.current) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {showSetup && <CreateHubModal isOpen={showSetup} onClose={() => setShowSetup(false)} />}
    </>
  );
}
