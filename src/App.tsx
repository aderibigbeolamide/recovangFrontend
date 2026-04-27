import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Activity, Award, BadgeCheck, Bell, Building2, ClipboardList, Coins, FileWarning,
  Flag, Gauge, Gift, History, LayoutGrid, MapPin, Package, QrCode, Receipt,
  Repeat, ScrollText, Settings, ShieldCheck, Sparkles, Truck, Upload, Users, Wallet,
} from "lucide-react";

import PublicLayout from "@/components/PublicLayout";
import PortalShell, { type NavItem } from "@/components/PortalShell";
import { useAuth } from "@/store/auth";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import HowItWorks from "@/pages/public/HowItWorks";
import WasteCategories from "@/pages/public/WasteCategories";
import FindHub from "@/pages/public/FindHub";
import Contact from "@/pages/public/Contact";
import FAQ from "@/pages/public/FAQ";
import Blog from "@/pages/public/Blog";
import Legal from "@/pages/public/Legal";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import CollectorDashboard from "@/pages/collector/Dashboard";
import CollectorSubmit from "@/pages/collector/Submit";
import CollectorHistory from "@/pages/collector/History";
import CollectorWithdraw from "@/pages/collector/Withdraw";
import CollectorLeaderboard from "@/pages/collector/Leaderboard";
import CollectorBadges from "@/pages/collector/Badges";
import CollectorReferrals from "@/pages/collector/Referrals";
import CollectorStreaks from "@/pages/collector/Streaks";
import CollectorDisputes from "@/pages/collector/Disputes";
import CollectorNotifications from "@/pages/collector/Notifications";

import AgentDashboard from "@/pages/agent/Dashboard";
import AgentVerify from "@/pages/agent/Verify";
import AgentHub from "@/pages/agent/Hub";
import AgentReports from "@/pages/agent/Reports";
import AgentXp from "@/pages/agent/XpEarnings";
import AgentLocation from "@/pages/agent/Location";

import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsPickups from "@/pages/logistics/Pickups";
import LogisticsFleet from "@/pages/logistics/Fleet";
import LogisticsProfile from "@/pages/logistics/Profile";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminManagement from "@/pages/admin/Management";
import AdminLogistics from "@/pages/admin/Logistics";
import AdminFraud from "@/pages/admin/Fraud";
import AdminAuditLogs from "@/pages/admin/AuditLogs";

const qc = new QueryClient();

const collectorNav: NavItem[] = [
  { to: "/collector/dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
  { to: "/collector/submit", label: "Submit waste", icon: <Upload size={15} /> },
  { to: "/collector/history", label: "History", icon: <History size={15} /> },
  { to: "/collector/withdraw", label: "Withdraw", icon: <Wallet size={15} /> },
  { to: "/collector/leaderboard", label: "Leaderboard", icon: <Award size={15} /> },
  { to: "/collector/badges", label: "Badges", icon: <BadgeCheck size={15} /> },
  { to: "/collector/referrals", label: "Referrals", icon: <Gift size={15} /> },
  { to: "/collector/streaks", label: "Streaks", icon: <Sparkles size={15} /> },
  { to: "/collector/disputes", label: "Disputes", icon: <FileWarning size={15} /> },
  { to: "/collector/notifications", label: "Notifications", icon: <Bell size={15} />, badge: 3 },
];
const agentNav: NavItem[] = [
  { to: "/agent/dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
  { to: "/agent/verify", label: "Verify drops", icon: <QrCode size={15} />, badge: 7 },
  { to: "/agent/hub", label: "My hub", icon: <Building2 size={15} /> },
  { to: "/agent/reports", label: "Reports", icon: <ClipboardList size={15} /> },
  { to: "/agent/xp-earnings", label: "XP & earnings", icon: <Coins size={15} /> },
  { to: "/agent/location", label: "Location", icon: <MapPin size={15} /> },
];
const logisticsNav: NavItem[] = [
  { to: "/logistics/dashboard", label: "Dashboard", icon: <Gauge size={15} /> },
  { to: "/logistics/pickups", label: "Pickups", icon: <Package size={15} />, badge: 4 },
  { to: "/logistics/fleet", label: "Fleet", icon: <Truck size={15} /> },
  { to: "/logistics/profile", label: "Profile", icon: <Settings size={15} /> },
];
const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <Activity size={15} /> },
  { to: "/admin/management", label: "Management", icon: <Users size={15} /> },
  { to: "/admin/logistics", label: "Logistics", icon: <Truck size={15} /> },
  { to: "/admin/fraud", label: "Fraud queue", icon: <ShieldCheck size={15} />, badge: 9 },
  { to: "/admin/audit-logs", label: "Audit logs", icon: <ScrollText size={15} /> },
];

function Protected({ role, children }: { role: string; children: JSX.Element }) {
  const { token, user } = useAuth();
  if (!token || !user || user.role !== role) return <Navigate to="/auth/login" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            {/* PUBLIC */}
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="waste-categories" element={<WasteCategories />} />
              <Route path="find-hub" element={<FindHub />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="blog" element={<Blog />} />
              <Route path="terms" element={<Legal kind="terms" />} />
              <Route path="privacy" element={<Legal kind="privacy" />} />
            </Route>

            {/* AUTH */}
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/register" element={<Register />} />
            <Route path="login" element={<Navigate to="/auth/login" replace />} />
            <Route path="register" element={<Navigate to="/auth/register" replace />} />

            {/* COLLECTOR */}
            <Route
              path="collector"
              element={<Protected role="collector"><PortalShell brand="Collector" nav={collectorNav} /></Protected>}
            >
              <Route index element={<Navigate to="/collector/dashboard" replace />} />
              <Route path="dashboard" element={<CollectorDashboard />} />
              <Route path="submit" element={<CollectorSubmit />} />
              <Route path="history" element={<CollectorHistory />} />
              <Route path="withdraw" element={<CollectorWithdraw />} />
              <Route path="leaderboard" element={<CollectorLeaderboard />} />
              <Route path="badges" element={<CollectorBadges />} />
              <Route path="referrals" element={<CollectorReferrals />} />
              <Route path="streaks" element={<CollectorStreaks />} />
              <Route path="disputes" element={<CollectorDisputes />} />
              <Route path="notifications" element={<CollectorNotifications />} />
            </Route>

            {/* AGENT */}
            <Route
              path="agent"
              element={<Protected role="agent"><PortalShell brand="Agent" nav={agentNav} /></Protected>}
            >
              <Route index element={<Navigate to="/agent/dashboard" replace />} />
              <Route path="dashboard" element={<AgentDashboard />} />
              <Route path="verify" element={<AgentVerify />} />
              <Route path="hub" element={<AgentHub />} />
              <Route path="reports" element={<AgentReports />} />
              <Route path="xp-earnings" element={<AgentXp />} />
              <Route path="location" element={<AgentLocation />} />
            </Route>

            {/* LOGISTICS */}
            <Route
              path="logistics"
              element={<Protected role="logistics"><PortalShell brand="Logistics" nav={logisticsNav} /></Protected>}
            >
              <Route index element={<Navigate to="/logistics/dashboard" replace />} />
              <Route path="dashboard" element={<LogisticsDashboard />} />
              <Route path="pickups" element={<LogisticsPickups />} />
              <Route path="fleet" element={<LogisticsFleet />} />
              <Route path="profile" element={<LogisticsProfile />} />
            </Route>

            {/* ADMIN */}
            <Route
              path="admin"
              element={<Protected role="admin"><PortalShell brand="Admin" nav={adminNav} /></Protected>}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminManagement />} />
              <Route path="logistics" element={<AdminLogistics />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
