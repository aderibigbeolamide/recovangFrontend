import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, User2, HelpCircle } from "lucide-react";
import { useAuth } from "@/store/auth";
import { Avatar } from "./ui";
import { cn } from "@/lib/cn";

export function AvatarMenu({ portalBase, compact = false }: { portalBase: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function doSignOut() {
    setOpen(false);
    // Navigate FIRST so we don't briefly hit the /auth/login redirect
    // when Protected re-renders without a token.
    nav("/", { replace: true });
    setTimeout(() => signOut(), 0);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-bordergray bg-white pl-1 pr-3 transition hover:border-charcoal/30",
          compact ? "h-9" : "h-10"
        )}
      >
        <Avatar letters={user?.avatarLetters ?? "?"} tone="gold" size={compact ? 28 : 32} />
        <span className="hidden flex-col items-start sm:flex">
          <span className="text-xs font-extrabold leading-tight text-charcoal">{user?.name ?? "Guest"}</span>
          <span className="text-[10px] uppercase tracking-wider text-textgray leading-tight">{user?.role}</span>
        </span>
        <ChevronDown size={14} className="text-textgray" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-bordergray bg-white shadow-lift animate-slideUp">
          <div className="flex items-center gap-3 border-b border-bordergray bg-cream/50 p-4">
            <Avatar letters={user?.avatarLetters ?? "?"} tone="gold" size={42} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold text-charcoal">{user?.name}</div>
              <div className="truncate text-[11px] text-textgray">{user?.email}</div>
            </div>
          </div>
          <div className="p-1.5">
            <Link
              to={`${portalBase}/settings`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-cream"
            >
              <Settings size={15} className="text-textgray" /> Settings
            </Link>
            <Link
              to={`${portalBase}/settings#profile`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-cream"
            >
              <User2 size={15} className="text-textgray" /> My profile
            </Link>
            <a
              href="mailto:hello@recovang.com"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-charcoal hover:bg-cream"
            >
              <HelpCircle size={15} className="text-textgray" /> Help & support
            </a>
          </div>
          <div className="border-t border-bordergray p-1.5">
            <button
              onClick={doSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-error hover:bg-error-50"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
