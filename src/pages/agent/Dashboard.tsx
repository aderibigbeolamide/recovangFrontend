import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Coins, Package, QrCode, Scale, Users } from "lucide-react";
import { KPICard, PageHeader } from "@/components/ui";
import { BarChart, Donut, ProgressRing } from "@/components/charts";
import { useAgentDashboard } from "@/hooks/useAgent";
import { formatNaira, formatKg } from "@/lib/cn";
import { useState, useEffect } from "react";
import { CreateHubModal } from "@/components/CreateHubModal";

export default function AgentDashboard() {
  const { data, isLoading, error } = useAgentDashboard();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (data && !data.agent.hubExists) {
        setShowSetup(true);
    }
  }, [data]);

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 font-bold text-primary">Loading your hub stats...</p>
        </div>
    </div>
  );
  
  if (error) return <div className="p-20 text-center text-error">Failed to load dashboard. Please check your connection.</div>;
  if (!data) return <div className="p-20 text-center">No agent data found.</div>;

  const QUEUE = data.queue || [];
  const capacity = data.capacity || { current: 0, max: 1000, percentage: 0 };
  const breakdown = data.breakdown || [];
  const stats = data.stats || { drops: 0, volume: 0, commission: 0, collectors: 0 };

  const HOURLY = [
    { label: "8a", value: 4 },
    { label: "9a", value: 12 },
    { label: "10a", value: 18 },
    { label: "11a", value: 22 },
    { label: "12p", value: 28 },
    { label: "1p", value: 24 },
    { label: "2p", value: 19 },
    { label: "3p", value: 16 },
    { label: "4p", value: 14 },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Agent portal · ${data.agent.hubName}`}
        title={`Good morning, ${data.agent.name.split(' ')[0]}.`}
        subtitle={`${QUEUE.length} collectors in queue. Hub is at ${capacity.percentage}% capacity.`}
        actions={
          <>
            <Link to="/agent/reports" className="btn-outline"><ClipboardList size={14} /> Daily report</Link>
            <Link to="/agent/verify" className="btn-primary"><QrCode size={14} /> Verify drops</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Today's drops" value={stats.drops} sub="+ 22 vs yesterday" icon={Package} variant="primary" />
        <KPICard label="Today's volume" value={`${stats.volume} kg`} sub="HDPE & PET dominant" icon={Scale} />
        <KPICard label="Hub commission" value={formatNaira(stats.commission)} sub={`${formatNaira(stats.commission * 6)} paid to collectors`} icon={Coins} variant="gold" />
        <KPICard label="Active collectors" value={stats.collectors} sub="9 first-time today" icon={Users} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Queue */}
        <div className="card overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Verification queue</h3>
              <p className="text-sm text-textgray">Collectors who pre-recorded their drops</p>
            </div>
            <Link to="/agent/verify" className="text-sm font-bold text-primary">Open verifier <ArrowRight size={12} className="inline" /></Link>
          </div>
          <div className="divide-y divide-bordergray">
            {QUEUE.length === 0 ? (
                <div className="p-20 text-center text-textgray">No collectors in queue.</div>
            ) : QUEUE.map((q: any) => (
              <div key={q.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6 sm:py-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center font-bold text-primary">
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
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-bordergray/40 pt-3 sm:border-0 sm:pt-0">
                  <span className="badge-mint shrink-0">{q.eta}</span>
                  <Link to={`/agent/verify?id=${q.fullId}`} className="btn-primary btn-sm flex-1 sm:flex-none">Verify</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div className="card-dark p-6 lg:col-span-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Hub capacity</div>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={capacity.percentage} color="#D4A017" label="full" />
            <div className="flex-1">
              <div className="font-display text-2xl font-extrabold text-white">{formatKg(capacity.current)} / {formatKg(capacity.max)}</div>
              <p className="mt-1 text-xs text-white/70">{100 - capacity.percentage}% capacity remaining. Logistics pickup recommended.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {breakdown.length === 0 ? (
                [1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse"></div>)
            ) : breakdown.slice(0, 3).map((s: any, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="font-mono text-lg font-extrabold text-white">{Math.round(s.value).toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.label} (kg)</div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
                const btn = document.getElementById('pickup-btn');
                if (btn) {
                    btn.innerText = "Requesting...";
                    setTimeout(() => {
                        btn.innerText = "Pickup Requested! ✓";
                        btn.classList.add('bg-success');
                        btn.classList.remove('btn-gold');
                    }, 1500);
                }
            }}
            id="pickup-btn"
            className="btn-gold mt-5 w-full"
          >
            Request early pickup
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-h4">Drops by hour</h3>
            <span className="badge bg-cream text-textgray">Today</span>
          </div>
          <div className="mt-5">
            <BarChart data={HOURLY} height={180} barColor="#1A6B3C" />
          </div>
        </div>

        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Material breakdown</h3>
          <p className="mb-5 text-sm text-textgray">Total hub inventory by category</p>
          <div className="flex flex-col gap-6">
            <Donut
              centerValue={formatKg(capacity.current, { compact: true })}
              centerLabel="Total"
              data={breakdown}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {breakdown.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-textgray truncate flex-1">{item.label}</span>
                        <span className="font-bold text-charcoal">{Math.round((item.value / capacity.current) * 100)}%</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {showSetup && <CreateHubModal onClose={() => setShowSetup(false)} />}
    </>
  );
}
