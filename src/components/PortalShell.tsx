import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { Logo, LogoMark } from "./Logo";
import { cn } from "@/lib/cn";
import { ChevronRight, LogOut, Menu, Search, Settings, X } from "lucide-react";
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
  const active = nav.find((n) => location.pathname.startsWith(n.to));
  const crumb = active?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-bordergray bg-white/95 px-3 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg border border-bordergray">
          <Menu size={18} />
        </button>
        <Link to="/" className="flex items-center"><LogoMark size={26} /></Link>
        <div className="flex items-center gap-2">
          <NotificationDropdown size="sm" />
          <AvatarMenu portalBase={portalBase} compact />
        </div>
      </header>

      <div className="flex">
        <Sidebar brand={brand} brandTone={brandTone} nav={nav} portalBase={portalBase} />

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-charcoal text-white">
              <div className="flex items-center justify-between p-5">
                <Logo variant="white" />
                <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/70 hover:text-white"><X /></button>
              </div>
              <SidebarContent brand={brand} nav={nav} portalBase={portalBase} onNav={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="min-h-screen flex-1 lg:pl-[260px]">
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

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
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
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col px-3">
      <div className="px-2 pb-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {brand} Portal
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end
            onClick={onNav}
            className={({ isActive }) => cn("sb-item", isActive && "sb-item-active")}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 group-[.sb-item-active]:bg-accent group-[.sb-item-active]:text-charcoal">
              {n.icon}
            </span>
            <span className="flex-1">{n.label}</span>
            {n.badge && (
              <span className="ml-auto rounded-full bg-accent px-1.5 py-px text-[10px] font-bold text-charcoal">{n.badge}</span>
            )}
          </NavLink>
        ))}
        <NavLink
          to={`${portalBase}/settings`}
          onClick={onNav}
          className={({ isActive }) => cn("sb-item", isActive && "sb-item-active")}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 group-[.sb-item-active]:bg-accent group-[.sb-item-active]:text-charcoal">
            <Settings size={15} />
          </span>
          <span className="flex-1">Settings</span>
        </NavLink>
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
