import PortalShell from "@/components/PortalShell";
import { LayoutDashboard, ScanLine, Building2, BarChart3, Coins, MapPin } from "lucide-react";

const NAV = [
  { to: "/agent/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/agent/verify", label: "Verify", icon: <ScanLine size={18} />, badge: 7 },
  { to: "/agent/hub", label: "Hub", icon: <Building2 size={18} /> },
  { to: "/agent/reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { to: "/agent/xp-earnings", label: "XP & earnings", icon: <Coins size={18} /> },
  { to: "/agent/location", label: "Location", icon: <MapPin size={18} /> },
];

export default function AgentLayout() {
  return <PortalShell brand="Agent" nav={NAV} user={{ name: "Bola Adeyemi", subtitle: "Surulere Hub · Lagos" }} />;
}
