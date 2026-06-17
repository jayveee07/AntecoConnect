import React from 'react';
import { Download, ChevronRight, Receipt, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const bills = [
  { period: 'June 2024', amount: 2847.50, status: 'unpaid', due: 'July 15, 2024', kwh: 260 },
  { period: 'May 2024', amount: 2145.60, status: 'paid', paidAt: 'June 5, 2024', kwh: 240 },
  { period: 'April 2024', amount: 1980.00, status: 'paid', paidAt: 'May 3, 2024', kwh: 210 },
  { period: 'March 2024', amount: 2230.75, status: 'paid', paidAt: 'April 2, 2024', kwh: 250 },
  { period: 'February 2024', amount: 1890.25, status: 'paid', paidAt: 'March 5, 2024', kwh: 195 },
  { period: 'January 2024', amount: 1675.50, status: 'paid', paidAt: 'February 4, 2024', kwh: 180 },
];

export default function Billing() {
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

      {/* Current Bill Highlight */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Due Soon</span>
            </div>
            <p className="text-primary-100 text-sm">June 2024 Billing Period</p>
            <h2 className="text-4xl font-bold mt-1">₱2,847.50</h2>
            <p className="text-primary-100 text-sm mt-1">Due: July 15, 2024</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Receipt className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">260</p>
            <p className="text-xs text-primary-100">kWh Used</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">30</p>
            <p className="text-xs text-primary-100">Days</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">₱10.95</p>
            <p className="text-xs text-primary-100">Per kWh</p>
          </div>
        </div>
      </div>

      {/* Billing Breakdown */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Current Bill Breakdown</h3>
        <div className="space-y-3">
          <BreakdownRow label="Generation Charge" amount={1430.00} />
          <BreakdownRow label="Transmission Charge" amount={312.00} />
          <BreakdownRow label="System Loss Charge" amount={208.00} />
          <BreakdownRow label="Distribution Charge" amount={650.00} />
          <BreakdownRow label="Subsidies Charge" amount={78.00} />
          <hr className="border-gray-200 dark:border-gray-700" />
          <BreakdownRow label="Subtotal" amount={2678.00} bold />
          <BreakdownRow label="VAT (12%)" amount={169.50} />
          <hr className="border-gray-200 dark:border-gray-700" />
          <BreakdownRow label="Total Amount Due" amount={2847.50} bold highlight />
        </div>
      </div>

      {/* Bill History */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Billing History</h3>
        <div className="space-y-2">
          {bills.map((bill, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                {bill.status === 'paid' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Clock className="w-6 h-6 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">{bill.period}</p>
                  <p className="text-sm text-gray-500">{bill.kwh} kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">₱{bill.amount.toFixed(2)}</p>
                  {bill.status === 'paid' ? (
                    <span className="badge-success">Paid {bill.paidAt}</span>
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
  return (
    <div className="flex justify-between items-center">
      <p className={`${bold ? 'font-semibold' : ''} ${highlight ? 'text-primary-500' : ''}`}>{label}</p>
      <p className={`${bold ? 'font-semibold' : ''} ${highlight ? 'text-primary-500 font-bold text-lg' : ''}`}>
        ₱{amount.toFixed(2)}
      </p>
    </div>
  );
}
