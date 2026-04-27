import { useId } from "react";
import { cn } from "@/lib/cn";

/* ---------------- Sparkline ---------------- */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke = "#1A6B3C",
  fill = "rgba(26,107,60,0.12)",
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2] as const);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className}>
      <path d={area} fill={fill} />
      <path d={d} stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Bar chart (vertical) ---------------- */
export function BarChart({
  data,
  height = 200,
  color = "#1A6B3C",
  barColor,
  accent = "#D4A017",
  highlightLast = true,
  formatValue,
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  barColor?: string;
  accent?: string;
  highlightLast?: boolean;
  formatValue?: (v: number) => string;
}) {
  color = barColor ?? color;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 28);
          const isLast = i === data.length - 1;
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center justify-end">
              <div
                className="absolute -top-7 hidden rounded-md bg-charcoal px-2 py-1 text-[10px] font-bold text-white group-hover:block"
              >
                {formatValue ? formatValue(d.value) : d.value}
              </div>
              <div
                className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                style={{
                  height: h,
                  background:
                    isLast && highlightLast
                      ? `linear-gradient(180deg, ${accent}, ${accent})`
                      : `linear-gradient(180deg, ${color}, ${color}cc)`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] font-semibold uppercase tracking-wide text-textgray">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Area / line chart ---------------- */
export function AreaChart({
  data,
  height = 220,
  width = 600,
  color = "#1A6B3C",
  className,
}: {
  data: { label: string; value: number }[];
  height?: number;
  width?: number;
  color?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => [i * step, height - ((d.value - min) / range) * (height - 30) - 20] as const);
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaD = `${lineD} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full h-auto", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" x2={width} y1={height * t} y2={height * t} stroke="#E5E8EC" strokeDasharray="3 4" />
      ))}
      <path d={areaD} fill={`url(#g${id})`} />
      <path d={lineD} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ---------------- Donut chart ---------------- */
export function Donut({
  data,
  size = 160,
  thickness = 18,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r} stroke="#F4F4F7" strokeWidth={thickness} fill="none" />
        {data.map((d, i) => {
          const len = (d.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={c}
              cy={c}
              r={r}
              stroke={d.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
        {(centerValue || centerLabel) && (
          <g>
            <text x={c} y={c - 2} textAnchor="middle" className="font-display font-extrabold" fontSize="20" fill="#1C1C2E">
              {centerValue}
            </text>
            <text x={c} y={c + 16} textAnchor="middle" fontSize="10" fill="#5A6473" className="uppercase tracking-wider font-bold">
              {centerLabel}
            </text>
          </g>
        )}
      </svg>
      <ul className="flex flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="text-textgray">{d.label}</span>
            <span className="ml-auto font-mono font-bold tabular-nums">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Progress ring ---------------- */
export function ProgressRing({
  value,
  size = 92,
  thickness = 8,
  color = "#1A6B3C",
  label,
}: {
  value: number; // 0..100
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} stroke="#E5E8EC" strokeWidth={thickness} fill="none" />
        <circle
          cx={c} cy={c} r={r}
          stroke={color} strokeWidth={thickness} fill="none"
          strokeDasharray={circ} strokeDashoffset={off}
          strokeLinecap="round"
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-lg font-extrabold">{value}%</div>
        {label && <div className="text-[9px] font-bold uppercase tracking-wider text-textgray">{label}</div>}
      </div>
    </div>
  );
}

/* ---------------- Progress bar ---------------- */
export function ProgressBar({ value, max = 100, color = "#1A6B3C", label }: { value: number; max?: number; color?: string; label?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-textgray">
          <span>{label}</span>
          <span className="font-mono text-charcoal">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/8">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
