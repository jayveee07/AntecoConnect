import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, ClipboardList, HeadphonesIcon, ArrowRight } from 'lucide-react';

const services = [
  { path: '/consumption', icon: Zap, label: 'Usage', desc: 'Track your energy consumption', color: 'bg-orange-500' },
  { path: '/outages', icon: AlertTriangle, label: 'Outages', desc: 'Report and track outages', color: 'bg-red-500' },
  { path: '/service-requests', icon: ClipboardList, label: 'Services', desc: 'Manage service requests', color: 'bg-blue-500' },
  { path: '/support', icon: HeadphonesIcon, label: 'Support', desc: 'Contact support team', color: 'bg-purple-500' },
];

export default function More() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">All Services</h1>
        <p className="text-gray-500 dark:text-gray-400">Explore all ANTECO services</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {services.map((s) => (
          <Link
            key={s.path}
            to={s.path}
            className="card-hover flex flex-col items-start p-5"
          >
            <div className={`${s.color} p-3 rounded-xl mb-3`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold">{s.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-primary-500 to-primary-800 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Need help?</h3>
            <p className="text-primary-200 text-sm mt-1">Contact our support team anytime</p>
          </div>
          <Link to="/support" className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
