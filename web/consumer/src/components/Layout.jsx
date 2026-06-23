import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, CreditCard, Grid3X3, User,
  Zap, AlertTriangle, ClipboardList, HeadphonesIcon,
  Sun, Moon, Bell, LogOut, ChevronDown,
} from 'lucide-react';
import LogoutPrompt from './LogoutPrompt';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/billing', icon: Receipt, label: 'Bills' },
  { path: '/payments', icon: CreditCard, label: 'Pay' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const moreItems = [
  { path: '/consumption', icon: Zap, label: 'Usage' },
  { path: '/outages', icon: AlertTriangle, label: 'Outages' },
  { path: '/service-requests', icon: ClipboardList, label: 'Services' },
  { path: '/support', icon: HeadphonesIcon, label: 'Support' },
];

const morePaths = moreItems.map((i) => i.path);

export default function Layout({ isDark, toggleTheme, onLogout }) {
  const location = useLocation();
  const [showLogout, setShowLogout] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreRef = React.useRef(null);

  const isMoreActive = morePaths.includes(location.pathname);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await onLogout();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Header + Navigation */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        {/* Top row: logo + actions */}
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/anteco.png" alt="ANTECO" className="h-7 w-7 rounded-lg" />
            <span className="font-bold text-sm">ANTECO Connect</span>
          </Link>
          <div className="flex items-center gap-1">
            <button className="relative p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button onClick={toggleTheme} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowLogout(true)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all duration-200 ${
                isMoreActive || moreOpen
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>More</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1.5">
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <Outlet />
      </main>

      <LogoutPrompt
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
        loading={loggingOut}
      />
    </div>
  );
}
