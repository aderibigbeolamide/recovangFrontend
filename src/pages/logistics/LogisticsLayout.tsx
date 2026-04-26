import PortalShell from "@/components/PortalShell";
import { LayoutDashboard, Truck, Users, User } from "lucide-react";

const NAV = [
  { to: "/logistics/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/logistics/pickups", label: "Pickups", icon: <Truck size={18} />, badge: 4 },
  { to: "/logistics/fleet", label: "Fleet", icon: <Users size={18} /> },
  { to: "/logistics/profile", label: "Profile", icon: <User size={18} /> },
];

export default function LogisticsLayout() {
  return <PortalShell brand="Logistics" nav={NAV} user={{ name: "Kunle Logistics", subtitle: "Lagos · Ogun · Oyo" }} />;
}
