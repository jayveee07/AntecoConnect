import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, CreditCard, Zap, AlertTriangle,
  ClipboardList, HeadphonesIcon, User, Menu, X,
  Sun, Moon, Bell, LogOut,
} from 'lucide-react';
import LogoutPrompt from './LogoutPrompt';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/billing', icon: Receipt, label: 'Billing' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/consumption', icon: Zap, label: 'Consumption' },
  { path: '/outages', icon: AlertTriangle, label: 'Outages' },
  { path: '/service-requests', icon: ClipboardList, label: 'Services' },
  { path: '/support', icon: HeadphonesIcon, label: 'Support' },
];

export default function Layout({ isDark, toggleTheme, onLogout }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showLogout, setShowLogout] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await onLogout();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200 dark:border-gray-800">
          <img src="/anteco.png" alt="ANTECO" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="font-bold text-lg">ANTECO</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">CONNECT</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowLogout(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <LogoutPrompt
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
        loading={loggingOut}
      />
    </div>
  );
}
