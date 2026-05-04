import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Instagram, Twitter, Facebook, Linkedin, MapPin, Mail, Phone, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { useAuth } from "@/store/auth";
import { Avatar } from "./ui";

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
  const { user, token } = useAuth();
  const dashboardHref = user ? `/${user.role}/dashboard` : "/auth/login";
  const isAuthed = Boolean(token && user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isDark = pathname === "/" && !scrolled;

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal py-2 text-center text-[11px] font-bold uppercase tracking-widest text-white/70">
        <span className="text-accent animate-pulse">●</span>
        {" "}Live in Lagos · Abuja · Port Harcourt{" "}
        <span className="hidden sm:inline">·{" "}</span>
        <span className="text-white hidden sm:inline">Now paying ₦200/kg for PET plastic</span>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-bordergray/50 bg-cream/90 backdrop-blur-2xl shadow-soft"
            : isDark
            ? "bg-transparent border-b border-transparent"
            : "bg-cream/95 backdrop-blur-xl"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between sm:h-20">
          <Link to="/" className="flex items-center group" aria-label="Recovang home">
            <Logo variant={isDark ? "white" : undefined} />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                    isDark
                      ? "text-white/75 hover:text-white hover:bg-white/10"
                      : "text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5",
                    isActive && (isDark ? "bg-white/12 text-white" : "bg-charcoal/6 text-charcoal")
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthed ? (
              <>
                <Link to={dashboardHref} className="btn-primary btn-sm">
                  <LayoutGrid size={14} /> Dashboard
                </Link>
                <Link
                  to={dashboardHref}
                  className={cn(
                    "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition",
                    isDark
                      ? "border-white/20 bg-white/10 hover:bg-white/20"
                      : "border-bordergray bg-white hover:border-charcoal/20"
                  )}
                  aria-label={`Continue as ${user?.name}`}
                >
                  <Avatar letters={user?.avatarLetters ?? "?"} tone="gold" size={28} />
                  <span className={cn("hidden text-xs font-bold xl:inline", isDark ? "text-white" : "text-charcoal")}>
                    {user?.name?.split(" ")[0] ?? "Account"}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={cn(
                    "btn btn-sm rounded-full px-4 py-2 font-semibold transition",
                    isDark ? "text-white/80 hover:bg-white/10 hover:text-white" : "btn-ghost"
                  )}
                >
                  Sign in
                </Link>
                <Link to="/auth/register" className="btn-primary btn-sm">
                  Start earning <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          <button
            className={cn(
              "lg:hidden grid h-10 w-10 place-items-center rounded-xl border transition",
              isDark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-bordergray bg-white text-charcoal"
            )}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-lift flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-bordergray">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-bordergray text-charcoal hover:bg-cream"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-2xl px-4 py-3.5 text-base font-semibold transition",
                        isActive ? "bg-mint text-primary" : "text-charcoal/75 hover:bg-cream hover:text-charcoal"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-5 border-t border-bordergray space-y-2">
                {isAuthed ? (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl bg-cream p-3 mb-3">
                      <Avatar letters={user?.avatarLetters ?? "?"} tone="gold" size={40} />
                      <div>
                        <div className="font-bold text-charcoal">{user?.name}</div>
                        <div className="text-xs text-textgray capitalize">{user?.role} account</div>
                      </div>
                    </div>
                    <Link to={dashboardHref} className="btn-primary w-full">
                      <LayoutGrid size={14} /> Open my dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="btn-outline w-full">Sign in</Link>
                    <Link to="/auth/register" className="btn-primary w-full">Start earning <ArrowRight size={14} /></Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=1400&q=50"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-8"
        />
        <div className="relative container-page py-20">
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-display font-extrabold leading-[0.95] text-balance">
                Your <span className="text-gradient-gold">rubbish</span> is somebody's <span className="text-gradient-gold">raw material.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/60">
                Join 62,000 Africans cashing out every drop. Bank, airtime, bills — paid in seconds.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/auth/register" className="btn-gold btn-lg">Start earning <ArrowRight size={16} /></Link>
                <Link
                  to="/find-hub"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-7 py-4 text-base font-bold text-white transition hover:bg-white/15"
                >
                  Find a hub
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 pt-12 border-t border-white/10">
            <div className="lg:col-span-4">
              <Logo variant="white" />
              <p className="mt-4 max-w-sm text-sm text-white/55 leading-relaxed">
                Recover. Earn. Sustain. Recovang turns waste into instant cash across Africa — built for low-end phones, weak networks, and real African neighborhoods.
              </p>
              <div className="mt-6 space-y-2.5 text-sm text-white/55">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-accent shrink-0" /> 12 Adeola Odeku, Victoria Island, Lagos</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-accent shrink-0" /> hello@recovang.com</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-accent shrink-0" /> +234 700 RECOVANG</div>
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

          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
            <p className="text-xs text-white/35">
              © 2026 Recovang Technologies Ltd. RC 1948-2204. Lagos · Abuja · Port Harcourt.
            </p>
            <div className="flex items-center gap-2 text-white/40">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 transition hover:border-accent/40 hover:text-accent hover:bg-white/5">
                  <Icon size={15} />
                </a>
              ))}
            </div>
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
      <ul className="space-y-2.5 text-sm text-white/50">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-white transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
