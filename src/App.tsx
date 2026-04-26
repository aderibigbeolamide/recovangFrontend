import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import WasteCategories from "./pages/public/WasteCategories";
import FindHub from "./pages/public/FindHub";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Blog from "./pages/public/Blog";
import Legal from "./pages/public/Legal";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CollectorLayout from "./pages/collector/CollectorLayout";
import CollectorDashboard from "./pages/collector/Dashboard";
import CollectorSubmit from "./pages/collector/Submit";
import CollectorHistory from "./pages/collector/History";
import CollectorWithdraw from "./pages/collector/Withdraw";
import CollectorLeaderboard from "./pages/collector/Leaderboard";
import CollectorBadges from "./pages/collector/Badges";
import CollectorReferrals from "./pages/collector/Referrals";
import CollectorStreaks from "./pages/collector/Streaks";
import CollectorDisputes from "./pages/collector/Disputes";
import CollectorNotifications from "./pages/collector/Notifications";

import AgentLayout from "./pages/agent/AgentLayout";
import AgentDashboard from "./pages/agent/Dashboard";
import AgentVerify from "./pages/agent/Verify";
import AgentHub from "./pages/agent/Hub";
import AgentReports from "./pages/agent/Reports";
import AgentXp from "./pages/agent/XpEarnings";
import AgentLocation from "./pages/agent/Location";

import LogisticsLayout from "./pages/logistics/LogisticsLayout";
import LogisticsDashboard from "./pages/logistics/Dashboard";
import LogisticsPickups from "./pages/logistics/Pickups";
import LogisticsFleet from "./pages/logistics/Fleet";
import LogisticsProfile from "./pages/logistics/Profile";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminManagement from "./pages/admin/Management";
import AdminLogistics from "./pages/admin/Logistics";
import AdminFraud from "./pages/admin/Fraud";
import AdminAuditLogs from "./pages/admin/AuditLogs";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/waste-categories" element={<WasteCategories />} />
        <Route path="/find-hub" element={<FindHub />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
      </Route>

      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot" element={<Login />} />

      {/* Collector */}
      <Route element={<CollectorLayout />}>
        <Route path="/collector/dashboard" element={<CollectorDashboard />} />
        <Route path="/collector/submit" element={<CollectorSubmit />} />
        <Route path="/collector/history" element={<CollectorHistory />} />
        <Route path="/collector/withdraw" element={<CollectorWithdraw />} />
        <Route path="/collector/leaderboard" element={<CollectorLeaderboard />} />
        <Route path="/collector/badges" element={<CollectorBadges />} />
        <Route path="/collector/referrals" element={<CollectorReferrals />} />
        <Route path="/collector/streaks" element={<CollectorStreaks />} />
        <Route path="/collector/disputes" element={<CollectorDisputes />} />
        <Route path="/collector/notifications" element={<CollectorNotifications />} />
      </Route>

      {/* Agent */}
      <Route element={<AgentLayout />}>
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/verify" element={<AgentVerify />} />
        <Route path="/agent/hub" element={<AgentHub />} />
        <Route path="/agent/reports" element={<AgentReports />} />
        <Route path="/agent/xp-earnings" element={<AgentXp />} />
        <Route path="/agent/location" element={<AgentLocation />} />
      </Route>

      {/* Logistics */}
      <Route element={<LogisticsLayout />}>
        <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
        <Route path="/logistics/pickups" element={<LogisticsPickups />} />
        <Route path="/logistics/fleet" element={<LogisticsFleet />} />
        <Route path="/logistics/profile" element={<LogisticsProfile />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/logistics" element={<AdminLogistics />} />
        <Route path="/admin/fraud" element={<AdminFraud />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
