import PortalShell from "@/components/PortalShell";
import {
  LayoutDashboard,
  Upload,
  History,
  Wallet,
  Trophy,
  Award,
  Users,
  Flame,
  AlertTriangle,
  Bell,
} from "lucide-react";

const NAV = [
  { to: "/collector/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/collector/submit", label: "Submit waste", icon: <Upload size={18} /> },
  { to: "/collector/history", label: "History", icon: <History size={18} /> },
  { to: "/collector/withdraw", label: "Withdraw", icon: <Wallet size={18} /> },
  { to: "/collector/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  { to: "/collector/badges", label: "Badges", icon: <Award size={18} /> },
  { to: "/collector/referrals", label: "Referrals", icon: <Users size={18} /> },
  { to: "/collector/streaks", label: "Streaks", icon: <Flame size={18} /> },
  { to: "/collector/disputes", label: "Disputes", icon: <AlertTriangle size={18} /> },
  { to: "/collector/notifications", label: "Notifications", icon: <Bell size={18} />, badge: 3 },
];

export default function CollectorLayout() {
  return (
    <PortalShell
      brand="Collector"
      nav={NAV}
      user={{ name: "Adaeze Nwosu", subtitle: "Surulere · Lagos" }}
    />
  );
}
