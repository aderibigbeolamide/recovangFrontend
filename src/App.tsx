import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './store/auth.store';
import { useOfflineSync } from './lib/useOfflineSync';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import OfflineBanner from './components/ui/OfflineBanner';

// Pages - Public
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Collector
import CollectorDashboard from './pages/collector/Dashboard';
import HistoryPage from './pages/collector/HistoryPage';
import WalletPage from './pages/wallet/WalletPage';
import HubFinder from './pages/dashboard/HubFinder';

// Dashboards
import AgentDashboard from './pages/agent/Dashboard';
import BrandDashboard from './pages/brand/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import LogisticsDashboard from './pages/logistics/Dashboard';
import FactoryDashboard from './pages/factory/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  
  if (roles && user && user.role) {
    const normalizedUserRole = user.role.toLowerCase().replace('_', '');
    const isAuthorized = roles.some(role => role.toLowerCase().replace('_', '') === normalizedUserRole);
    if (!isAuthorized) return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useOfflineSync();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <OfflineBanner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<div className="p-20 text-h1">About Recovang</div>} />
          <Route path="/how-it-works" element={<div className="p-20 text-h1">How it Works</div>} />
          <Route path="/find-hub" element={<HubFinder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Collector Routes */}
          <Route path="/collector" element={<ProtectedRoute roles={['collector']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/collector/dashboard" replace />} />
            <Route path="dashboard" element={<CollectorDashboard />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="withdraw" element={<WalletPage />} />
            <Route path="hubs" element={<HubFinder />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="leaderboard" element={<div className="p-8">Leaderboard</div>} />
            <Route path="profile" element={<div className="p-8">Profile Settings</div>} />
          </Route>

          {/* Agent Routes */}
          <Route path="/agent" element={<ProtectedRoute roles={['agent']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/agent/dashboard" replace />} />
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="verify" element={<div className="p-8">Verify Submission</div>} />
            <Route path="profile" element={<div className="p-8">Agent Profile</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin', 'superadmin']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="collectors" element={<div className="p-8">Manage Collectors</div>} />
            <Route path="hubs" element={<div className="p-8">Manage Hubs</div>} />
            <Route path="pricing" element={<div className="p-8">Pricing Control</div>} />
            <Route path="settings" element={<div className="p-8">Platform Settings</div>} />
          </Route>

          <Route path="/superadmin" element={<ProtectedRoute roles={['admin', 'superadmin']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="collectors" element={<div className="p-8">Manage Collectors</div>} />
            <Route path="hubs" element={<div className="p-8">Manage Hubs</div>} />
            <Route path="pricing" element={<div className="p-8">Pricing Control</div>} />
            <Route path="settings" element={<div className="p-8">Platform Settings</div>} />
          </Route>

          {/* Brand Routes */}
          <Route path="/brand" element={<ProtectedRoute roles={['brand']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/brand/dashboard" replace />} />
            <Route path="dashboard" element={<BrandDashboard />} />
            <Route path="compliance" element={<div className="p-8">Compliance Reports</div>} />
          </Route>

          {/* Factory Routes */}
          <Route path="/factory" element={<ProtectedRoute roles={['factory']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/factory/dashboard" replace />} />
            <Route path="dashboard" element={<FactoryDashboard />} />
            <Route path="supply" element={<div className="p-8">Supply Overview</div>} />
          </Route>

          {/* Logistics Routes */}
          <Route path="/logistics" element={<ProtectedRoute roles={['logistics']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/logistics/dashboard" replace />} />
            <Route path="dashboard" element={<LogisticsDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
