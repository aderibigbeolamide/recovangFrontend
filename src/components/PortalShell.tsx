import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { Logo, LogoMark } from "./Logo";
import { cn } from "@/lib/cn";
import { ChevronRight, LogOut, Menu, Search, Settings, X, Eye, ShieldAlert } from "lucide-react";
import { useAuth } from "@/store/auth";
import { Avatar } from "./ui";
import { NotificationDropdown } from "./NotificationDropdown";
import { AvatarMenu } from "./AvatarMenu";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

interface PortalShellProps {
  brand: string;
  brandTone?: "primary" | "gold" | "dark";
  nav: NavItem[];
  portalBase: string;
}

export default function PortalShell({ brand, nav, brandTone = "primary", portalBase }: PortalShellProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isReadOnly } = useAuth();
  
  const active = nav.find((n) => location.pathname.startsWith(n.to));
  const crumb = active?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-cream">
      <ImpersonationBanner />
      <ApprovalBanner />
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-1.5 border-b border-bordergray bg-white/95 px-2.5 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-bordergray">
          <Menu size={18} />
        </button>
        <Link to="/" className="flex items-center"><LogoMark size={24} /></Link>
        <div className="flex items-center gap-1.5">
          <NotificationDropdown size="sm" />
          <AvatarMenu portalBase={portalBase} compact />
        </div>
      </header>

      <div className="flex">
        <Sidebar brand={brand} brandTone={brandTone} nav={nav} portalBase={portalBase} />

        {/* Mobile drawer */}
        {(open || location.pathname.startsWith("/collector")) && (
          <div className={cn(
            "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur" onClick={() => setOpen(false)} />
            <div className={cn(
              "absolute left-0 top-0 h-full w-72 bg-charcoal text-white transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full"
            )}>
              <div className="flex items-center justify-between p-5">
                <Logo variant="white" />
                <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/70 hover:text-white"><X /></button>
              </div>
              <SidebarContent brand={brand} nav={nav} portalBase={portalBase} onNav={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className={cn(
          "min-h-screen flex-1 lg:pl-[260px] min-w-0 max-w-full overflow-hidden",
          location.pathname.startsWith("/collector") ? "pb-20 lg:pb-0" : ""
        )}>
          {/* Top bar (desktop) */}
          <div className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-bordergray bg-cream/85 px-8 backdrop-blur-xl lg:flex">
            <div className="flex items-center gap-2 text-sm text-textgray">
              <span className="font-semibold">Recovang</span>
              <ChevronRight size={14} />
              <span className="font-bold text-charcoal">{crumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray" />
                <input className="input h-10 pl-10 text-sm" placeholder="Search submissions, hubs, users…" />
              </div>
              <NotificationDropdown />
              <AvatarMenu portalBase={portalBase} />
            </div>
          </div>

          <main className="p-3 sm:p-6 lg:p-8 relative">
            {isReadOnly && (
                <div className="absolute inset-0 z-[100] cursor-not-allowed">
                    {/* Visual overlay for read-only if needed */}
                </div>
            )}
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav (Collector Only) */}
      {location.pathname.startsWith("/collector") && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t border-bordergray bg-white/95 px-4 pb-safe backdrop-blur lg:hidden">
          {nav.slice(0, 4).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors",
                isActive ? "text-primary" : "text-textgray"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl transition-all",
                location.pathname === n.to ? "bg-mint text-primary" : "text-textgray hover:bg-cream"
              )}>
                {n.icon}
              </div>
              <span>{n.label.split(" ")[0]}</span>
            </NavLink>
          ))}
          <button 
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-textgray"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-cream">
              <Menu size={18} />
            </div>
            <span>More</span>
          </button>
        </nav>
      )}
    </div>
  );
}

function Sidebar(props: { brand: string; brandTone: "primary" | "gold" | "dark"; nav: NavItem[]; portalBase: string }) {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-[260px] flex-col bg-charcoal text-white lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link to="/"><Logo variant="white" /></Link>
      </div>
      <SidebarContent {...props} />
    </aside>
  );
}

function SidebarContent({ brand, nav, portalBase, onNav }: { brand: string; nav: NavItem[]; portalBase: string; onNav?: () => void }) {
  const { user, signOut } = useAuth();
  const isApproved = user?.isApproved || user?.role?.includes("admin");

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col px-3">
      <div className="px-2 pb-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {brand} Portal
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
        {nav.map((n) => {
          const isDisabled = !isApproved && (
            n.label.toLowerCase().includes("submit") || 
            n.label.toLowerCase().includes("withdraw") || 
            n.label.toLowerCase().includes("verify") ||
            n.label.toLowerCase().includes("marketplace")
          );

          return (
            <NavLink
              key={n.to}
              to={isDisabled ? "#" : n.to}
              end
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                  return;
                }
                onNav?.();
              }}
              className={({ isActive }) => cn(
                "sb-item", 
                isActive && !isDisabled && "sb-item-active",
                isDisabled && "opacity-40 cursor-not-allowed grayscale"
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 group-[.sb-item-active]:bg-accent group-[.sb-item-active]:text-charcoal">
                {n.icon}
              </span>
              <span className="flex-1">{n.label}</span>
              {n.badge && (
                <span className="ml-auto rounded-full bg-accent px-1.5 py-px text-[10px] font-bold text-charcoal">{n.badge}</span>
              )}
              {isDisabled && <ShieldAlert size={12} className="text-white/30" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-1 py-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5">
          <Avatar letters={user?.avatarLetters ?? "GU"} tone="gold" size={36} />
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-bold text-white">{user?.name ?? "Guest"}</div>
            <div className="truncate text-[11px] text-white/60">{user?.hub ?? user?.company ?? user?.city ?? user?.email}</div>
          </div>
          <button onClick={() => { signOut(); window.location.href = "/"; }} aria-label="Sign out" className="text-white/60 hover:text-accent">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalBanner() {
  const { user } = useAuth();
  if (user?.isApproved || user?.role?.includes("admin")) return null;

  const isPendingKYC = user?.kycStatus === "PENDING";

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-accent px-4 py-3 text-charcoal">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-accent shadow-lg">
          <ShieldAlert size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-tighter">Account Status</span>
          <span className="text-sm font-bold leading-tight">
            {isPendingKYC 
              ? "Your application is pending. Please complete your KYC to speed up approval." 
              : "Your application is currently under review by our admin team."}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isPendingKYC && (
          <Link to={`/${user?.role}/settings`} className="hidden rounded-full bg-charcoal px-4 py-1.5 text-xs font-bold text-white shadow-xl transition hover:scale-105 sm:block">
            Complete KYC
          </Link>
        )}
      </div>
    </div>
  );
}

function ImpersonationBanner() {
  const { user, originalSession, stopImpersonating } = useAuth();
  if (!originalSession) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-between bg-charcoal px-4 py-2 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-charcoal">
          <Eye size={12} />
        </div>
        <span>
          Viewing platform as <span className="text-accent underline">{user?.name}</span>
        </span>
        <span className="hidden opacity-50 sm:inline">({user?.role.toUpperCase()})</span>
        {useAuth.getState().isReadOnly && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-[9px] uppercase tracking-tighter text-white animate-pulse">
                Read-Only Mode
            </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] sm:flex">
          <ShieldAlert size={10} className="text-accent" />
          <span>Super Admin Mode Active</span>
        </div>
        <button 
          onClick={stopImpersonating}
          className="rounded-lg bg-red-500/20 px-3 py-1 text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
        >
          Exit View
        </button>
      </div>
    </div>
  );
}
