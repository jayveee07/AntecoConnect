import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Receipt, CreditCard, FileText,
  AlertTriangle, ClipboardList, Headphones, Megaphone,
  BarChart3, Map, Settings, Menu, X, Bell, LogOut, UserCog, Gauge,
} from 'lucide-react';

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/consumers', icon: Users, label: 'Consumers' },
      { path: '/users', icon: UserCog, label: 'User Management' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/billing', icon: Receipt, label: 'Billing' },
      { path: '/payments', icon: CreditCard, label: 'Payments' },
      { path: '/meter-reading', icon: Gauge, label: 'Meter Reading' },
      { path: '/outages', icon: AlertTriangle, label: 'Outages' },
      { path: '/work-orders', icon: ClipboardList, label: 'Work Orders' },
      { path: '/service-requests', icon: Headphones, label: 'Service Requests' },
    ],
  },
  {
    title: 'Management',
    items: [
      { path: '/announcements', icon: Megaphone, label: 'Announcements' },
      { path: '/reports', icon: BarChart3, label: 'Reports' },
      { path: '/gis', icon: Map, label: 'GIS Mapping' },
      { path: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminLayout({ onLogout }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-700">
          <img src="/anteco.png" alt="ANTECO" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="font-bold text-lg">ANTECO</h1>
            <p className="text-xs text-gray-400 -mt-1">Admin Portal</p>
          </div>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-400 font-semibold'
                          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-700 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-gray-700 rounded-lg text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold">AD</div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
