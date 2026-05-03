import { useState, useMemo, useEffect } from "react";
import { Camera, MapPin, X, QrCode } from "lucide-react";
import { PageHeader, Section } from "@/components/ui";
import { CategoryIcon } from "@/components/illustrations";
import { formatNaira } from "@/lib/cn";
import { usePricing, useNearbyHubs, useSubmitWaste } from "@/hooks/useCollector";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function StepSection({ n, title, children }: { n: string, title: string, children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-bordergray bg-cream/40 px-6 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-charcoal text-[13px] font-extrabold text-white">{n}</div>
        <h3 className="text-base font-extrabold text-charcoal">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function CollectorSubmit() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  
  // Try to get user location for better hub matching
  useEffect(() => {
    let mounted = true;
    if ("geolocation" in navigator) {
      const timeoutId = setTimeout(() => {
        if (mounted && !coords) {
          setCoords({ lat: 6.5244, lng: 3.3792 }); // Timeout fallback to Lagos
        }
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId);
          if (mounted) setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          clearTimeout(timeoutId);
          if (mounted) setCoords({ lat: 6.5244, lng: 3.3792 });
        }
      );
    } else {
      setCoords({ lat: 6.5244, lng: 3.3792 });
    }
    return () => { mounted = false; };
  }, []);

  const { data: pricing, isLoading: loadingPricing } = usePricing();
  const { data: hubs, isLoading: loadingHubs } = useNearbyHubs(coords?.lat, coords?.lng); 
  const submitWaste = useSubmitWaste();

  const [pick, setPick] = useState<Record<string, { qty: number, id: string, rate: number, categoryName: string }>>({});
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [ticket, setTicket] = useState<{ id: string, ref: string } | null>(null);

  // Deduplicate pricing by category ID to avoid showing same material twice
  const uniquePricing = useMemo(() => {
    if (!pricing) return [];
    const seen = new Set();
    const result: any[] = [];
    for (const p of pricing) {
      if (p.category && !seen.has(p.category.id)) {
        seen.add(p.category.id);
        result.push(p);
      }
    }
    return result;
  }, [pricing]);

  const total = useMemo(() => Object.values(pick).reduce((s, item) => s + item.qty * item.rate, 0), [pick]);
  const totalKg = useMemo(() => Object.values(pick).reduce((s, item) => s + item.qty, 0), [pick]);

  function setKg(categoryId: string, v: number, rate: number, categoryName: string) {
    if (v < 0) return;
    setPick((prev) => {
      if (v === 0) {
        const { [categoryId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [categoryId]: { qty: v, id: categoryId, rate, categoryName } };
    });
  }

  const handleSubmit = async () => {
    if (Object.keys(pick).length === 0) return toast.error("Please add at least one material");
    if (!selectedHub) return toast.error("Please select a hub");

    try {
      const payload = {
        hubId: selectedHub,
        items: Object.values(pick).map(p => ({
          wasteCategoryId: p.id,
          quantity: p.qty
        }))
      };
      
      const res = await submitWaste.mutateAsync(payload);
      setTicket({ id: res.data.id, ref: res.data.id.slice(0, 8).toUpperCase() });
      toast.success("Drop ticket generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit waste");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="New submission"
        title="Submit your waste"
        subtitle="Pre-record your drop on the way to the hub. Agent will verify the weights when you arrive."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* Step 1 — categories */}
          <StepSection n="1" title="Pick categories & estimated weights">
            {loadingPricing ? (
              <div className="py-10 text-center text-textgray animate-pulse font-bold">Loading materials...</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {uniquePricing.map((p: any) => {
                  const c = p.category;
                  const active = pick[c.id] !== undefined;
                  const rate = p.collectorPayoutRate / 100;
                  return (
                    <div key={c.id} className={`rounded-2xl border p-4 transition ${active ? "border-primary bg-mint/40" : "border-bordergray bg-white hover:border-primary/40"}`}>
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={c.name} size={42} />
                        <div className="flex-1">
                          <div className="text-sm font-extrabold">{c.name}</div>
                          <div className="text-[11px] text-textgray">{formatNaira(rate)}/kg · {c.unit || "kg"}</div>
                        </div>
                        {active ? (
                          <button onClick={() => { const np = { ...pick }; delete np[c.id]; setPick(np); }} className="grid h-7 w-7 place-items-center rounded-full bg-error-50 text-error">
                            <X size={14} />
                          </button>
                        ) : (
                          <button onClick={() => setKg(c.id, 1, rate, c.name)} className="btn-outline btn-sm">Add</button>
                        )}
                      </div>
                      {active && (
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => setKg(c.id, pick[c.id].qty - 0.5, rate, c.name)} className="grid h-9 w-9 place-items-center rounded-xl border border-bordergray bg-white">−</button>
                          <input
                            value={pick[c.id].qty}
                            onChange={(e) => setKg(c.id, parseFloat(e.target.value) || 0, rate, c.name)}
                            step="0.1"
                            type="number"
                            className="input h-9 flex-1 text-center font-mono font-bold"
                          />
                          <span className="text-sm font-bold text-textgray">kg</span>
                          <button onClick={() => setKg(c.id, pick[c.id].qty + 0.5, rate, c.name)} className="grid h-9 w-9 place-items-center rounded-xl border border-bordergray bg-white">+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </StepSection>

          {/* Step 2 — hub */}
          <StepSection n="2" title="Pick a hub">
            {loadingHubs ? (
              <div className="py-10 text-center text-textgray animate-pulse font-bold">Finding nearby hubs...</div>
            ) : (
              <div className="grid gap-2">
                {hubs?.map((h: any) => (
                  <label key={h.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${selectedHub === h.id ? "border-primary bg-mint/40" : "border-bordergray hover:border-primary/40"}`}>
                    <input type="radio" name="hub" checked={selectedHub === h.id} onChange={() => setSelectedHub(h.id)} className="accent-primary" />
                    <MapPin size={16} className="text-primary" />
                    <span className="flex-1 text-sm font-bold">{h.name} <span className="ml-1 text-xs text-textgray">({h.distance?.toFixed(1) || "?"} km)</span></span>
                    <span className="badge-mint">Open</span>
                  </label>
                ))}
                {(!hubs || hubs.length === 0) && (
                  <div className="p-10 text-center text-textgray border-2 border-dashed border-bordergray rounded-2xl">
                    <p className="font-bold">No hubs found within 10km of your location.</p>
                    <button className="text-primary font-bold mt-2 underline" onClick={() => setCoords({ lat: 6.5244, lng: 3.3792 })}>Try default location (Lagos)</button>
                  </div>
                )}
              </div>
            )}
          </StepSection>

          {/* Step 3 — photo */}
          <StepSection n="3" title="Add a photo (optional)">
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="card flex h-32 flex-col items-center justify-center gap-2 border-dashed text-textgray hover:border-primary hover:text-primary">
                <Camera size={24} />
                <span className="text-sm font-bold">Take photo</span>
              </button>
              <div className="card flex h-32 items-center justify-center border-bordergray bg-white/50 text-textgray">
                <span className="text-xs">No photos selected</span>
              </div>
            </div>
          </StepSection>
        </div>

        {/* Right — summary card with QR */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-dark p-7">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Estimated payout</div>
            <div className="mt-2 font-mono text-4xl font-extrabold text-white">
              <span className="text-accent">₦</span>{total.toLocaleString("en-NG")}
            </div>
            <div className="mt-1 text-xs text-white/70">Final amount confirmed at hub</div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="space-y-2 text-sm">
                {Object.values(pick).map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-white/80">{item.qty} kg · {item.categoryName}</span>
                    <span className="font-mono font-bold">{formatNaira(item.qty * item.rate)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                  <span className="font-extrabold">Total ({totalKg.toFixed(1)} kg)</span>
                  <span className="font-mono font-extrabold text-accent">{formatNaira(total)}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={Object.keys(pick).length === 0 || !selectedHub || submitWaste.isPending}
              className="btn-gold mt-6 w-full py-4 text-base shadow-lift active:scale-95 disabled:opacity-50"
            >
              {submitWaste.isPending ? "Generating ticket..." : "Generate drop ticket →"}
            </button>
            <div className="mt-4 text-center text-[11px] text-white/50">Final payout based on calibrated hub scale</div>
          </div>

          {ticket && (
            <div className="mt-6 card p-6 text-center animate-lift">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-mint text-primary">
                <QrCode size={32} />
              </div>
              <div className="text-h4 font-extrabold">Ticket #{ticket.ref}</div>
              <p className="mt-2 text-sm text-textgray text-balance">Show this code at the hub to verify your drop.</p>
              <button onClick={() => navigate("/collector/history")} className="btn-primary mt-6 w-full">View in history</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


