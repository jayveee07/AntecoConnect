import React from 'react';
import { Users, Power, AlertTriangle, CreditCard, TrendingUp, Receipt, ClipboardList, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1250000, collection: 1150000 },
  { month: 'Feb', revenue: 1320000, collection: 1200000 },
  { month: 'Mar', revenue: 1180000, collection: 1050000 },
  { month: 'Apr', revenue: 1420000, collection: 1350000 },
  { month: 'May', revenue: 1380000, collection: 1280000 },
  { month: 'Jun', revenue: 1520000, collection: 1450000 },
];

const outageData = [
  { month: 'Jan', outages: 12, resolved: 10 },
  { month: 'Feb', outages: 15, resolved: 13 },
  { month: 'Mar', outages: 8, resolved: 7 },
  { month: 'Apr', outages: 20, resolved: 18 },
  { month: 'May', outages: 14, resolved: 12 },
  { month: 'Jun', outages: 10, resolved: 9 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
          <p className="text-gray-400">Real-time overview of ANTECO operations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Last updated: June 17, 2024 10:30 AM</span>
          <button className="btn-primary text-sm">Refresh Data</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Consumers" value="45,892" change="+2.4%" color="blue" />
        <KPICard icon={CreditCard} label="Monthly Revenue" value="₱1.52M" change="+9.8%" color="green" />
        <KPICard icon={AlertTriangle} label="Active Outages" value="3" change="-25%" color="red" />
        <KPICard icon={ClipboardList} label="Pending Work Orders" value="12" change="+2" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Revenue & Collection Trend</h3>
            <span className="badge-success">Collection Rate: 94.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0057B8" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="collection" fill="#FFC107" radius={[4, 4, 0, 0]} name="Collection" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Outage Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Outage Statistics</h3>
            <span className="text-sm text-gray-400">Avg Response: 45 min</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={outageData}>
              <defs>
                <linearGradient id="outageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="outages" stroke="#EF4444" fill="url(#outageGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" stroke="#10B981" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Users} label="Active Connections" value="42,100" sub="91.7% of total" />
        <StatBox icon={Power} label="Inactive Accounts" value="3,792" sub="8.3% of total" />
        <StatBox icon={Receipt} label="Pending Applications" value="28" sub="+5 this week" />
        <StatBox icon={Zap} label="Energy Sales (MWh)" value="18,420" sub="This month" />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Payment received', detail: '₱2,847.50 from Juan Dela Cruz', time: '5 min ago', type: 'payment' },
            { action: 'Outage reported', detail: 'Power outage in San Roque, San Juan', time: '15 min ago', type: 'outage' },
            { action: 'New connection approved', detail: 'Maria Santos - Barangay 3', time: '1 hour ago', type: 'service' },
            { action: 'Work order completed', detail: 'Meter replacement #WO-2024-089', time: '2 hours ago', type: 'work' },
            { action: 'Bill generated', detail: 'June 2024 billing cycle', time: '3 hours ago', type: 'billing' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'payment' ? 'bg-green-400' :
                  item.type === 'outage' ? 'bg-red-400' :
                  item.type === 'service' ? 'bg-blue-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, change, color }) {
  const isPositive = change.startsWith('+');
  const colorMap = { blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500', orange: 'bg-orange-500' };
  return (
    <div className="card flex items-center gap-4">
      <div className={`${colorMap[color]} p-3 rounded-xl`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {change} vs last month
        </p>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, sub }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-primary-400" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
