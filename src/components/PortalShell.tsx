import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { Logo, LogoMark } from "./Logo";
import { cn } from "@/lib/cn";
import { Bell, ChevronRight, Menu, Search, X } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

interface PortalShellProps {
  brand: string;
  brandColor?: string;
  nav: NavItem[];
  user: { name: string; subtitle?: string; avatar?: string };
}

export default function PortalShell({ brand, nav, user }: PortalShellProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const active = nav.find((n) => location.pathname.startsWith(n.to));
  return (
    <div className="min-h-screen bg-offwhite">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-bordergray bg-white/90 px-4 backdrop-blur-xl lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <Link to="/" className="flex items-center">
          <LogoMark size={28} />
        </Link>
        <button aria-label="Notifications" className="relative">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-bordergray bg-white lg:flex lg:flex-col">
          <div className="flex h-16 items-center px-5">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>
          <div className="px-3">
            <span className="badge bg-mint text-primary">{brand} Portal</span>
          </div>
          <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn("nav-link", isActive && "nav-link-active")
                }
              >
                <span className="text-current">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent-500">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-bordergray p-3">
            <UserChip user={user} />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between px-5">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <div className="px-3">
                <span className="badge bg-mint text-primary">{brand} Portal</span>
              </div>
              <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn("nav-link", isActive && "nav-link-active")
                    }
                  >
                    <span className="text-current">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent-500">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-bordergray p-3">
                <UserChip user={user} />
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Desktop top bar */}
          <header className="hidden h-16 items-center justify-between border-b border-bordergray bg-white/70 px-6 backdrop-blur-xl lg:flex">
            <Breadcrumbs current={active?.label ?? brand} />
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
                <input
                  className="input w-72 pl-9 py-2"
                  placeholder="Search submissions, hubs, users..."
                />
              </div>
              <button
                aria-label="Notifications"
                className="relative rounded-xl border border-bordergray bg-white p-2.5 hover:border-primary"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function UserChip({ user }: { user: { name: string; subtitle?: string; avatar?: string } }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-mint">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-extrabold text-white">
        {user.avatar ?? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-charcoal">{user.name}</p>
        {user.subtitle && <p className="truncate text-xs text-textgray">{user.subtitle}</p>}
      </div>
      <Link to="/auth/login" className="text-xs font-semibold text-textgray hover:text-error">
        Sign out
      </Link>
    </div>
  );
}

function Breadcrumbs({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-textgray hover:text-primary">
        Recovang
      </Link>
      <ChevronRight size={14} className="text-textgray" />
      <span className="font-semibold text-charcoal">{current}</span>
    </div>
  );
}
