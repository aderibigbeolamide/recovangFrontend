import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet as WalletIcon, 
  Recycle, 
  MapPin, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  TrendingUp,
  ShieldCheck,
  Truck,
  Users,
  CreditCard,
  ClipboardList,
  History,
  Award,
  Users2,
  AlertTriangle
} from 'lucide-react';
import { useAuth, type UserRole } from '../../store/auth.store';
import { useOfflineSync } from '../../lib/useOfflineSync';
import Logo from '../ui/Logo';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const getNavItems = (role: UserRole): NavItem[] => {
  if (!role) return [];
  const normalizedRole = role.toLowerCase().replace('_', '') as Exclude<UserRole, null>;
  const base = `/${normalizedRole}`;
  
  const items: Record<Exclude<UserRole, null>, NavItem[]> = {
    collector: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: `${base}/dashboard` },
      { label: 'Wallet', icon: <WalletIcon size={20} />, path: `${base}/wallet` },
      { label: 'History', icon: <History size={20} />, path: `${base}/history` },
      { label: 'Hubs', icon: <MapPin size={20} />, path: `${base}/hubs` },
      { label: 'Leaderboard', icon: <Award size={20} />, path: `${base}/leaderboard` },
      { label: 'Profile', icon: <Settings size={20} />, path: `${base}/profile` },
    ],
    agent: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: `${base}/dashboard` },
      { label: 'Verify', icon: <ShieldCheck size={20} />, path: `${base}/verify` },
      { label: 'Hub Status', icon: <MapPin size={20} />, path: `${base}/dashboard` },
      { label: 'Profile', icon: <Settings size={20} />, path: `${base}/profile` },
    ],
    admin: [
      { label: 'Overview', icon: <LayoutDashboard size={20} />, path: `${base}/dashboard` },
      { label: 'Collectors', icon: <Users size={20} />, path: `${base}/collectors` },
      { label: 'Hubs', icon: <MapPin size={20} />, path: `${base}/hubs` },
      { label: 'Payments', icon: <CreditCard size={20} />, path: `${base}/payments` },
      { label: 'Settings', icon: <Settings size={20} />, path: `${base}/settings` },
    ],
    superadmin: [
      { label: 'Overview', icon: <LayoutDashboard size={20} />, path: `${base}/dashboard` },
      { label: 'Collectors', icon: <Users size={20} />, path: `${base}/collectors` },
      { label: 'Hubs', icon: <MapPin size={20} />, path: `${base}/hubs` },
      { label: 'Payments', icon: <CreditCard size={20} />, path: `${base}/payments` },
      { label: 'Settings', icon: <Settings size={20} />, path: `${base}/settings` },
    ],
    brand: [
      { label: 'Impact', icon: <TrendingUp size={20} />, path: `${base}/dashboard` },
      { label: 'Compliance', icon: <ShieldCheck size={20} />, path: `${base}/compliance` },
      { label: 'Profile', icon: <Settings size={20} />, path: `${base}/profile` },
    ],
    factory: [
      { label: 'Inventory', icon: <LayoutDashboard size={20} />, path: `${base}/dashboard` },
      { label: 'Supply', icon: <Truck size={20} />, path: `${base}/supply` },
      { label: 'Profile', icon: <Settings size={20} />, path: `${base}/profile` },
    ],
    logistics: [
      { label: 'Fleet', icon: <Truck size={20} />, path: `${base}/dashboard` },
      { label: 'Schedule', icon: <ClipboardList size={20} />, path: `${base}/dashboard` },
      { label: 'Profile', icon: <Settings size={20} />, path: `${base}/profile` },
    ]
  };

  return items[normalizedRole] || [];
};

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isSyncing, pendingCount } = useOfflineSync();

  const navItems = getNavItems(user?.role || 'collector');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-offwhite flex text-charcoal font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-charcoal border-r border-white/5 sticky top-0 h-screen z-50">
        <div className="p-8">
          <Logo variant="white" size={32} />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-glow" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-white/40 group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <span className="font-heading font-bold text-small">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill-desktop" 
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-small truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-white/60 hover:text-error text-ui font-bold transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-bordergray flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-mint rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="lg:hidden">
              <Logo variant="icon" size={32} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-mint rounded-full border border-primary/10">
                <div className={isSyncing ? "animate-spin" : ""}>
                  <Recycle size={14} className="text-primary" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase">{pendingCount} Pending</span>
              </div>
            )}

            <button className="p-2 text-textgray hover:text-primary relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-bordergray">
              <div className="text-right hidden sm:block">
                <p className="text-small font-bold text-charcoal">{user?.firstName} {user?.lastName}</p>
                <p className="text-ui text-textgray capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-primary font-bold shadow-soft">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-charcoal p-6 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <Logo variant="white" size={32} />
                <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl transition-all",
                      location.pathname === item.path
                        ? "bg-primary text-white shadow-glow"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.icon}
                    <span className="font-heading font-bold text-body">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-white/60 hover:text-error text-small font-bold transition-colors"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};



export default DashboardLayout;
