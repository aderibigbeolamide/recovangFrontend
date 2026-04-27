import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Activity, Award, BadgeCheck, Bell, Boxes, Building2, ClipboardList, Coins, FileText, FileWarning,
  Flag, Gauge, Gift, History, LayoutGrid, MapPin, Package, PackageCheck, QrCode, Recycle, Receipt,
  Repeat, ScrollText, Settings, ShieldCheck, ShoppingCart, Sparkles, Target, Truck, Upload, User2, Users, Wallet,
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
import BlogPost from "@/pages/public/BlogPost";
import Legal from "@/pages/public/Legal";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import SettingsPage from "@/pages/_shared/Settings";

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

import BrandDashboard from "@/pages/brand/Dashboard";
import BrandCompliance from "@/pages/brand/Compliance";
import BrandPayments from "@/pages/brand/Payments";
import BrandReports from "@/pages/brand/Reports";
import BrandProfile from "@/pages/brand/Profile";

import FactoryDashboard from "@/pages/factory/Dashboard";
import FactoryMarketplace from "@/pages/factory/Marketplace";
import FactoryOrders from "@/pages/factory/Orders";
import FactoryShipments from "@/pages/factory/Shipments";
import FactoryReceipts from "@/pages/factory/Receipts";
import FactoryProfile from "@/pages/factory/Profile";

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
  { to: "/logistics/profile", label: "Profile", icon: <User2 size={15} /> },
];
const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <Activity size={15} /> },
  { to: "/admin/management", label: "Management", icon: <Users size={15} /> },
  { to: "/admin/logistics", label: "Logistics", icon: <Truck size={15} /> },
  { to: "/admin/fraud", label: "Fraud queue", icon: <ShieldCheck size={15} />, badge: 9 },
  { to: "/admin/audit-logs", label: "Audit logs", icon: <ScrollText size={15} /> },
];
const brandNav: NavItem[] = [
  { to: "/brand/dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
  { to: "/brand/compliance", label: "Compliance", icon: <Recycle size={15} /> },
  { to: "/brand/payments", label: "Payments", icon: <Coins size={15} /> },
  { to: "/brand/reports", label: "Impact reports", icon: <FileText size={15} /> },
  { to: "/brand/profile", label: "Brand profile", icon: <Building2 size={15} /> },
];
const factoryNav: NavItem[] = [
  { to: "/factory/dashboard", label: "Dashboard", icon: <Gauge size={15} /> },
  { to: "/factory/marketplace", label: "Marketplace", icon: <ShoppingCart size={15} /> },
  { to: "/factory/orders", label: "Orders", icon: <Boxes size={15} /> },
  { to: "/factory/shipments", label: "Shipments", icon: <Truck size={15} /> },
  { to: "/factory/receipts", label: "Receipts", icon: <PackageCheck size={15} /> },
  { to: "/factory/profile", label: "Plant profile", icon: <Building2 size={15} /> },
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
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="terms" element={<Legal kind="terms" />} />
              <Route path="privacy" element={<Legal kind="privacy" />} />
            </Route>

            {/* AUTH */}
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/register" element={<Register />} />
            <Route path="auth/forgot-password" element={<ForgotPassword />} />
            <Route path="auth/reset-password" element={<ResetPassword />} />
            <Route path="login" element={<Navigate to="/auth/login" replace />} />
            <Route path="register" element={<Navigate to="/auth/register" replace />} />
            <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

            {/* COLLECTOR */}
            <Route
              path="collector"
              element={<Protected role="collector"><PortalShell brand="Collector" nav={collectorNav} portalBase="/collector" /></Protected>}
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
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* AGENT */}
            <Route
              path="agent"
              element={<Protected role="agent"><PortalShell brand="Agent" nav={agentNav} portalBase="/agent" /></Protected>}
            >
              <Route index element={<Navigate to="/agent/dashboard" replace />} />
              <Route path="dashboard" element={<AgentDashboard />} />
              <Route path="verify" element={<AgentVerify />} />
              <Route path="hub" element={<AgentHub />} />
              <Route path="reports" element={<AgentReports />} />
              <Route path="xp-earnings" element={<AgentXp />} />
              <Route path="location" element={<AgentLocation />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* LOGISTICS */}
            <Route
              path="logistics"
              element={<Protected role="logistics"><PortalShell brand="Logistics" nav={logisticsNav} portalBase="/logistics" /></Protected>}
            >
              <Route index element={<Navigate to="/logistics/dashboard" replace />} />
              <Route path="dashboard" element={<LogisticsDashboard />} />
              <Route path="pickups" element={<LogisticsPickups />} />
              <Route path="fleet" element={<LogisticsFleet />} />
              <Route path="profile" element={<LogisticsProfile />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* ADMIN */}
            <Route
              path="admin"
              element={<Protected role="admin"><PortalShell brand="Admin" nav={adminNav} portalBase="/admin" /></Protected>}
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminManagement />} />
              <Route path="logistics" element={<AdminLogistics />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* BRAND */}
            <Route
              path="brand"
              element={<Protected role="brand"><PortalShell brand="Brand" nav={brandNav} portalBase="/brand" /></Protected>}
            >
              <Route index element={<Navigate to="/brand/dashboard" replace />} />
              <Route path="dashboard" element={<BrandDashboard />} />
              <Route path="compliance" element={<BrandCompliance />} />
              <Route path="payments" element={<BrandPayments />} />
              <Route path="reports" element={<BrandReports />} />
              <Route path="profile" element={<BrandProfile />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* FACTORY */}
            <Route
              path="factory"
              element={<Protected role="factory"><PortalShell brand="Factory" nav={factoryNav} portalBase="/factory" /></Protected>}
            >
              <Route index element={<Navigate to="/factory/dashboard" replace />} />
              <Route path="dashboard" element={<FactoryDashboard />} />
              <Route path="marketplace" element={<FactoryMarketplace />} />
              <Route path="orders" element={<FactoryOrders />} />
              <Route path="shipments" element={<FactoryShipments />} />
              <Route path="receipts" element={<FactoryReceipts />} />
              <Route path="profile" element={<FactoryProfile />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
