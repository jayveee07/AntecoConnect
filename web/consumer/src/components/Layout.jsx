import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, CreditCard, Grid3X3, User,
  Sun, Moon, Bell, LogOut,
} from 'lucide-react';
import LogoutPrompt from './LogoutPrompt';

const bottomNav = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/billing', icon: Receipt, label: 'Bills' },
  { path: '/payments', icon: CreditCard, label: 'Pay' },
  { path: '/more', icon: Grid3X3, label: 'More' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Layout({ isDark, toggleTheme, onLogout }) {
  const location = useLocation();
  const [showLogout, setShowLogout] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await onLogout();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/anteco.png" alt="ANTECO" className="h-8 w-8 rounded-lg" />
          <span className="font-bold text-sm">ANTECO Connect</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setShowLogout(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {bottomNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-0 ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <LogoutPrompt
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
        loading={loggingOut}
      />
    </div>
  );
}
