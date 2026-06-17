import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, AlertTriangle, Zap, ArrowUpRight,
  Wallet, Clock, CheckCircle, Receipt,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const consumptionData = [
  { month: 'Jan', kwh: 180 }, { month: 'Feb', kwh: 195 }, { month: 'Mar', kwh: 210 },
  { month: 'Apr', kwh: 240 }, { month: 'May', kwh: 280 }, { month: 'Jun', kwh: 260 },
];

const quickActions = [
  { icon: Wallet, label: 'Pay Bill', path: '/payments', color: 'bg-green-500' },
  { icon: AlertTriangle, label: 'Report Outage', path: '/outages', color: 'bg-red-500' },
  { icon: Receipt, label: 'View Bills', path: '/billing', color: 'bg-blue-500' },
  { icon: HeadphonesIcon, label: 'Contact Support', path: '/support', color: 'bg-purple-500' },
];

function HeadphonesIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, Juan Dela Cruz</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-info">Active</span>
          <span className="text-sm text-gray-500">Account: ANT-2024-001</span>
        </div>
      </div>

      {/* Current Bill Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-200 text-sm">Current Bill - June 2024</p>
            <h2 className="text-4xl font-bold mt-2">₱2,847.50</h2>
            <p className="text-primary-200 text-sm mt-1">Due: July 15, 2024 (10 days remaining)</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex items-center justify-center">
            <img src="/anteco.png" alt="ANTECO" className="w-8 h-8 brightness-0 invert" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Link to="/payments" className="bg-electric-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-electric-500 transition-all">
            Pay Now
          </Link>
          <Link to="/billing" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">
            View Details
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <Link key={i} to={action.path}
            className="card-hover flex items-center gap-4"
          >
            <div className={`${action.color} p-3 rounded-xl`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">260 kWh</p>
            <p className="text-sm text-gray-500">Current Month Usage</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">₱8.94/kWh</p>
            <p className="text-sm text-gray-500">Average Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-500">Active Outages</p>
          </div>
        </div>
      </div>

      {/* Consumption Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Energy Consumption Trend</h3>
          <Link to="/consumption" className="text-primary-500 text-sm hover:underline flex items-center gap-1">
            View Details <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={consumptionData}>
            <defs>
              <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0057B8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0057B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#9e9e9e" />
            <YAxis stroke="#9e9e9e" />
            <Tooltip />
            <Area type="monotone" dataKey="kwh" stroke="#0057B8" fill="url(#colorKwh)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bills */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Bills</h3>
          <Link to="/billing" className="text-primary-500 text-sm hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {['May 2024', 'April 2024', 'March 2024'].map((period, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${i === 0 ? 'text-green-500' : 'text-green-500'}`} />
                <div>
                  <p className="font-medium">{period}</p>
                  <p className="text-sm text-gray-500">240 kWh consumed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₱2,145.60</p>
                <span className="badge-success">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
