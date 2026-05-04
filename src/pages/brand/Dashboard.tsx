import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, CheckCircle2, Coins, Download, FileText, Recycle, ShieldCheck, Target } from "lucide-react";
import { KPICard, PageHeader, StatusPill, DashboardSkeleton } from "@/components/ui";
import { AreaChart, ProgressBar, ProgressRing } from "@/components/charts";
import { useBrandDashboard } from "@/hooks/useBrand";
import { formatNaira, formatKg, formatNumber } from "@/lib/cn";
import { Modal } from "@/components/Modal";
import { RecoveryDetailDrawer } from "@/components/RecoveryDetailDrawer";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
});

export default function BrandDashboard() {
  const { data } = useBrandDashboard();
  const [showPay, setShowPay] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  if (!data) return <DashboardSkeleton />;

  const isApproved = data.isApproved;
  const monthly = Array.isArray(data?.monthly) ? data.monthly : [];
  const byCategory = Array.isArray(data?.byCategory) ? data.byCategory : [];
  const recentRecoveries = Array.isArray(data?.recentRecoveries) ? data.recentRecoveries : [];

  const fyTarget = data?.fyTarget || 0;
  const recovered = data?.recovered ?? 0;
  const compliancePct = fyTarget > 0 ? Math.round((recovered / fyTarget) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow={`Brand portal · ${data.brand}`}
        title="EPR compliance overview"
        subtitle={
          isApproved
            ? `You're at ${compliancePct}% of your ${data.quarter} recovery target. Keep the momentum going.`
            : "Your brand application is pending. Please complete KYC to set EPR targets."
        }
        actions={
          <>
            <Link to="/brand/reports" className="btn-outline"><Download size={14} /> Download report</Link>
            <button onClick={() => setShowPay(true)} className="btn-primary"><Coins size={14} /> Pay compliance fee</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard index={0} label="FY recovery target" value={formatKg(fyTarget)} sub="2026 financial year" icon={Target} variant="primary" />
        <KPICard index={1} label="Recovered to date" value={formatKg(recovered)} sub={`${compliancePct}% of target`} icon={Recycle} variant="gold" trend={{ value: "+12% MoM", direction: "up" }} />
        <KPICard index={2} label="Outstanding fee" value={formatNaira(data?.outstandingFee ?? 0)} sub={data?.quarter ?? "Current Quarter"} icon={Coins} />
        <KPICard index={3} label="Certificates issued" value={`${data?.certIssued ?? 0}`} sub="Quarterly · audited" icon={Award} variant="dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <motion.div {...fadeUp(0.15)} className="card p-6 lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Monthly recovery (kg)</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-mono text-3xl font-extrabold">
                  {formatKg(monthly?.[monthly?.length - 1]?.value ?? 0)}
                </div>
                <span className="badge-success">+ 22% vs LM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-cream p-1 text-xs font-bold">
              {["6M", "1Y", "All"].map((p, i) => (
                <button key={p} className={`rounded-full px-3 py-1 transition ${i === 0 ? "bg-white text-charcoal shadow-soft" : "text-textgray hover:text-charcoal"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <AreaChart data={monthly} height={220} />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="card p-5 lg:col-span-4 overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-widest text-textgray mb-4">{data.quarter} compliance</div>
          <div className="flex items-center gap-5">
            <ProgressRing value={compliancePct} size={120} thickness={12} color="#1A6B3C" label="of target" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-2xl font-extrabold">{formatKg(data.recovered)}</div>
              <p className="mt-1 text-[11px] text-textgray leading-tight max-w-full">
                of {formatKg(data.fyTarget)} target. Stay above 75% to qualify for Gold Tier rebate.
              </p>
            </div>
          </div>
          <div className="mt-4">
            {compliancePct < 100 ? (
              <div className="rounded-2xl bg-cream p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">To reach 100%</div>
                <div className="mt-1 font-mono text-lg font-extrabold text-charcoal">
                  {formatKg(Math.max(0, fyTarget - recovered))}
                </div>
                <div className="text-xs text-textgray">remaining this quarter</div>
              </div>
            ) : (
              <div className="rounded-2xl bg-success-50 p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <div>
                  <div className="text-sm font-extrabold text-success">Target achieved!</div>
                  <div className="text-xs text-success/80">Gold Tier rebate unlocked</div>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowCert(true)} className="btn-outline mt-4 w-full">
            <FileText size={14} /> Preview certificate
          </button>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div {...fadeUp(0.25)} className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Recovery by category</h3>
            <p className="text-sm text-textgray">FY 2026 progress against EPR commitments</p>
          </div>
          <Link to="/brand/compliance" className="text-sm font-bold text-primary">
            Full report <ArrowRight size={12} className="inline" />
          </Link>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {byCategory.map((c: any, i: number) => {
            const pct = Math.round((c.recovered / (c.target || 1)) * 100);
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="rounded-2xl border border-bordergray p-4 sm:p-5 transition hover:border-primary/20 hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-extrabold truncate">{c.name}</div>
                  <StatusPill status={pct >= 75 ? "success" : pct >= 50 ? "warning" : "error"} label={`${pct}%`} />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="font-mono text-xl sm:text-2xl font-extrabold">
                    {formatKg(c.recovered, { compact: true })}
                  </div>
                  <div className="text-[11px] text-textgray">/ {formatKg(c.target, { compact: true })}</div>
                </div>
                <div className="mt-4">
                  <ProgressBar value={c.recovered} max={c.target} color={c.color} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent recoveries */}
      <motion.div {...fadeUp(0.3)} className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-bordergray p-6">
          <div>
            <h3 className="text-h4">Recent verified recoveries</h3>
            <p className="text-sm text-textgray">Each row is a photographed, weighed and signed drop.</p>
          </div>
          <Link to="/brand/compliance" className="btn-ghost btn-sm">View all <ArrowRight size={12} /></Link>
        </div>
        <div className="tbl-container">
          <table className="tbl">
            <thead>
              <tr><th>Drop ID</th><th>Date</th><th>Hub</th><th>Category</th><th>Weight</th><th className="text-right">EPR value</th></tr>
            </thead>
            <tbody>
              {recentRecoveries?.slice(0, 6).map((r: any) => (
                <tr key={r.id} onClick={() => setSelectedSubmission(r.id)} className="cursor-pointer">
                  <td className="font-mono text-xs">{r.id}</td>
                  <td className="text-textgray">{r.date}</td>
                  <td className="font-bold">{r.hub}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5">
                      <Recycle size={12} className="text-primary" /> {r.category}
                    </span>
                  </td>
                  <td className="font-mono">{formatNumber(r.kg)} kg</td>
                  <td className="text-right"><span className="money">{formatNaira(r.value)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal
        open={showPay}
        onClose={() => setShowPay(false)}
        title="Pay compliance fee"
        description={`Outstanding for ${data.quarter}: ${formatNaira(data.outstandingFee)}`}
        footer={
          <>
            <button onClick={() => setShowPay(false)} className="btn-outline">Cancel</button>
            <Link to="/brand/payments" onClick={() => setShowPay(false)} className="btn-primary">
              Pay with Paystack <ArrowRight size={14} />
            </Link>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-2xl bg-mint p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Amount</div>
            <div className="mt-1 font-mono text-3xl font-extrabold text-charcoal">{formatNaira(data.outstandingFee)}</div>
          </div>
          <ul className="space-y-2 text-sm text-textgray">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success" /> Real-time receipt on the audit ledger</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success" /> Quarterly certificate auto-issued at 100%</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Paystack PCI-DSS payment</li>
          </ul>
        </div>
      </Modal>

      <Modal
        open={showCert}
        onClose={() => setShowCert(false)}
        title="Quarterly certificate preview"
        description={`Sustainability certificate · ${data.quarter}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setShowCert(false)} className="btn-outline">Close</button>
            <button className="btn-primary"><Download size={14} /> Download PDF</button>
          </>
        }
      >
        <div className="rounded-3xl border-2 border-primary/20 bg-grad-mint p-8 text-center">
          <Award size={36} className="mx-auto text-accent" />
          <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">Recovang sustainability certificate</div>
          <h3 className="mt-2 text-h2 font-extrabold">{data.brand}</h3>
          <p className="mt-2 text-sm text-textgray">{data.quarter}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div><div className="font-mono text-xl font-extrabold">{formatKg(data.recovered, { compact: true })}</div><div className="text-[10px] uppercase tracking-wider text-textgray">Recovered</div></div>
            <div><div className="font-mono text-xl font-extrabold">{compliancePct}%</div><div className="text-[10px] uppercase tracking-wider text-textgray">Of target</div></div>
            <div><div className="font-mono text-xl font-extrabold">{data.certIssued + 1}</div><div className="text-[10px] uppercase tracking-wider text-textgray">Cert no.</div></div>
          </div>
        </div>
      </Modal>

      <RecoveryDetailDrawer
        submissionId={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </>
  );
}
