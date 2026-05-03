import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Activity, Award, BadgeCheck, Bell, Boxes, Building2, ClipboardList, Coins, FileText, FileWarning,
  Flag, Gauge, Gift, History, LayoutGrid, Leaf, MapPin, Package, PackageCheck, QrCode, Recycle, Receipt,
  Repeat, ScrollText, Settings, Settings2, ShieldCheck, ShoppingCart, Sparkles, Target, Truck, Upload, User2, Users, Wallet,
} from "lucide-react";

import PublicLayout from "@/components/PublicLayout";
import PortalShell, { type NavItem } from "@/components/PortalShell";
import { useAuth } from "@/store/auth";
import { PERMISSIONS } from "@/constants/permissions";

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
import BrandImpact from "@/pages/public/BrandImpact";

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
import AdminPricing from "@/pages/admin/Pricing";
import AdminPayouts from "@/pages/admin/Payouts";
import AdminSettings from "@/pages/admin/Settings";
import AdminBrandImpact from "@/pages/admin/BrandImpact";

import BrandDashboard from "@/pages/brand/Dashboard";
import BrandCompliance from "@/pages/brand/Compliance";
import BrandPayments from "@/pages/brand/Payments";
import BrandReports from "@/pages/brand/Reports";
import BrandProfile from "@/pages/brand/Profile";
import BrandLeaderboard from "@/pages/brand/Leaderboard";

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
  { to: "/collector/notifications", label: "Notifications", icon: <Bell size={15} /> },
];
const agentNav: NavItem[] = [
  { to: "/agent/dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
  { to: "/agent/verify", label: "Verify drops", icon: <QrCode size={15} /> },
  { to: "/agent/hub", label: "My hub", icon: <Building2 size={15} /> },
  { to: "/agent/reports", label: "Reports", icon: <ClipboardList size={15} /> },
  { to: "/agent/xp-earnings", label: "XP & earnings", icon: <Coins size={15} /> },
  { to: "/agent/location", label: "Location", icon: <MapPin size={15} /> },
];
const logisticsNav: NavItem[] = [
  { to: "/logistics/dashboard", label: "Dashboard", icon: <Gauge size={15} /> },
  { to: "/logistics/pickups", label: "Pickups", icon: <Package size={15} /> },
  { to: "/logistics/fleet", label: "Fleet", icon: <Truck size={15} /> },
  { to: "/logistics/profile", label: "Profile", icon: <User2 size={15} /> },
];
const getAdminNav = (user: any, portalBase: string): NavItem[] => {
  const isSuper = user?.role?.toLowerCase() === "super_admin";
  const permissions = user?.permissions || [];
  const has = (p: string) => isSuper || permissions.includes(p) || permissions.includes("ALL");

  const nav: NavItem[] = [
    { to: `${portalBase}/dashboard`, label: "Dashboard", icon: <Activity size={15} /> },
  ];

  if (has(PERMISSIONS.USERS_VIEW) || has(PERMISSIONS.USERS_MANAGE) || has(PERMISSIONS.HUBS_VIEW) || has(PERMISSIONS.HUBS_MANAGE) || has("MANAGE_USERS") || has("MANAGE_HUBS")) {
    nav.push({ to: `${portalBase}/management`, label: "Management", icon: <Users size={15} /> });
  }

  if (has(PERMISSIONS.LOGISTICS_MANAGE) || has(PERMISSIONS.HUBS_MANAGE) || has("MANAGE_LOGISTICS") || has("MANAGE_HUBS")) {
    nav.push({ to: `${portalBase}/logistics`, label: "Logistics", icon: <Truck size={15} /> });
  }

  if (has(PERMISSIONS.FINANCE_VIEW) || has(PERMISSIONS.FINANCE_PAYOUTS) || has("MANAGE_FINANCE")) {
    nav.push({ to: `${portalBase}/payouts`, label: "Payout queue", icon: <Wallet size={15} /> });
    nav.push({ to: `${portalBase}/brand-impact`, label: "Brand impact", icon: <Leaf size={15} /> });
  }

  if (has(PERMISSIONS.PRICING_MANAGE) || has("MANAGE_PRICING")) {
    nav.push({ to: `${portalBase}/pricing`, label: "Pricing console", icon: <Coins size={15} /> });
  }

  if (has(PERMISSIONS.USERS_KYC) || has(PERMISSIONS.USERS_SUSPEND) || has("MANAGE_FRAUD")) {
    nav.push({ to: `${portalBase}/fraud`, label: "Fraud queue", icon: <ShieldCheck size={15} /> });
  }

  // Audit logs for ALL admins
  nav.push({ to: `${portalBase}/audit-logs`, label: "Audit logs", icon: <ScrollText size={15} /> });

  if (isSuper) {
    nav.push({ to: `${portalBase}/settings`, label: "System settings", icon: <Settings2 size={15} /> });
  }

  // Personal settings for ALL admins
  nav.push({ to: `${portalBase}/profile-settings`, label: "My Settings", icon: <User2 size={15} /> });

  return nav;
};
const brandNav: NavItem[] = [
  { to: "/brand/dashboard", label: "Dashboard", icon: <LayoutGrid size={15} /> },
  { to: "/brand/compliance", label: "Compliance", icon: <Recycle size={15} /> },
  { to: "/brand/payments", label: "Payments", icon: <Coins size={15} /> },
  { to: "/brand/reports", label: "Impact reports", icon: <FileText size={15} /> },
  { to: "/brand/leaderboard", label: "Leaderboard", icon: <Award size={15} /> },
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
  
  if (!token) return <Navigate to="/auth/login" replace />;
  if (!user) return <div className="flex h-screen items-center justify-center bg-cream font-bold text-primary">Loading session…</div>;

  const userRole = user.role.toLowerCase();
  const targetRole = role.toLowerCase();

  if (userRole !== targetRole) {
    console.warn(`Role mismatch: expected ${targetRole}, got ${userRole}`);
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}

function AdminPortalWrapper({ brand, portalBase }: { brand: string; portalBase: string }) {
  const { user } = useAuth();
  const nav = getAdminNav(user, portalBase);
  return <PortalShell brand={brand} nav={nav} portalBase={portalBase} />;
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
              <Route path="impact/:slug" element={<BrandImpact />} />
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
              <Route path="profile-settings" element={<SettingsPage />} />
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
              <Route path="profile-settings" element={<SettingsPage />} />
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
              <Route path="profile-settings" element={<SettingsPage />} />
            </Route>

            {/* ADMIN */}
            <Route
              path="admin"
              element={
                <Protected role="admin">
                  <AdminPortalWrapper brand="Admin" portalBase="/admin" />
                </Protected>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminManagement />} />
              <Route path="logistics" element={<AdminLogistics />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="brand-impact" element={<AdminBrandImpact />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile-settings" element={<SettingsPage />} />
            </Route>

            {/* SUPER ADMIN */}
            <Route
              path="super_admin"
              element={
                <Protected role="super_admin">
                  <AdminPortalWrapper brand="Super Admin" portalBase="/super_admin" />
                </Protected>
              }
            >
              <Route index element={<Navigate to="/super_admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<AdminManagement />} />
              <Route path="logistics" element={<AdminLogistics />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="brand-impact" element={<AdminBrandImpact />} />
              <Route path="settings" element={<AdminSettings />} />
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
              <Route path="leaderboard" element={<BrandLeaderboard />} />
              <Route path="profile" element={<BrandProfile />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile-settings" element={<SettingsPage />} />
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
              <Route path="profile-settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
