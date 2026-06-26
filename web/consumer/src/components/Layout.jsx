import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, CreditCard, Grid3X3, User,
  Zap, AlertTriangle, ClipboardList, HeadphonesIcon,
  Sun, Moon, Bell, LogOut, ChevronDown, Menu, X,
  CheckCheck,
} from 'lucide-react';
import LogoutPrompt from './LogoutPrompt';
import InstallButton from './InstallButton';

const allItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/billing', icon: Receipt, label: 'Bills' },
  { path: '/payments', icon: CreditCard, label: 'Pay' },
  { path: '/consumption', icon: Zap, label: 'Usage' },
  { path: '/outages', icon: AlertTriangle, label: 'Outages' },
  { path: '/service-requests', icon: ClipboardList, label: 'Services' },
  { path: '/support', icon: HeadphonesIcon, label: 'Support' },
];

const ITEM_WIDTHS = { Home: 65, Bills: 60, Pay: 55, Usage: 70, Outages: 80, Services: 85, Support: 80 };
const MORE_BTN_W = 85;

function itemWidth(item) {
  return ITEM_WIDTHS[item.label] || 75;
}

function MoreDropdown({ items, isActive, onClose }) {
  return (
    <div className="w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 py-2 overflow-hidden origin-top-right">
      <div className="px-4 pb-1.5 mb-1 border-b border-gray-100 dark:border-gray-800">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">More</span>
      </div>
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
              active
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-0.5'
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

function useNavSplit() {
  const [splitIdx, setSplitIdx] = React.useState(allItems.length);

  React.useEffect(() => {
    const measure = () => {
      const ww = window.innerWidth;
      const base = 120 + 140 + 48 + 16 + 32;
      const avail = Math.max(0, ww - base);
      let used = 0;
      let idx = 0;
      for (; idx < allItems.length; idx++) {
        const need = itemWidth(allItems[idx]) + (idx > 0 ? 4 : 0);
        const moreRoom = MORE_BTN_W + (allItems.length - idx > 1 ? 4 : 0);
        if (used + need + moreRoom > avail) break;
        used += need;
      }
      setSplitIdx(idx);
    };

    let ticking = false;
    const onResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { ticking = false; measure(); });
      }
    };

    measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visible = allItems.slice(0, splitIdx);
  const overflow = allItems.slice(splitIdx);
  return { visible, overflow };
}

function NavLink({ item, inVisible, isActive }) {
  const ref = React.useRef(null);
  const [mw, setMw] = React.useState(0);
  const location = useLocation();
  const active = location.pathname === item.path;

  React.useLayoutEffect(() => {
    if (ref.current) {
      const w = ref.current.scrollWidth;
      if (w !== mw) setMw(w);
    }
  });

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: inVisible ? mw || undefined : 0,
        opacity: inVisible ? 1 : 0,
        pointerEvents: inVisible ? 'auto' : 'none',
      }}
    >
      <Link
        ref={ref}
        to={item.path}
        className={`group flex items-center gap-2 text-sm font-medium whitespace-nowrap px-4 py-2 transition-colors duration-200 ${
          active
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        <item.icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span>{item.label}</span>
        {active && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />
        )}
      </Link>
    </div>
  );
}

const SAMPLE_NOTIFS = [
  { id: 1, icon: Receipt, title: 'Bill due in 3 days', desc: 'Your electric bill of ₱1,245.00 is due on Jun 30', time: '2h ago', unread: true },
  { id: 2, icon: AlertTriangle, title: 'Scheduled maintenance', desc: 'Power interruption on July 2, 9AM–2PM in your area', time: '1d ago', unread: true },
  { id: 3, icon: CheckCheck, title: 'Payment confirmed', desc: 'Your payment of ₱1,200.00 was received', time: '3d ago', unread: false },
  { id: 4, icon: Zap, title: 'Usage alert', desc: 'Your consumption is 15% higher than last month', time: '5d ago', unread: false },
];

export default function Layout({ isDark, toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(SAMPLE_NOTIFS);
  const desktopRef = React.useRef(null);
  const drawerRef = React.useRef(null);
  const notifRef = React.useRef(null);

  const { visible, overflow } = useNavSplit();
  const overflowPaths = overflow.map((i) => i.path);

  const unreadCount = notifications.filter((n) => n.unread).length;

  React.useEffect(() => {
    function handleClick(e) {
      if (desktopRef.current?.contains(e.target) || drawerRef.current?.contains(e.target)) return;
      setMoreOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  React.useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  React.useEffect(() => {
    setMoreOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const isMoreActive = (path) => overflowPaths.includes(path);

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
            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-90"
              >
                {moreOpen
                  ? <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  : <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                }
              </button>
            </div>

            {/* Logo */}
            <Link to="/dashboard" className="hidden md:flex items-center gap-2.5 shrink-0">
              <img src="/anteco.png" alt="ANTECO" className="h-9 w-9 rounded-xl" />
              <div>
                <span className="font-bold text-base">ANTECO</span>
                <span className="text-[10px] text-primary-500 font-semibold block -mt-0.5">CONNECT</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 mx-2">
              {allItems.map((item) => (
                <NavLink
                  key={item.path}
                  item={item}
                  inVisible={visible.some((v) => v.path === item.path)}
                />
              ))}

              {/* Desktop More */}
              <div className="relative">
                <div
                  ref={desktopRef}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    width: overflow.length > 0 ? 85 : 0,
                    opacity: overflow.length > 0 ? 1 : 0,
                    pointerEvents: overflow.length > 0 ? 'auto' : 'none',
                  }}
                >
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isMoreActive(location.pathname) || moreOpen
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-all duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                    {(isMoreActive(location.pathname) || moreOpen) && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full transition-all duration-300" />
                    )}
                  </button>
                </div>

                {moreOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <MoreDropdown
                      items={overflow}
                      isActive={(p) => location.pathname === p}
                      onClose={() => setMoreOpen(false)}
                    />
                  </div>
                )}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <InstallButton />
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-90"
                >
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-semibold">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              n.unread ? 'bg-primary-50/50 dark:bg-primary-950/30' : ''
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${
                              n.unread
                                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}>
                              <n.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm ${n.unread ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.desc}</p>
                              <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                            {n.unread && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                    <Link
                      to="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm text-primary-600 dark:text-primary-400 font-medium border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-90">
                {isDark
                  ? <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  : <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                }
              </button>
              <Link to="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-90">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </Link>
              <button onClick={() => setShowLogout(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-90">
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div ref={drawerRef} className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl animate-slide-in">
            <div className="flex justify-end px-4 pt-4">
              <button onClick={() => setMoreOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col items-center px-4 pt-6 pb-6 border-b border-gray-200 dark:border-gray-800 mb-2">
              <img src="/anteco.png" alt="ANTECO" className="h-14 w-14 rounded-2xl mb-3" />
              <span className="font-bold text-lg">ANTECO</span>
              <span className="text-[11px] text-primary-500 font-semibold -mt-0.5">CONNECT</span>
            </div>
            <nav className="py-2">
              {allItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { setMoreOpen(false); navigate(item.path); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 font-medium border-r-2 border-primary-500'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
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
