import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, AlertTriangle, Zap, ArrowUpRight,
  Wallet, Clock, CheckCircle, Receipt, ChevronDown, Plus,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { dashboardService, consumptionService } from '../services';
import AddAccountModal from '../components/AddAccountModal';

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
  const [accounts, setAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [showAddAccount, setShowAddAccount] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { console.log('[Dashboard] currentBill STATE:', currentBill); }, [currentBill]);
  React.useEffect(() => { console.log('[Dashboard] recentBills STATE:', recentBills); }, [recentBills]);

  const loadDashboard = React.useCallback(async (acct) => {
    setLoading(true);
    try {
      console.log('[Dashboard] loadDashboard selectedAccount:', acct);
      const dashboardData = await dashboardService.getAll(acct?.id);
      console.log('[Dashboard] dashboardData:', dashboardData);
      if (dashboardData.user) setUser(dashboardData.user);
      if (dashboardData.currentBill) {
        const b = dashboardData.currentBill;
        const newBill = {
          period: b.billingPeriod || b.billing_period || 'Current',
          amount: (b.totalAmountDue || b.total_amount_due || 0).toLocaleString(),
          due: b.dueDate || b.due_date || '',
          daysLeft: b.daysUntilDue || b.days_until_due || 0,
        };
        console.log('[Dashboard] setting currentBill to:', newBill);
        setCurrentBill(newBill);
      } else {
        console.log('[Dashboard] setting currentBill to null');
        setCurrentBill(null);
      }
      if (dashboardData.bills?.length) {
        const newBills = dashboardData.bills.slice(0, 3).map((b) => ({
          period: b.billingPeriod || b.billing_period || '',
          kwh: b.kwh || b.consumptionKwh || 0,
          amount: (b.totalAmountDue || b.total_amount_due || 0).toLocaleString(),
          status: b.status || 'unknown',
        }));
        console.log('[Dashboard] setting recentBills to:', newBills);
        setRecentBills(newBills);
      } else {
        console.log('[Dashboard] setting recentBills to empty');
        setRecentBills([]);
      }
      if (dashboardData.activeOutages) setStats((prev) => ({ ...prev, outages: dashboardData.activeOutages.length }));

      const consumptionResult = await consumptionService.getConsumption();
      if (consumptionResult?.monthly?.length) {
        const mapped = consumptionResult.monthly.map((c) => ({
          month: c.periodMonth || c.period_month || (() => { const d = new Date(); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][(d.getMonth()) % 12]; })(),
          kwh: c.consumptionKwh || c.consumption_kwh || 0,
        }));
        setConsumption(mapped);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      const u = auth.currentUser;
      if (!u) return;
      try {
        const linkSnap = await getDoc(doc(db, 'linkAccounts', u.uid));
        const accts = linkSnap.exists() ? (linkSnap.data().accounts || []).map((a, i) => ({ id: a.accountNumber || `acct-${i}`, ...a })) : [];
        setAccounts(accts);
        if (accts.length > 0) {
          setSelectedAccount(accts[0]);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, [loadDashboard]);

  React.useEffect(() => {
    if (selectedAccount) loadDashboard(selectedAccount);
  }, [selectedAccount, loadDashboard]);

  const quickActions = [
    { icon: Wallet, label: 'Pay Bill', path: '/payments', color: 'bg-green-500' },
    { icon: AlertTriangle, label: 'Report Outage', path: '/outages', color: 'bg-red-500' },
    { icon: Receipt, label: 'View Bills', path: '/billing', color: 'bg-blue-500' },
    { icon: HeadphonesIcon, label: 'Contact Support', path: '/support', color: 'bg-purple-500' },
  ];

  // No accounts — show only link prompt
  if (!loading && accounts.length === 0) {
    return (
      <>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome{user ? `, ${user.first_name}` : ''}!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Link your ANTECO electric service account to start managing your bills, track usage, and more.
            </p>
            <button onClick={() => setShowAddAccount(true)}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
              <Plus className="w-5 h-5" />
              Link Your Account
            </button>
          </div>
        </div>
        <AddAccountModal open={showAddAccount} onClose={() => setShowAddAccount(false)} onLinked={() => { setShowAddAccount(false); window.location.reload(); }} />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Account Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back{user ? `, ${user.first_name}` : ''}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary-300 dark:hover:border-primary-700 transition-all"
          >
            <Zap className="w-4 h-4 text-primary-500" />
            <span>{selectedAccount?.accountNumber || 'Select Account'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-20 py-2 overflow-hidden">
                {accounts.map((acct) => (
                  <button
                    key={acct.id}
                    onClick={() => { setSelectedAccount(acct); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all ${
                      selectedAccount?.id === acct.id
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-medium">{acct.accountNumber}</p>
                      <p className="text-xs text-gray-400 truncate">{acct.accountName || ''}</p>
                    </div>
                    {acct.status === 'active' && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium">Active</span>}
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                  <button onClick={() => { setDropdownOpen(false); setShowAddAccount(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary-500 hover:text-primary-600 font-medium hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Current Bill */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl p-6 text-white">
        {currentBill ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">Current Bill</p>
              <p className="text-xl font-semibold mt-1">No bill yet</p>
              <p className="text-primary-200 text-xs mt-1">Your current bill will appear here once available.</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className={`p-3 rounded-xl ${currentBill ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Zap className={`w-6 h-6 ${currentBill ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{currentBill ? stats.usage : '0 kWh'}</p>
            <p className="text-sm text-gray-500">Current Month Usage</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`p-3 rounded-xl ${currentBill ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <TrendingUp className={`w-6 h-6 ${currentBill ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{currentBill ? stats.rate : '₱0.00/kWh'}</p>
            <p className="text-sm text-gray-500">Average Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`p-3 rounded-xl ${currentBill ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Clock className={`w-6 h-6 ${currentBill ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.outages}</p>
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

      {/* Recent Bills */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Bills</h3>
          <Link to="/billing" className="text-primary-500 text-sm hover:underline">View All</Link>
        </div>
        {recentBills.length > 0 ? (
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
        ) : (
          <div className="text-center py-10">
            <Receipt className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No bills yet</p>
            <p className="text-xs text-gray-400 mt-1">Your billing history will show up here once available.</p>
          </div>
        )}
      </div>
      <AddAccountModal open={showAddAccount} onClose={() => setShowAddAccount(false)} onLinked={() => { setShowAddAccount(false); window.location.reload(); }} />
    </div>
  );
}
