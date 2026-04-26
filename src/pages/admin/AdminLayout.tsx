import PortalShell from "@/components/PortalShell";
import { LayoutDashboard, Users, Truck, ShieldAlert, FileSearch } from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/admin/management", label: "Management", icon: <Users size={18} /> },
  { to: "/admin/logistics", label: "Logistics", icon: <Truck size={18} /> },
  { to: "/admin/fraud", label: "Fraud queue", icon: <ShieldAlert size={18} />, badge: 9 },
  { to: "/admin/audit-logs", label: "Audit logs", icon: <FileSearch size={18} /> },
];

export default function AdminLayout() {
  return <PortalShell brand="Admin" nav={NAV} user={{ name: "Recovang Admin", subtitle: "Platform operations" }} />;
}
