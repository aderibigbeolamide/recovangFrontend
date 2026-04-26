import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/waste-categories", label: "Categories" },
  { to: "/find-hub", label: "Find a hub" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-bordergray/60 bg-white/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Recovang home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold text-charcoal/80 transition-colors hover:text-primary",
                    isActive && "text-primary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/auth/login" className="btn-ghost">
              Sign in
            </Link>
            <Link to="/auth/register" className="btn-primary">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
          <button
            className="rounded-xl p-2 lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-bordergray/60 bg-white lg:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2.5 text-sm font-semibold text-charcoal/80 hover:bg-mint hover:text-primary",
                      isActive && "bg-mint text-primary"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/auth/login" className="btn-outline" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/auth/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-bordergray bg-charcoal text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="white" />
          <p className="mt-3 text-sm text-white/60">
            Recover. Earn. Sustain. Turn waste into real naira across Nigeria — and soon, across Africa.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            ["How it works", "/how-it-works"],
            ["Categories", "/waste-categories"],
            ["Find a hub", "/find-hub"],
            ["Blog", "/blog"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About", "/about"],
            ["Contact", "/contact"],
            ["FAQ", "/faq"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} Recovang. All rights reserved.</span>
          <span>Made in Lagos · Built for Nigeria · Scaling across Africa</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-white/60 hover:text-accent">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
