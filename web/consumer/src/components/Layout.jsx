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

function MoreDropdown({ items, isActive, onClose }) {
  return (
    <div className="w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
      <div className="px-4 pb-1.5 mb-1 border-b border-gray-100 dark:border-gray-800">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Services</span>
      </div>
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
              active
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
  );
}

export default function Layout({ isDark, toggleTheme, onLogout }) {
  const location = useLocation();
  const [showLogout, setShowLogout] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const desktopRef = React.useRef(null);
  const mobileRef = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      const inDesktop = desktopRef.current?.contains(e.target);
      const inMobile = mobileRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  React.useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const isMoreActive = (path) => morePaths.includes(path);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await onLogout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <img src="/anteco.png" alt="ANTECO" className="h-9 w-9 rounded-xl" />
              <div>
                <span className="font-bold text-base">ANTECO</span>
                <span className="text-[10px] text-primary-500 font-semibold block -mt-0.5">CONNECT</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}

              {/* Desktop More */}
              <div ref={desktopRef} className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isMoreActive(location.pathname) || moreOpen
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                  {(isMoreActive(location.pathname) || moreOpen) && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2">
                    <MoreDropdown
                      items={moreItems}
                      isActive={(p) => location.pathname === p}
                      onClose={() => setMoreOpen(false)}
                    />
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile nav */}
            <nav className="md:hidden flex items-center gap-1 overflow-x-auto scrollbar-none">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile More */}
              <div ref={mobileRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors ${
                    isMoreActive(location.pathname) || moreOpen
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              </button>
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                {isDark
                  ? <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  : <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                }
              </button>
              <button onClick={() => setShowLogout(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile More dropdown */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute right-4 top-0 mt-1" onClick={(e) => e.stopPropagation()}>
            <MoreDropdown
              items={moreItems}
              isActive={(p) => location.pathname === p}
              onClose={() => setMoreOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
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
