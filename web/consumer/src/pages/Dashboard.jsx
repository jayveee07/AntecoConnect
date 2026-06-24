import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, AlertTriangle, Zap, ArrowUpRight,
  Wallet, Clock, CheckCircle, Receipt,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { dashboardService } from '../services';

const defaultMonthly = [
  { month: 'Jan', kwh: 180 }, { month: 'Feb', kwh: 195 }, { month: 'Mar', kwh: 210 },
  { month: 'Apr', kwh: 240 }, { month: 'May', kwh: 280 }, { month: 'Jun', kwh: 260 },
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
  const [stats, setStats] = React.useState({ usage: '260 kWh', rate: '₱8.94/kWh', outages: 0 });
  const [currentBill, setCurrentBill] = React.useState(null);
  const [consumptionData, setConsumption] = React.useState(defaultMonthly);
  const [recentBills, setRecentBills] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [hasAccounts, setHasAccounts] = React.useState(null);

  React.useEffect(() => {
    const checkAccounts = async () => {
      const u = auth.currentUser;
      if (!u) return;
      try {
        const q = query(collection(db, 'consumerAccounts'), where('userId', '==', u.uid));
        const snap = await getDocs(q);
        setHasAccounts(!snap.empty);
      } catch { setHasAccounts(true); }
    };
    checkAccounts();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await dashboardService.getAll();

        if (dashboardData.user) setUser(dashboardData.user);

        if (dashboardData.currentBill) {
          const b = dashboardData.currentBill;
          setCurrentBill({
            period: b.billingPeriod || b.billing_period || 'Current',
            amount: (b.totalAmountDue || b.total_amount_due || 0).toLocaleString(),
            due: b.dueDate || b.due_date || '',
            daysLeft: b.daysUntilDue || b.days_until_due || 0,
          });
        }

        if (dashboardData.bills?.length) {
          setRecentBills(dashboardData.bills.slice(0, 3).map((b) => ({
            period: b.billingPeriod || b.billing_period || '',
            kwh: b.kwh || b.consumption_kwh || 0,
            amount: (b.totalAmountDue || b.total_amount_due || 0).toLocaleString(),
            status: b.status || 'unknown',
          })));
        }

        if (dashboardData.activeOutages) setStats((prev) => ({ ...prev, outages: dashboardData.activeOutages.length }));
      } catch {}
    };
    fetchData();
  }, []);

  const quickActions = [
    { icon: Wallet, label: 'Pay Bill', path: '/payments', color: 'bg-green-500' },
    { icon: AlertTriangle, label: 'Report Outage', path: '/outages', color: 'bg-red-500' },
    { icon: Receipt, label: 'View Bills', path: '/billing', color: 'bg-blue-500' },
    { icon: HeadphonesIcon, label: 'Contact Support', path: '/support', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back{user ? `, ${user.first_name}` : ''}</p>
        </div>
        <span className="badge-info">Active</span>
      </div>

      {hasAccounts === false && (
        <div className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-xl p-3 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Link Your Electric Account</h3>
              <p className="text-primary-200 text-sm mt-1">Connect your ANTECO service account to view bills, track usage, and more.</p>
              <Link to="/add-account" className="inline-flex items-center gap-2 mt-4 bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-all">
                Link Account Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {currentBill && (
        <div className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-200 text-sm">Current Bill - {currentBill.period}</p>
              <h2 className="text-4xl font-bold mt-2">&#x20B1;{currentBill.amount}</h2>
              {currentBill.due && <p className="text-primary-200 text-sm mt-1">Due: {currentBill.due}{currentBill.daysLeft ? ` (${currentBill.daysLeft} days remaining)` : ''}</p>}
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <img src="/anteco.png" alt="ANTECO" className="w-8 h-8 brightness-0 invert" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Link to="/payments" className="bg-electric-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-electric-500 transition-all">Pay Now</Link>
            <Link to="/billing" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">View Details</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <Link key={i} to={action.path} className="card-hover flex items-center gap-4">
            <div className={`${action.color} p-3 rounded-xl`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.usage}</p>
            <p className="text-sm text-gray-500">Current Month Usage</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.rate}</p>
            <p className="text-sm text-gray-500">Average Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.outages}</p>
            <p className="text-sm text-gray-500">Active Outages</p>
          </div>
        </div>
      </div>

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
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#9e9e9e" />
            <YAxis stroke="#9e9e9e" />
            <Tooltip />
            <Area type="monotone" dataKey="kwh" stroke="#FF6B00" fill="url(#colorKwh)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {recentBills.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Bills</h3>
            <Link to="/billing" className="text-primary-500 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentBills.map((bill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">{bill.period}</p>
                    <p className="text-sm text-gray-500">{bill.kwh} kWh consumed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">&#x20B1;{bill.amount}</p>
                  <span className="badge-success">{bill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
