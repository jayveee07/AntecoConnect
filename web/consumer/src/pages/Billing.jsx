import React from 'react';
import { Download, ChevronRight, Receipt, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { billingService } from '../services';

export default function Billing() {
  const [currentBill, setCurrentBill] = React.useState(null);
  const [bills, setBills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const [curRes, allRes] = await Promise.allSettled([
          billingService.getCurrentBill(),
          billingService.getBills(),
        ]);
        if (curRes.status === 'fulfilled') {
          setCurrentBill(curRes.value.data.bill || curRes.value.data.data || curRes.value.data);
        }
        if (allRes.status === 'fulfilled') {
          const d = allRes.value.data;
          setBills(d.bills || d.data || []);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const bill = currentBill || {};
  const breakdown = bill.breakdown || {};
  const billList = bills.length > 0 ? bills : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage your electricity bills</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download All
        </button>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {bill.days_until_due <= 0 ? 'Overdue' : bill.days_until_due <= 7 ? 'Due Soon' : 'Current Bill'}
              </span>
            </div>
            <p className="text-primary-100 text-sm">{bill.billing_period || 'Loading...'}</p>
            <h2 className="text-4xl font-bold mt-1">₱{bill.total_amount_due?.toLocaleString() || '0.00'}</h2>
            <p className="text-primary-100 text-sm mt-1">Due: {bill.due_date || '—'}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Receipt className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{bill.consumption_kwh || 0}</p>
            <p className="text-xs text-primary-100">kWh Used</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{bill.consumption_days || 30}</p>
            <p className="text-xs text-primary-100">Days</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">₱{bill.total_amount_due && bill.consumption_kwh ? (bill.total_amount_due / bill.consumption_kwh).toFixed(2) : '0.00'}</p>
            <p className="text-xs text-primary-100">Per kWh</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Current Bill Breakdown</h3>
        <div className="space-y-3">
          <BreakdownRow label="Generation Charge" amount={breakdown.generation_charge || bill.generation_charge} />
          <BreakdownRow label="Transmission Charge" amount={breakdown.transmission_charge || bill.transmission_charge} />
          <BreakdownRow label="System Loss Charge" amount={breakdown.system_loss_charge || bill.system_loss_charge} />
          <BreakdownRow label="Distribution Charge" amount={breakdown.distribution_charge || bill.distribution_charge} />
          <BreakdownRow label="Subsidies Charge" amount={breakdown.subsidies_charge || bill.subsidies_charge} />
          <hr className="border-gray-200 dark:border-gray-700" />
          <BreakdownRow label="VAT (12%)" amount={breakdown.vat || bill.vat} />
          <hr className="border-gray-200 dark:border-gray-700" />
          <BreakdownRow label="Total Amount Due" amount={bill.total_amount_due} bold highlight />
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Billing History</h3>
        <div className="space-y-2">
          {billList.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{loading ? 'Loading...' : 'No bills found'}</p>
          ) : billList.map((bill, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                {bill.status === 'paid' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Clock className="w-6 h-6 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">{bill.billing_period}</p>
                  <p className="text-sm text-gray-500">{bill.consumption_kwh} kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">₱{parseFloat(bill.total_amount_due || 0).toFixed(2)}</p>
                  {bill.status === 'paid' ? (
                    <span className="badge-success">Paid {bill.paid_at}</span>
                  ) : (
                    <span className="badge-warning">Unpaid</span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, amount, bold, highlight }) {
  const val = amount ? parseFloat(amount) : 0;
  return (
    <div className="flex justify-between items-center">
      <p className={`${bold ? 'font-semibold' : ''} ${highlight ? 'text-primary-500' : ''}`}>{label}</p>
      <p className={`${bold ? 'font-semibold' : ''} ${highlight ? 'text-primary-500 font-bold text-lg' : ''}`}>
        ₱{val.toFixed(2)}
      </p>
    </div>
  );
}
