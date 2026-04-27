import { cn } from "@/lib/cn";

/* Decorative grid pattern overlay */
export function GridOverlay({ className }: { className?: string }) {
  return <div className={cn("pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60", className)} />;
}

/* Animated gradient blob */
export function Blob({ className, color = "from-primary/30 to-accent/20" }: { className?: string; color?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl bg-gradient-to-br",
        color,
        className
      )}
    />
  );
}

/* Waste category icon — uses brand colors */
export function CategoryIcon({ category, size = 28 }: { category: string; size?: number }) {
  const C = (children: React.ReactNode, fill = "#E6F4EC", stroke = "#1A6B3C") => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill={fill} />
      <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
  switch (category.toLowerCase()) {
    case "pet":
    case "plastic":
    case "pet plastic":
    case "pet bottles":
      return C(
        <>
          <path d="M12 7h8M14 7v3M18 7v3M11 12c0-1 1-2 2-2h6c1 0 2 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V12Z" />
          <path d="M11 16h10" />
        </>
      );
    case "aluminium":
    case "aluminum":
    case "cans":
    case "aluminium cans":
      return C(
        <>
          <path d="M11 8h10v16a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V8Z" />
          <path d="M11 11h10M11 14h10" />
        </>
      );
    case "paper":
    case "cardboard":
    case "mixed paper":
      return C(
        <>
          <path d="M9 7h11l3 3v15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
          <path d="M20 7v3h3M11 14h10M11 18h10M11 22h7" />
        </>
      );
    case "glass":
    case "bottles":
      return C(
        <>
          <path d="M14 7h4v4l2 3v11a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V14l2-3V7Z" />
          <path d="M13 17h6" />
        </>
      );
    case "ewaste":
    case "e-waste":
    case "electronics":
      return C(
        <>
          <rect x="9" y="11" width="14" height="11" rx="1.5" />
          <path d="M13 22v3M19 22v3M11 22h10M13 14h6M13 17h4" />
        </>
      );
    case "metal":
    case "scrap":
      return C(
        <>
          <path d="M9 22 L16 9 L23 22 Z" />
          <path d="M13 18h6" />
        </>
      );
    default:
      return C(<path d="M16 8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />);
  }
}

/* Phone mockup — shows the collector wallet preview */
export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto w-[300px] rounded-[44px] border border-white/15 bg-charcoal p-3 shadow-lift">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-charcoal" />
        <div className="overflow-hidden rounded-[34px] bg-grad-primary-deep">
          <div className="flex items-center justify-between px-5 pt-6 text-[10px] text-white/80 font-mono">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
              5G
            </span>
          </div>
          <div className="px-5 pt-6 text-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Available balance</div>
            <div className="mt-1 font-mono text-[40px] font-extrabold leading-none">
              <span className="text-accent">₦</span>48,750
            </div>
            <div className="mt-1 text-[11px] text-white/70">+₦12,400 this week</div>
          </div>
          <div className="mx-5 mt-5 grid grid-cols-3 gap-2">
            {["Cash out", "Airtime", "Bills"].map((s, i) => (
              <div key={i} className="rounded-2xl bg-white/8 px-3 py-3 text-center text-[11px] font-bold text-white">
                {s}
              </div>
            ))}
          </div>
          <div className="mx-3 mt-4 rounded-t-[24px] bg-white px-4 pb-6 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-extrabold text-charcoal">Recent earnings</span>
              <span className="text-[10px] font-bold uppercase text-primary">View all</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {[
                { name: "PET Bottles", kg: "4.2 kg", amt: "+₦840" },
                { name: "Aluminium", kg: "1.1 kg", amt: "+₦660" },
                { name: "Cardboard", kg: "8.0 kg", amt: "+₦480" },
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-cream/70 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint text-primary text-xs font-bold">
                    ♻
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-charcoal leading-tight">{r.name}</div>
                    <div className="text-[10px] text-textgray">{r.kg}</div>
                  </div>
                  <div className="font-mono text-[12px] font-bold text-success">{r.amt}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Floating mini-cards */}
      <div className="absolute -left-10 top-24 hidden rounded-2xl bg-white p-3 shadow-lift sm:flex sm:items-center sm:gap-3 animate-floaty">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success">
          ✓
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase text-textgray">Verified</div>
          <div className="text-xs font-bold">Drop #2419</div>
        </div>
      </div>
      <div className="absolute -right-6 bottom-24 hidden rounded-2xl bg-grad-gold p-3 shadow-gold sm:flex sm:items-center sm:gap-2.5 animate-floaty" style={{ animationDelay: "1.2s" }}>
        <div className="font-mono text-sm font-extrabold text-charcoal">+₦840</div>
        <div className="text-[10px] font-bold uppercase text-charcoal/70">paid</div>
      </div>
    </div>
  );
}
