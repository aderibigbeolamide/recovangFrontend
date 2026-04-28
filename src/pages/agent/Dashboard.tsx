import { Link } from "react-router-dom";
import { ArrowRight, Building2, ClipboardList, Coins, Package, QrCode, Scale, ShieldCheck, Sparkles, TrendingUp, UserCheck, Users } from "lucide-react";
import { Avatar, KPICard, PageHeader, StatusPill } from "@/components/ui";
import { AreaChart, BarChart, Donut, ProgressRing } from "@/components/charts";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";

const QUEUE = [
  { id: "RX-2419", name: "Adaeze Nwosu", cat: "PET Bottles", est: 4.2, eta: "5 min away" },
  { id: "RX-2418", name: "Tunde Bello", cat: "Cardboard", est: 6.0, eta: "12 min away" },
  { id: "RX-2417", name: "Maryam Sani", cat: "Aluminium Cans", est: 1.8, eta: "Just arrived" },
  { id: "RX-2416", name: "Joy Eze", cat: "Mixed Paper", est: 3.4, eta: "8 min away" },
];

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

export default function AgentDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Agent portal · Surulere Hub · Lagos"
        title="Good morning, Bola."
        subtitle="7 collectors in queue. Hub is at 78% capacity. Truck arriving 11:30am for HDPE pickup."
        actions={
          <>
            <Link to="/agent/reports" className="btn-outline"><ClipboardList size={14} /> Daily report</Link>
            <Link to="/agent/verify" className="btn-primary"><QrCode size={14} /> Verify drops</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Today's drops" value="184" sub="+ 22 vs yesterday" icon={Package} variant="primary" />
        <KPICard label="Today's volume" value="642 kg" sub="HDPE & PET dominant" icon={Scale} />
        <KPICard label="Hub commission" value="₦14,820" sub="₦88,400 paid to collectors" icon={Coins} variant="gold" />
        <KPICard label="Active collectors" value="62" sub="9 first-time today" icon={Users} variant="dark" />
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
            {QUEUE.map((q) => (
              <div key={q.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6 sm:py-4">
                <div className="flex items-center gap-4 flex-1">
                  <CategoryIcon category={q.cat} size={42} />
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
                  <button className="btn-primary btn-sm flex-1 sm:flex-none">Verify</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div className="card-dark p-6 lg:col-span-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Hub capacity</div>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={78} color="#D4A017" label="full" />
            <div className="flex-1">
              <div className="font-display text-2xl font-extrabold text-white">2,418 / 3,100 kg</div>
              <p className="mt-1 text-xs text-white/70">22% capacity remaining. Pickup truck #LG-LD221 arriving 11:30am.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { v: "942", l: "PET (kg)" },
              { v: "684", l: "Cardboard" },
              { v: "318", l: "Aluminium" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="font-mono text-lg font-extrabold text-white">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
          <button className="btn-gold mt-5 w-full">Request early pickup</button>
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
          <p className="mb-5 text-sm text-textgray">Today's intake</p>
          <Donut
            centerValue="642 kg"
            centerLabel="Today"
            data={[
              { label: "PET Plastic", value: 248, color: "#1A6B3C" },
              { label: "Cardboard", value: 184, color: "#D4A017" },
              { label: "Aluminium", value: 96, color: "#3F9264" },
              { label: "Paper", value: 78, color: "#1C1C2E" },
              { label: "Glass", value: 36, color: "#A0A4AB" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
