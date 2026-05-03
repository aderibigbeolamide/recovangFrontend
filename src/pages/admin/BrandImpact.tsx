import { useState } from "react";
import { 
  Building2, Leaf, Trees, Wind, Zap, BarChart3, 
  Download, Globe, Target, ArrowUpRight, CheckCircle2,
  Calendar, MapPin
} from "lucide-react";
import { PageHeader, KPICard, StatusPill } from "@/components/ui";
import { useAdminBrands, useBrandSustainability } from "@/hooks/useAdmin";
import { formatKg, formatNumber } from "@/lib/cn";

export default function BrandImpact() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const { data: brandsData, isLoading: brandsLoading } = useAdminBrands();
  const { data: report, isLoading } = useBrandSustainability(selectedBrandId);

  const brands = Array.isArray(brandsData) ? brandsData : [];

  return (
    <>
      <PageHeader
        eyebrow="EPR Governance"
        title="Brand Impact & Transparency"
        subtitle="Real-time environmental impact tracking and sustainability reporting for EPR partners."
        actions={
          <button className="btn-outline gap-2">
            <Download size={14} /> Export Impact PDF
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        {/* Brand Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-textgray mb-4">Partner Brands</h3>
            <div className="space-y-2">
              {brandsLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-charcoal/5 animate-pulse rounded-2xl" />)}
                </div>
              ) : brands.length === 0 ? (
                <div className="p-4 text-center text-xs text-textgray italic">No partner brands found.</div>
              ) : (
                brands.map((brand: any) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandId(brand.id)}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                      selectedBrandId === brand.id 
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                        : "border-bordergray hover:border-primary/30 bg-white"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-charcoal text-cream grid place-items-center font-black uppercase">
                      {brand.companyName?.substring(0, 2) || "BR"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-charcoal leading-tight truncate">{brand.companyName}</div>
                      <div className="text-[10px] font-bold text-textgray uppercase truncate">{brand.industry || "General"}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card p-5 bg-primary text-cream border-0">
            <Globe className="mb-4 opacity-50" size={32} />
            <h4 className="font-black text-sm uppercase mb-2">Global Impact Goal</h4>
            <p className="text-xs text-cream/70 leading-relaxed font-medium mb-4">
              Recovang is on track to recover 50,000 tons of ocean-bound plastic by 2027.
            </p>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-3/4" />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-black uppercase">
              <span>37,500T Collected</span>
              <span>75%</span>
            </div>
          </div>
        </div>

        {/* Main Impact View */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedBrandId ? (
            <div className="card h-[500px] grid place-items-center border-dashed border-2 bg-cream/5">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full grid place-items-center mx-auto">
                  <Target size={32} />
                </div>
                <h3 className="font-black text-xl text-charcoal">Select a Brand to View Impact</h3>
                <p className="text-sm text-textgray max-w-xs mx-auto">Choose an EPR partner from the left to generate their real-time sustainability report.</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-charcoal/5 rounded-3xl" />)}
              </div>
              <div className="h-[400px] bg-charcoal/5 rounded-3xl" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <KPICard 
                  label="Waste Recovered" 
                  value={formatKg(report?.impactMetrics?.totalKgRecovered || 0)} 
                  sub="Ocean-bound plastic" 
                  icon={Leaf} 
                  variant="primary" 
                />
                <KPICard 
                  label="CO2 Avoided" 
                  value={formatKg(report?.impactMetrics?.co2AvoidedKg || 0)} 
                  sub="Emissions offset" 
                  icon={Wind} 
                  variant="dark" 
                />
                <KPICard 
                  label="Community Impact" 
                  value={`₦${formatNumber(report?.financialSummary?.totalInvestedNGN * 0.85 || 0, { compact: true })}`} 
                  sub="Estimated direct payout" 
                  icon={Zap} 
                  variant="gold" 
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6">
                  <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <BarChart3 size={20} className="text-primary" /> Environmental Equivalents
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-cream/20 border border-bordergray">
                      <div className="h-12 w-12 rounded-2xl bg-success/10 text-success grid place-items-center shadow-sm">
                        <Trees size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-charcoal">{formatNumber(report?.impactMetrics?.treesEquivalent || 0)}</div>
                        <div className="text-[10px] font-black uppercase text-textgray tracking-widest">Trees planted equivalent</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-cream/20 border border-bordergray">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center shadow-sm">
                        <Zap size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-charcoal">{formatNumber(report?.impactMetrics?.householdsPowered || 0)}</div>
                        <div className="text-[10px] font-black uppercase text-textgray tracking-widest">Households powered for 1yr</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-6 bg-charcoal text-cream border-0">
                  <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-tight text-cream">
                    <ArrowUpRight size={20} className="text-success" /> Investment Efficiency
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Total Contribution</div>
                        <div className="text-2xl font-black">₦{formatNumber(report?.financialSummary?.totalInvestedNGN || 0)}</div>
                      </div>
                      <StatusPill 
                        status={report?.impactMetrics?.totalKgRecovered > 0 ? "success" : "warning"} 
                        label={report?.impactMetrics?.totalKgRecovered > 0 ? "FULLY UTILIZED" : "ALLOCATED"} 
                      />
                    </div>
                    <div className="pt-4">
                      <div className="text-[10px] font-bold text-white/40 uppercase mb-2">Collection Efficiency (KG per ₦1,000)</div>
                      <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-gold">
                          {report?.financialSummary?.efficiencyRatio ? (Number(report.financialSummary.efficiencyRatio) * 1000).toFixed(1) : "0.0"}kg
                        </div>
                        <div className="text-xs font-medium text-white/40 mb-1">per ₦1,000 spent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tight">
                    <MapPin size={20} className="text-primary" /> Regional Impact Distribution
                  </h3>
                  <button className="text-xs font-bold text-primary flex items-center gap-1">
                    Download Full Audit <Download size={12} />
                  </button>
                </div>
                <div className="space-y-4">
                  {!report?.regionalDistribution || report.regionalDistribution.length === 0 ? (
                    <div className="py-8 text-center text-xs text-textgray italic">No regional recovery data available for this partner.</div>
                  ) : (
                    report.regionalDistribution.map((region: any, i: number) => (
                      <div key={region.state} className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span>{region.state}</span>
                          <span className="text-textgray">{formatNumber(region.kg)}kg</span>
                        </div>
                        <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                          <div className={`h-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-gold" : "bg-charcoal"}`} style={{ width: `${region.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
