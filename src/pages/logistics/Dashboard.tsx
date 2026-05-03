import { Link } from "react-router-dom";
import { ArrowRight, Award, Clock, Coins, Fuel, Map, MapPin, Navigation, Package, Route, Truck, TrendingUp } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, ProgressRing } from "@/components/charts";
import { formatNaira } from "@/lib/cn";

const ACTIVE = [
  { id: "PK-2419", origin: "Surulere Hub", dest: "Ikorodu Recycler", driver: "Suleiman M.", vehicle: "LG-LD221", load: "1.2t PET", eta: "27 min", progress: 64 },
  { id: "PK-2417", origin: "Yaba Centre", dest: "Apapa Port", driver: "Femi A.", vehicle: "LG-AP118", load: "2.4t Cardboard", eta: "1h 12m", progress: 32 },
  { id: "PK-2415", origin: "Lekki Hub", dest: "Ikorodu Recycler", driver: "Bashir O.", vehicle: "LG-IK402", load: "0.8t Aluminium", eta: "Loading", progress: 8 },
];

const DAILY = [
  { label: "M", value: 4 }, { label: "T", value: 6 }, { label: "W", value: 5 },
  { label: "T", value: 7 }, { label: "F", value: 8 }, { label: "S", value: 9 }, { label: "S", value: 6 },
];

import { useLogisticsDashboard } from "@/hooks/useLogistics";

export default function LogisticsDashboard() {
  const { data, isLoading } = useLogisticsDashboard();

  if (isLoading || !data) return <div className="p-20 text-center font-bold">Loading dashboard...</div>;

  const isApproved = data.isApproved;
  const activePickups = isApproved ? data.pickups.active : [];
  const openPickups = isApproved ? data.pickups.open : [];
  const tonnage = isApproved ? data.stats.tonnage : 0;
  const revenue = isApproved ? data.stats.revenue : 0;
  const trips = isApproved ? data.stats.trips : 0;

  return (
    <>
      <PageHeader
        eyebrow={`Logistics partner · ${isApproved ? data.stats.rating : 5.0} rating`}
        title={`Welcome back.`}
        subtitle={isApproved 
            ? `${activePickups.length} trucks on the road. ${openPickups.length} pickups pending.`
            : "Your account is currently under review. Please complete your KYC to begin."
        }
        actions={
          <>
            <Link to="/logistics/fleet" className="btn-outline"><Truck size={14} /> Fleet</Link>
            <Link to="/logistics/pickups" className="btn-primary"><Package size={14} /> Pickups</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active pickups" value={activePickups.length} sub="Real-time dispatch" icon={Truck} variant="primary" />
        <KPICard label="Total tonnage" value={`${tonnage} t`} sub="Life-time volume" icon={Package} />
        <KPICard label="Total revenue" value={formatNaira(revenue)} sub="Earnings to date" icon={Coins} variant="gold" />
        <KPICard label="Trips completed" value={trips} sub="Reliable partner" icon={Clock} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Active trips */}
        <div className="card overflow-hidden lg:col-span-8">
          <div className="flex items-center justify-between border-b border-bordergray p-6">
            <div>
              <h3 className="text-h4">Live trips</h3>
              <p className="text-sm text-textgray">Trucks en route now</p>
            </div>
            <Link to="/logistics/pickups" className="text-sm font-bold text-primary">All pickups <ArrowRight size={12} className="inline" /></Link>
          </div>
          <div className="divide-y divide-bordergray">
            {activePickups.length === 0 ? (
                <div className="p-20 text-center text-textgray">No active trips at the moment.</div>
            ) : activePickups.map((t: any) => (
              <div key={t.fullId} className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-grad-primary text-white">
                    <Truck size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold truncate">{t.id}</span>
                      <span className="font-mono text-[10px] text-textgray shrink-0">{t.vehicle}</span>
                    </div>
                    <div className="text-[11px] text-textgray truncate">{t.driver} · {t.weight} {t.cat}</div>
                  </div>
                  <span className="badge badge-success inline-flex items-center gap-1 shrink-0">
                    <Clock size={11} /> {t.window}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">From</div>
                    <div className="font-extrabold text-sm sm:text-base">{t.origin}</div>
                  </div>
                  
                  <div className="relative h-6 w-full sm:h-8 sm:w-48">
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-charcoal/10" />
                    <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-grad-primary" style={{ width: `${t.progress}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${t.progress}%` }}>
                      <div className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-accent text-charcoal shadow-lift">
                        <Truck size={11} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-left sm:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">To</div>
                    <div className="font-extrabold text-sm sm:text-base">{t.dest}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet overview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-dark p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Fleet utilisation</div>
            <div className="mt-4 flex items-center gap-5">
              <ProgressRing value={isApproved ? 62 : 0} color="#D4A017" label="utilised" />
              <div className="flex-1">
                <div className="font-display text-2xl font-extrabold text-white">{isApproved ? "5 / 8" : "0 / 0"} active</div>
                <p className="mt-1 text-xs text-white/70">
                    {isApproved ? "3 trucks idle. Schedule pickups to push above 80%." : "No vehicles registered yet."}
                </p>
              </div>
            </div>
          </div>

          <KPICard label="Avg fuel / 100km" value={isApproved ? "14.2 L" : "0 L"} sub={isApproved ? "-8% vs last week" : "Awaiting data"} icon={Fuel} variant="primary" />
          <KPICard label="Avg load weight" value={isApproved ? "2.4 t" : "0 t"} sub={isApproved ? "78% of capacity" : "Awaiting data"} icon={Package} variant="gold" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-h4">Pickups completed</h3>
            <span className="badge bg-cream text-textgray">{isApproved ? "Last 7 days" : "Awaiting approval"}</span>
          </div>
          <div className="mt-5">
            <BarChart data={isApproved ? DAILY : []} height={180} barColor="#1A6B3C" />
          </div>
        </div>
        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Top routes this week</h3>
          <div className="mt-5 space-y-3">
            {isApproved ? [
              { from: "Surulere", to: "Ikorodu", trips: 12, rev: 84000 },
              { from: "Yaba", to: "Apapa", trips: 9, rev: 68400 },
              { from: "Lekki", to: "Ikorodu", trips: 7, rev: 91200 },
              { from: "Ikoyi", to: "Apapa", trips: 5, rev: 41800 },
            ].map((r) => (
              <div key={r.from + r.to} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-primary shadow-soft">
                  <Route size={14} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{r.from} → {r.to}</div>
                  <div className="text-[11px] text-textgray">{r.trips} trips</div>
                </div>
                <span className="money">{formatNaira(r.rev)}</span>
              </div>
            )) : (
                <div className="p-10 text-center text-textgray italic">Route analysis will be available once approved.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
