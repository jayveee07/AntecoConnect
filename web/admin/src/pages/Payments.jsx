import React from 'react';
import { Search, Download, CheckCircle, XCircle } from 'lucide-react';
import { adminPaymentService } from '../services';

const defaultPayments = [
  { id: 1, ref: 'TXN-2024-0451', name: 'Juan Dela Cruz', method: 'GCash', amount: 2847.50, status: 'confirmed', date: 'June 17, 2024' },
  { id: 2, ref: 'TXN-2024-0450', name: 'Maria Santos', method: 'BPI Transfer', amount: 1980.00, status: 'confirmed', date: 'June 16, 2024' },
  { id: 3, ref: 'TXN-2024-0449', name: 'Pedro Reyes', method: 'Credit Card', amount: 1500.00, status: 'pending', date: 'June 16, 2024' },
];

export default function Payments() {
  const [payments, setPayments] = React.useState(defaultPayments);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminPaymentService.getAll();
        if (res.data?.data) {
          setPayments(res.data.data);
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
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-gray-400">Verify and manage consumer payments</p>
        </div>
        <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><p className="text-2xl font-bold text-green-400">₱1.45M</p><p className="text-sm text-gray-400">Total Collected (June)</p></div>
        <div className="card"><p className="text-2xl font-bold text-blue-400">2,847</p><p className="text-sm text-gray-400">Transactions</p></div>
        <div className="card"><p className="text-2xl font-bold text-yellow-400">3</p><p className="text-sm text-gray-400">Pending Verification</p></div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input className="input-field pl-12" placeholder="Search by reference or consumer..." />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Reference</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Consumer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Method</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="p-4 text-sm font-mono">{p.ref}</td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-sm">{p.method}</td>
                <td className="p-4 text-right font-semibold">₱{p.amount.toFixed(2)}</td>
                <td className="p-4 text-sm">{p.date}</td>
                <td className="p-4">
                  <span className={`badge ${p.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span>
                </td>
                <td className="p-4">
                  {p.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-green-500/20 rounded-lg text-green-400"><CheckCircle className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-red-500/20 rounded-lg text-red-400"><XCircle className="w-4 h-4" /></button>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
