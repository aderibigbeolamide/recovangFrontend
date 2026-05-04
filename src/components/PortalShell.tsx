import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { Logo, LogoMark } from "./Logo";
import { cn } from "@/lib/cn";
import { ChevronRight, LogOut, Menu, Search, Settings, X, Eye, ShieldAlert } from "lucide-react";
import { useAuth } from "@/store/auth";
import { Avatar } from "./ui";
import { NotificationDropdown } from "./NotificationDropdown";
import { AvatarMenu } from "./AvatarMenu";
import { motion, AnimatePresence } from "framer-motion";

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
  const isCollector = location.pathname.startsWith("/collector");

  return (
    <div className="min-h-screen bg-cream">
      <ImpersonationBanner />
      <ApprovalBanner />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-1.5 border-b border-bordergray bg-white/95 px-3 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-bordergray text-charcoal hover:bg-cream"
        >
          <Menu size={18} />
        </button>
        <Link to="/" className="flex items-center"><LogoMark size={26} /></Link>
        <div className="flex items-center gap-1.5">
          <NotificationDropdown size="sm" />
          <AvatarMenu portalBase={portalBase} compact />
        </div>
      </header>

      <div className="flex">
        <Sidebar brand={brand} brandTone={brandTone} nav={nav} portalBase={portalBase} />

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="absolute left-0 top-0 h-full w-72 bg-charcoal text-white flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <Logo variant="white" />
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <SidebarContent brand={brand} nav={nav} portalBase={portalBase} onNav={() => setOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn(
          "min-h-screen flex-1 lg:pl-[260px] min-w-0 max-w-full overflow-hidden",
          isCollector ? "pb-20 lg:pb-0" : ""
        )}>
          {/* Desktop top bar */}
          <div className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-bordergray bg-cream/85 px-8 backdrop-blur-xl lg:flex">
            <div className="flex items-center gap-2 text-sm text-textgray">
              <span className="font-semibold text-charcoal/50">Recovang</span>
              <ChevronRight size={14} className="text-charcoal/30" />
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
            <Outlet />
          </main>
        </div>
      </div>

      {/* Collector Mobile Bottom Nav */}
      {isCollector && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[68px] items-stretch border-t border-bordergray bg-white/95 backdrop-blur-xl lg:hidden safe-pb">
          {nav.slice(0, 4).map((n) => {
            const isActive = location.pathname === n.to;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end
                className="flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-3 transition-colors"
              >
                <motion.div
                  animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                    isActive ? "bg-primary text-white shadow-glow" : "text-textgray"
                  )}
                >
                  {n.icon}
                </motion.div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", isActive ? "text-primary" : "text-textgray/70")}>
                  {n.label.split(" ")[0]}
                </span>
              </NavLink>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-3 text-textgray"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl hover:bg-cream">
              <Menu size={18} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-textgray/70">More</span>
          </button>
        </nav>
      )}
    </div>
  );
}

function Sidebar(props: { brand: string; brandTone: "primary" | "gold" | "dark"; nav: NavItem[]; portalBase: string }) {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-[260px] flex-col overflow-hidden bg-charcoal text-white lg:flex">
      <div className="absolute inset-0 bg-grid-dark opacity-15 pointer-events-none" />
      <div className="relative flex h-16 items-center border-b border-white/8 px-5">
        <Link to="/"><Logo variant="white" /></Link>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <SidebarContent {...props} />
      </div>
    </aside>
  );
}

function SidebarContent({ brand, nav, portalBase, onNav }: { brand: string; nav: NavItem[]; portalBase: string; onNav?: () => void }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isApproved = user?.isApproved || user?.role?.includes("admin");

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col px-3">
      <div className="px-2 py-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> {brand} Portal
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto pb-4 hide-scrollbar">
        {nav.map((n) => {
          const isActive = location.pathname.startsWith(n.to) || location.pathname === n.to;
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
                if (isDisabled) { e.preventDefault(); return; }
                onNav?.();
              }}
              className={({ isActive: a }) => cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                a && !isDisabled
                  ? "bg-white/14 text-white"
                  : "text-white/55 hover:bg-white/8 hover:text-white/90",
                isDisabled && "opacity-35 cursor-not-allowed"
              )}
            >
              {({ isActive: a }) => (
                <>
                  {a && !isDisabled && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                    />
                  )}
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                    a && !isDisabled ? "bg-accent text-charcoal" : "bg-white/8 text-white/60"
                  )}>
                    {n.icon}
                  </span>
                  <span className="flex-1">{n.label}</span>
                  {n.badge && (
                    <span className="ml-auto rounded-full bg-accent px-1.5 py-px text-[10px] font-bold text-charcoal">
                      {n.badge}
                    </span>
                  )}
                  {isDisabled && <ShieldAlert size={12} className="text-white/25 ml-auto" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/8 px-1 py-3">
        <NavLink
          to={`${portalBase}/settings`}
          className={({ isActive }) => cn(
            "mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
            isActive ? "bg-white/12 text-white" : "text-white/45 hover:bg-white/8 hover:text-white/80"
          )}
          onClick={onNav}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/8"><Settings size={14} /></span>
          Settings
        </NavLink>
        <div className="flex items-center gap-3 rounded-2xl bg-white/6 p-2.5">
          <Avatar letters={user?.avatarLetters ?? "GU"} tone="gold" size={36} />
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-bold text-white">{user?.name ?? "Guest"}</div>
            <div className="truncate text-[11px] text-white/50">{user?.hub ?? user?.company ?? user?.city ?? user?.email}</div>
          </div>
          <button
            onClick={() => { signOut(); window.location.href = "/"; }}
            aria-label="Sign out"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:bg-white/10 hover:text-accent transition"
          >
            <LogOut size={15} />
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
    <div className="sticky top-0 z-50 flex items-center justify-between bg-accent px-4 py-2.5 text-charcoal">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-accent shadow-lg shrink-0">
          <ShieldAlert size={14} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest block leading-none mb-0.5">Account Status</span>
          <span className="text-sm font-bold leading-tight">
            {isPendingKYC
              ? "Please complete your KYC to speed up approval."
              : "Your application is currently under review by our admin team."}
          </span>
        </div>
      </div>
      {isPendingKYC && (
        <Link to={`/${user?.role}/settings`} className="hidden rounded-full bg-charcoal px-4 py-1.5 text-xs font-bold text-white transition hover:bg-charcoal/80 sm:block shrink-0">
          Complete KYC
        </Link>
      )}
    </div>
  );
}

function ImpersonationBanner() {
  const { user, originalSession, stopImpersonating } = useAuth();
  if (!originalSession) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-between bg-charcoal px-4 py-2 text-xs font-bold text-white shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-charcoal shrink-0">
          <Eye size={12} />
        </div>
        <span>
          Viewing as <span className="text-accent underline">{user?.name}</span>
        </span>
        <span className="hidden opacity-50 sm:inline">({user?.role.toUpperCase()})</span>
        {useAuth.getState().isReadOnly && (
          <span className="ml-2 rounded-full bg-error px-2 py-0.5 text-[9px] uppercase tracking-tighter animate-pulse">
            Read-Only
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] sm:flex">
          <ShieldAlert size={10} className="text-accent" />
          Super Admin Mode
        </div>
        <button
          onClick={stopImpersonating}
          className="rounded-lg bg-error/20 px-3 py-1 text-error transition hover:bg-error/30"
        >
          Exit View
        </button>
      </div>
    </div>
  );
}
