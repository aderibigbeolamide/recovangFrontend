import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { formatKg } from "@/lib/cn";
import { Leaf, Recycle, ShieldCheck, Award } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function PublicBrandImpact() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["public", "brand", slug],
    queryFn: async () => {
      const res = await api.get(`/public/brand-impact/${slug}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-primary">Verifying impact…</div>;
  if (!data) return <div className="flex h-screen items-center justify-center font-bold text-error">Brand not found.</div>;

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex h-16 items-center justify-center border-b border-bordergray bg-white px-6">
        <Logo />
      </header>
      
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-grad-primary shadow-xl">
                <Award size={40} className="text-accent" />
            </div>
            <h1 className="mt-6 text-h1 font-black text-charcoal">{data.brand}</h1>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mint px-4 py-1.5 text-sm font-bold text-primary">
                <ShieldCheck size={16} /> Verified Sustainable Brand
            </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="card p-8 text-center">
                <div className="text-4xl font-black text-primary">{formatKg(data.recovered)}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-textgray">Total Waste Recovered</div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-success">
                    <Recycle size={14} /> Since {new Date(data.joinedDate).getFullYear()}
                </div>
            </div>
            <div className="card p-8 text-center">
                <div className="text-4xl font-black text-accent">{data.impact.co2SavedKg} kg</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-textgray">CO₂ Emissions Avoided</div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-primary">
                    <Leaf size={14} /> Environmental Offset
                </div>
            </div>
        </div>

        <div className="mt-12 rounded-3xl bg-grad-primary-deep p-8 text-center text-white">
            <h2 className="text-h3 font-black">Our commitment</h2>
            <p className="mt-4 leading-relaxed text-white/70">
                {data.brand} is a proud partner of Recovang. Every product we put into the market is backed by a verified recovery commitment, ensuring that our environmental footprint is neutralized through community-led recycling hubs across Nigeria.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
                <div>
                    <div className="text-xl font-bold">{data.impact.treesEquivalent}</div>
                    <div className="text-[10px] uppercase opacity-60">Trees Saved</div>
                </div>
                <div>
                    <div className="text-xl font-bold">{data.impact.oceanPlasticPreventedKg}kg</div>
                    <div className="text-[10px] uppercase opacity-60">Ocean Plastic Prev.</div>
                </div>
                <div>
                    <div className="text-xl font-bold">{data.impact.landfillDivertedKg}kg</div>
                    <div className="text-[10px] uppercase opacity-60">Landfill Diverted</div>
                </div>
            </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-sm text-textgray">Powered by <strong>Recovang Transparency Engine</strong></p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-textgray/50">Blockchain Verified · Audited · Community Driven</p>
        </div>
      </main>
    </div>
  );
}
