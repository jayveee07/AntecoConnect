import React from 'react';
import { CreditCard, Smartphone, Building2, Landmark, CheckCircle, ChevronRight } from 'lucide-react';

const paymentMethods = [
  { id: 1, name: 'GCash', type: 'E-Wallet', icon: Smartphone, color: 'bg-blue-500' },
  { id: 2, name: 'Maya', type: 'E-Wallet', icon: Smartphone, color: 'bg-indigo-500' },
  { id: 3, name: 'BPI Bank Transfer', type: 'Bank Transfer', icon: Building2, color: 'bg-red-500' },
  { id: 4, name: 'Credit/Debit Card', type: 'Card', icon: CreditCard, color: 'bg-green-500' },
  { id: 5, name: 'Over-the-Counter', type: 'Payment Center', icon: Landmark, color: 'bg-orange-500' },
];

const history = [
  { ref: 'TXN-2024-001', method: 'GCash', amount: 2145.60, status: 'confirmed', date: 'June 5, 2024' },
  { ref: 'TXN-2024-002', method: 'BPI Transfer', amount: 1980.00, status: 'confirmed', date: 'May 3, 2024' },
  { ref: 'TXN-2024-003', method: 'GCash', amount: 2230.75, status: 'confirmed', date: 'April 2, 2024' },
];

export default function Payments() {
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const [amount, setAmount] = React.useState('2847.50');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Make Payment</h1>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedMethod === method.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className={`${method.color} p-3 rounded-xl`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{method.name}</p>
                <p className="text-sm text-gray-500">{method.type}</p>
              </div>
              {selectedMethod === method.id && (
                <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-8 text-2xl font-bold"
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Amount Due</span>
              <span>₱2,847.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Convenience Fee</span>
              <span>₱0.00</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary-500">₱{parseFloat(amount || 0).toFixed(2)}</span>
            </div>
          </div>
          <button
            disabled={!selectedMethod}
            className="btn-primary w-full"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Payment History</h3>
          <button className="text-primary-500 text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {history.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">{item.method}</p>
                  <p className="text-xs text-gray-500">{item.ref}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₱{item.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
