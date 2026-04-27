import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, Twitter, Facebook, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/waste-categories", label: "Categories" },
  { to: "/find-hub", label: "Find a hub" },
  { to: "/about", label: "Company" },
  { to: "/blog", label: "Blog" },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Announcement strip */}
      <div className="bg-charcoal py-2 text-center text-[11px] font-bold uppercase tracking-widest text-white/80">
        <span className="text-accent">●</span> Live in Lagos · Abuja · Port Harcourt &nbsp; · &nbsp;
        <span className="text-white">Now paying ₦200/kg for PET plastic</span>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all",
          scrolled ? "border-b border-bordergray bg-cream/85 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between sm:h-20">
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
                    "rounded-full px-3.5 py-2 text-sm font-bold text-charcoal/75 transition-colors hover:text-charcoal",
                    isActive && "bg-charcoal/5 text-charcoal"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/auth/login" className="btn-ghost btn-sm">
              Sign in
            </Link>
            <Link to="/auth/register" className="btn-primary btn-sm">
              Start earning <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white p-6 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-base font-bold text-charcoal/80",
                      isActive && "bg-mint text-primary"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-2">
              <Link to="/auth/login" className="btn-outline">Sign in</Link>
              <Link to="/auth/register" className="btn-primary">Start earning <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page py-20">
        {/* Top mega CTA */}
        <div className="mb-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-display font-extrabold leading-[0.95] text-balance">
              Your <span className="text-accent">rubbish</span> is somebody's <span className="text-accent">raw material.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/70">
              Join 62,000 Africans cashing out every drop. Bank, airtime, bills — paid in seconds.
            </p>
          </div>
          <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/auth/register" className="btn-gold btn-lg">Start earning <ArrowRight size={16} /></Link>
              <Link to="/find-hub" className="btn-outline btn-lg !border-white/20 !bg-white/5 !text-white hover:!border-accent hover:!text-accent">
                Find a hub
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="white" />
            <p className="mt-4 max-w-sm text-sm text-white/70">
              Recover. Earn. Sustain. Recovang turns waste into instant cash across Africa — built for low-end phones, weak networks, and real African neighborhoods. Born and built in Nigeria.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> 12 Adeola Odeku, Victoria Island, Lagos</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-accent" /> hello@recovang.com</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-accent" /> +234 700 RECOVANG</div>
            </div>
          </div>

          <FooterColumn title="Product" links={[
            ["For collectors", "/how-it-works"],
            ["Find a hub", "/find-hub"],
            ["Waste categories", "/waste-categories"],
            ["Become an agent", "/auth/register"],
            ["Logistics partners", "/auth/register"],
          ]} />
          <FooterColumn title="Company" links={[
            ["About Recovang", "/about"],
            ["Blog & stories", "/blog"],
            ["Press kit", "/about"],
            ["Careers", "/about"],
            ["Contact", "/contact"],
          ]} />
          <FooterColumn title="Help" links={[
            ["FAQ", "/faq"],
            ["Disputes & refunds", "/contact"],
            ["Brand partnerships", "/contact"],
            ["Terms of service", "/terms"],
            ["Privacy policy", "/privacy"],
          ]} />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            © 2026 Recovang Technologies Ltd. RC 1948-2204. Lagos · Abuja · Port Harcourt.
          </p>
          <div className="flex items-center gap-3 text-white/60">
            <a className="rounded-full p-2 hover:bg-white/10 hover:text-accent" href="#" aria-label="Twitter"><Twitter size={16} /></a>
            <a className="rounded-full p-2 hover:bg-white/10 hover:text-accent" href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <a className="rounded-full p-2 hover:bg-white/10 hover:text-accent" href="#" aria-label="Facebook"><Facebook size={16} /></a>
            <a className="rounded-full p-2 hover:bg-white/10 hover:text-accent" href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="lg:col-span-2">
      <div className="mb-4 text-[11px] font-bold uppercase tracking-widest text-accent">{title}</div>
      <ul className="space-y-2.5 text-sm text-white/75">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-white">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
