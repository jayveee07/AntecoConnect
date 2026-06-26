import React from 'react';
import { Download, Receipt, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { billingService } from '../services';
import RequireAccount from '../components/RequireAccount';

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
        if (curRes.status === 'fulfilled') setCurrentBill(curRes.value);
        if (allRes.status === 'fulfilled') setBills(allRes.value || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const bill = currentBill || {};
  const breakdown = bill.breakdown || bill;
  const billList = bills.length > 0 ? bills : [];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <RequireAccount>
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

      {currentBill && (
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-200 text-sm">{bill.billingPeriod || bill.billing_period || 'Current Bill'}</p>
              <h2 className="text-4xl font-bold mt-2">&#x20B1;{(bill.totalAmountDue || bill.total_amount_due || 0).toLocaleString()}</h2>
              <p className="text-orange-200 text-sm mt-1">Due: {bill.dueDate || bill.due_date || 'N/A'}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <Receipt className="w-8 h-8" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div><p className="text-orange-200">Meter Reading</p><p className="font-semibold">{bill.kwh || bill.consumption_kwh || 0} kWh</p></div>
            <div><p className="text-orange-200">Days</p><p className="font-semibold">{bill.readingDays || bill.reading_days || 30}</p></div>
            <div><p className="text-orange-200">Rate</p><p className="font-semibold">&#x20B1;{bill.ratePerKwh || bill.rate_per_kwh || '7.50'}/kWh</p></div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Bill Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: 'Generation Charge', value: breakdown.generationCharge || breakdown.generation_charge },
            { label: 'Transmission Charge', value: breakdown.transmissionCharge || breakdown.transmission_charge },
            { label: 'System Loss Charge', value: breakdown.systemLossCharge || breakdown.system_loss_charge },
            { label: 'Distribution Charge', value: breakdown.distributionCharge || breakdown.distribution_charge },
            { label: 'Subsidies', value: breakdown.subsidiesCharge || breakdown.subsidies_charge },
            { label: 'VAT', value: breakdown.vat || breakdown.vat },
            { label: 'Franchise Tax', value: breakdown.franchiseTax || breakdown.franchise_tax },
            { label: 'Penalty', value: breakdown.penalty, isNegative: true },
          ].filter((i) => i.value !== undefined && i.value !== null).map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`text-sm font-semibold ${item.isNegative ? 'text-red-500' : ''}`}>
                &#x20B1;{Number(item.value).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-primary-500">
            <span className="font-bold">Total Amount Due</span>
            <span className="font-bold text-primary-500">&#x20B1;{(bill.totalAmountDue || bill.total_amount_due || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Billing History</h3>
        </div>
        {billList.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No billing history available</p>
        ) : (
          <div className="space-y-3">
            {billList.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${b.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    {b.status === 'paid' ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div>
                    <p className="font-medium">{b.billingPeriod || b.billing_period}</p>
                    <p className="text-xs text-gray-400">{b.kwh || b.consumption_kwh || 0} kWh</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">&#x20B1;{(b.totalAmountDue || b.total_amount_due || 0).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : b.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {billList.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Consumption Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={billList.slice(0, 6).reverse().map((b) => ({ name: b.billingPeriod || b.billing_period || '', kwh: b.kwh || b.consumption_kwh || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#9e9e9e" />
              <YAxis stroke="#9e9e9e" />
              <Tooltip />
              <Bar dataKey="kwh" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
    </RequireAccount>
  );
}
