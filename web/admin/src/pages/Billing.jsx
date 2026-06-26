import React from 'react';
import { Search, Download, Filter, ChevronDown } from 'lucide-react';
import { adminBillingService } from '../services';

const defaultBills = [
  { id: 1, account: 'ANT-2024-0001', name: 'Juan Dela Cruz', period: 'June 2024', amount: 2847.50, status: 'unpaid', due: 'July 15, 2024' },
  { id: 2, account: 'ANT-2024-0002', name: 'Maria Santos', period: 'June 2024', amount: 1980.00, status: 'paid', due: 'July 15, 2024' },
  { id: 3, account: 'ANT-2024-0004', name: 'Ana Gonzales', period: 'May 2024', amount: 3350.25, status: 'overdue', due: 'June 15, 2024' },
];

export default function Billing() {
  const [bills, setBills] = React.useState(defaultBills);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminBillingService.getAll();
        if (res.data?.data) {
          setBills(res.data.data);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing Management</h1>
          <p className="text-gray-400">Generate and manage electricity bills</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-primary">Generate Bills</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-2xl font-bold text-green-400">₱1.52M</p><p className="text-sm text-gray-400">Total Billed (June)</p></div>
        <div className="card"><p className="text-2xl font-bold text-blue-400">₱1.45M</p><p className="text-sm text-gray-400">Total Collected</p></div>
        <div className="card"><p className="text-2xl font-bold text-yellow-400">94.2%</p><p className="text-sm text-gray-400">Collection Rate</p></div>
        <div className="card"><p className="text-2xl font-bold text-red-400">₱284K</p><p className="text-sm text-gray-400">Outstanding</p></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="input-field pl-12" placeholder="Search by account or consumer name..." />
        </div>
        <select className="input-field w-44">
          <option>All Status</option>
          <option>Unpaid</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>
        <select className="input-field w-44">
          <option>June 2024</option>
          <option>May 2024</option>
          <option>April 2024</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Consumer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Account</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Period</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Due Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="p-4"><p className="font-medium">{b.name}</p></td>
                <td className="p-4 text-sm font-mono">{b.account}</td>
                <td className="p-4 text-sm">{b.period}</td>
                <td className="p-4 text-right font-semibold">₱{b.amount.toFixed(2)}</td>
                <td className="p-4 text-sm">{b.due}</td>
                <td className="p-4"><span className={`badge ${b.status === 'paid' ? 'badge-success' : b.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>{b.status}</span></td>
                <td className="p-4"><button className="text-sm text-primary-400 hover:underline">Adjust</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
