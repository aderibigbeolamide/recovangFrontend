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

export default function LogisticsDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Logistics partner · GreenWheels Nigeria"
        title="Welcome back, Tunde."
        subtitle="3 trucks on the road. 4 pickups pending. Avg fuel cost down 8% this week."
        actions={
          <>
            <Link to="/logistics/fleet" className="btn-outline"><Truck size={14} /> Fleet</Link>
            <Link to="/logistics/pickups" className="btn-primary"><Package size={14} /> Pickups</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active pickups" value="3" sub="Out of 8 trucks" icon={Truck} variant="primary" />
        <KPICard label="Today's tonnage" value="14.2 t" sub="+ 22% vs yesterday" icon={Package} trend={{ value: "+22%", direction: "up" }} />
        <KPICard label="Today's revenue" value={formatNaira(248400)} sub="₦35–₦65 / km tier" icon={Coins} variant="gold" />
        <KPICard label="On-time rate" value="96%" sub="Top 5% partner" icon={Clock} variant="dark" />
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
            {ACTIVE.map((t) => (
              <div key={t.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-grad-primary text-white">
                    <Truck size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">{t.id}</span>
                      <span className="font-mono text-[11px] text-textgray">{t.vehicle}</span>
                    </div>
                    <div className="text-xs text-textgray">{t.driver} · {t.load}</div>
                  </div>
                  <span className={`badge ${t.progress > 30 ? "badge-success" : "badge-mint"} inline-flex items-center gap-1`}>
                    <Clock size={11} /> {t.eta}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-[1fr,auto,1fr] items-center gap-3 text-sm">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">From</div>
                    <div className="font-extrabold">{t.origin}</div>
                  </div>
                  <div className="relative h-8 w-32 sm:w-48">
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-charcoal/10" />
                    <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-grad-primary" style={{ width: `${t.progress}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${t.progress}%` }}>
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-charcoal shadow-lift">
                        <Truck size={12} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">To</div>
                    <div className="font-extrabold">{t.dest}</div>
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
              <ProgressRing value={62} color="#D4A017" label="utilised" />
              <div className="flex-1">
                <div className="font-display text-2xl font-extrabold text-white">5 / 8 active</div>
                <p className="mt-1 text-xs text-white/70">3 trucks idle. Schedule pickups to push above 80%.</p>
              </div>
            </div>
          </div>

          <KPICard label="Avg fuel / 100km" value="14.2 L" sub="-8% vs last week" icon={Fuel} variant="primary" />
          <KPICard label="Avg load weight" value="2.4 t" sub="78% of capacity" icon={Package} variant="gold" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-h4">Pickups completed</h3>
            <span className="badge bg-cream text-textgray">Last 7 days</span>
          </div>
          <div className="mt-5">
            <BarChart data={DAILY} height={180} barColor="#1A6B3C" />
          </div>
        </div>
        <div className="card p-6 lg:col-span-5">
          <h3 className="text-h4">Top routes this week</h3>
          <div className="mt-5 space-y-3">
            {[
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
