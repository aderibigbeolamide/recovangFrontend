import { useState } from "react";
import { Award, Download, FileText } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { useBrandDashboard } from "@/hooks/useBrand";
import { formatKg } from "@/lib/cn";

export default function BrandReports() {
  const { data } = useBrandDashboard();
  const [preview, setPreview] = useState<any>(null);
  if (!data) return null;

  return (
    <>
      <PageHeader
        eyebrow="Brand portal"
        title="Impact reports"
        subtitle="Quarterly sustainability certificates — download, share, or hand to your auditor."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.certificates.map((c: any) => (
          <div key={c.id} className="card overflow-hidden">
            <div className="bg-grad-primary-deep p-6 text-white">
              <Award size={28} className="text-accent" />
              <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-accent">Recovang Certificate</div>
              <div className="mt-1 font-display text-2xl font-extrabold">{c.quarter}</div>
              <div className="mt-1 text-sm text-white/70">Issued {c.issued}</div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xl font-extrabold">{formatKg(c.kg, { compact: true })}</div>
                  <div className="text-[10px] uppercase tracking-wider text-textgray">Recovered</div>
                </div>
                <StatusPill status="success" label={c.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setPreview(c)} className="btn-outline btn-sm"><FileText size={12} /> Preview</button>
                <button className="btn-primary btn-sm"><Download size={12} /> Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h3 className="text-h4">Sustainability annual report</h3>
        <p className="text-sm text-textgray">Aggregate of all four quarters — designed for board packs and ESG filings.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-outline"><Download size={14} /> 2025 annual</button>
          <button className="btn-outline">Request custom export</button>
        </div>
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={`Certificate · ${preview?.quarter ?? ""}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setPreview(null)} className="btn-outline">Close</button>
            <button className="btn-primary"><Download size={14} /> Download PDF</button>
          </>
        }
      >
        {preview && (
          <div className="rounded-3xl border-2 border-primary/20 bg-grad-mint p-8 text-center">
            <Award size={40} className="mx-auto text-accent" />
            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">Recovang sustainability certificate</div>
            <h3 className="mt-2 text-h2 font-extrabold">{data.brand}</h3>
            <p className="mt-2 text-sm text-textgray">{preview.quarter} · Issued {preview.issued}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div><div className="font-mono text-xl font-extrabold">{formatKg(preview.kg, { compact: true })}</div><div className="text-[10px] uppercase tracking-wider text-textgray">Recovered</div></div>
              <div><div className="font-mono text-xl font-extrabold">{(preview.kg * 2.4 / 1000).toFixed(1)} t</div><div className="text-[10px] uppercase tracking-wider text-textgray">CO₂ avoided</div></div>
              <div><div className="font-mono text-xl font-extrabold">#{preview.id.split("-").slice(-2).join("/")}</div><div className="text-[10px] uppercase tracking-wider text-textgray">Cert no.</div></div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
