import { useState } from "react";
import { Activity, AlertTriangle, ArrowUpRight, Calendar, ChevronDown, Download, FileWarning, Filter, Globe, Key, Lock, Search, Settings, Shield, Trash2, User, UserCheck } from "lucide-react";
import { Avatar, KPICard, PageHeader } from "@/components/ui";

const LOGS = [
  { time: "10:42:18", actor: "Sade Ijeoma", role: "Admin", action: "config.update", target: "Pricing engine · PET kg", from: "180", to: "200", ip: "102.89.41.7", severity: "info" },
  { time: "10:38:02", actor: "Bola Akande", role: "Agent", action: "drop.verify", target: "RX-2419", from: "—", to: "₦840 paid", ip: "197.210.84.11", severity: "info" },
  { time: "10:31:55", actor: "ML system", role: "System", action: "fraud.flag", target: "Drop RX-2419", from: "—", to: "Held for review", ip: "—", severity: "warning" },
  { time: "10:24:18", actor: "Tunde Bakare", role: "Logistics", action: "pickup.accept", target: "PK-2419", from: "—", to: "Truck LG-LD221 dispatched", ip: "105.112.4.21", severity: "info" },
  { time: "10:18:42", actor: "Ronke Bello", role: "Admin", action: "user.suspend", target: "Joy Eze (C-1882)", from: "active", to: "suspended", ip: "102.89.41.18", severity: "critical" },
  { time: "10:12:08", actor: "System", role: "System", action: "auth.failed", target: "fake-user@gmail.com", from: "—", to: "5 failed attempts blocked", ip: "41.220.18.4", severity: "warning" },
  { time: "10:04:33", actor: "Oluwa Tomiwa", role: "Admin", action: "role.grant", target: "Femi Olu", from: "Junior agent", to: "Lead agent · Hub LG-204", ip: "102.89.41.7", severity: "info" },
  { time: "09:58:12", actor: "Sade Ijeoma", role: "Admin", action: "config.update", target: "Streak bonus tier", from: "₦200", to: "₦500", ip: "102.89.41.7", severity: "info" },
  { time: "09:52:00", actor: "System", role: "System", action: "backup.complete", target: "DB snapshot daily", from: "—", to: "412GB → S3", ip: "—", severity: "info" },
  { time: "09:41:21", actor: "Ronke Bello", role: "Admin", action: "withdrawal.approve", target: "WD-2419 (₦120,000)", from: "pending", to: "completed", ip: "102.89.41.18", severity: "info" },
  { time: "09:32:18", actor: "ML system", role: "System", action: "model.retrain", target: "Fraud detector v2.4.2", from: "v2.4.1", to: "v2.4.2 (+1.2% precision)", ip: "—", severity: "info" },
  { time: "09:18:52", actor: "Sade Ijeoma", role: "Admin", action: "policy.publish", target: "Privacy policy v3.2", from: "v3.1", to: "v3.2", ip: "102.89.41.7", severity: "info" },
];

const SEV: Record<string, { c: string; l: string }> = {
  info: { c: "bg-cream text-textgray", l: "Info" },
  warning: { c: "bg-warning-50 text-warning", l: "Warning" },
  critical: { c: "bg-error-50 text-error", l: "Critical" },
};

const ACTION_ICON: Record<string, any> = {
  "config.update": Settings,
  "drop.verify": UserCheck,
  "fraud.flag": Shield,
  "pickup.accept": ArrowUpRight,
  "user.suspend": Lock,
  "auth.failed": Key,
  "role.grant": User,
  "backup.complete": FileWarning,
  "withdrawal.approve": Activity,
  "model.retrain": Settings,
  "policy.publish": FileWarning,
};

export default function AdminAuditLogs() {
  const [active, setActive] = useState(LOGS[0]);
  return (
    <>
      <PageHeader
        eyebrow="Audit logs"
        title="Every action, every change, forever"
        subtitle="Tamper-evident log of every action taken across Recovang. NDPR-compliant. Auditable for 7 years."
        actions={
          <>
            <button className="btn-outline"><Download size={14} /> Export logs</button>
            <button className="btn-primary"><Search size={14} /> Advanced search</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard label="Events today" value="14,820" sub="98% routine" icon={Activity} variant="primary" />
        <KPICard label="Critical events" value="3" sub="All resolved" icon={AlertTriangle} variant="gold" />
        <KPICard label="Failed auths" value="142" sub="Auto-blocked" icon={Lock} variant="dark" />
        <KPICard label="Log integrity" value="100%" sub="SHA-256 chain valid" icon={Shield} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Filters & table */}
        <div className="card overflow-hidden lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 border-b border-bordergray bg-cream/40 p-4">
            <div className="relative min-w-[200px] flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
              <input className="input pl-10" placeholder="Search actor, action, target…" />
            </div>
            <button className="btn-outline btn-sm"><Calendar size={12} /> Today</button>
            <button className="btn-outline btn-sm"><Filter size={12} /> All severities</button>
            <button className="btn-outline btn-sm">All actors <ChevronDown size={11} /></button>
          </div>
          <table className="tbl">
            <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Severity</th></tr></thead>
            <tbody>
              {LOGS.map((l, i) => {
                const sev = SEV[l.severity];
                const Icon = ACTION_ICON[l.action] ?? Activity;
                return (
                  <tr key={i} onClick={() => setActive(l)} className={`cursor-pointer ${active.time === l.time ? "bg-mint/30" : ""}`}>
                    <td className="font-mono text-xs text-textgray">{l.time}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={l.actor} size={26} />
                        <div>
                          <div className="text-sm font-bold leading-tight">{l.actor}</div>
                          <div className="text-[10px] text-textgray">{l.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="inline-flex items-center gap-2 rounded-full bg-cream px-2.5 py-1">
                        <Icon size={12} className="text-primary" />
                        <span className="font-mono text-xs font-bold">{l.action}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{l.target}</td>
                    <td><span className={`badge ${sev.c}`}>{sev.l}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-4">
          <div className="card sticky top-24 overflow-hidden">
            <div className="border-b border-bordergray p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Event detail</div>
              <h3 className="mt-2 text-h4">{active.action}</h3>
              <p className="font-mono text-xs text-textgray">{active.time} · 24 April 2026</p>
            </div>
            <div className="space-y-4 p-6">
              <Detail label="Actor" value={`${active.actor} (${active.role})`} icon={User} />
              <Detail label="Target" value={active.target} icon={Settings} />
              <Detail label="From" value={active.from} mono />
              <Detail label="To" value={active.to} mono highlight />
              <Detail label="IP address" value={active.ip} mono icon={Globe} />
            </div>
            <div className="border-t border-bordergray bg-cream/40 p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Cryptographic hash</div>
              <div className="mt-1 truncate font-mono text-[11px] text-charcoal">0x4f29ab8e3c1d9a72fe2b48817d6a39c5</div>
              <button className="btn-outline btn-sm mt-3 w-full">Verify integrity</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value, mono, highlight, icon: Icon }: { label: string; value: string; mono?: boolean; highlight?: boolean; icon?: any }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-textgray">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className={`mt-1 ${mono ? "font-mono" : ""} ${highlight ? "rounded-lg bg-mint/40 px-2 py-1 text-primary font-bold" : "text-charcoal font-semibold"} text-sm break-words`}>
        {value}
      </div>
    </div>
  );
}
