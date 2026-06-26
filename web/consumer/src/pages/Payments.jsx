import React from 'react';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { paymentService } from '../services';
import toast from 'react-hot-toast';
import RequireAccount from '../components/RequireAccount';

export default function Payments() {
  const [payments, setPayments] = React.useState([]);
  const [methods, setMethods] = React.useState([]);
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying] = React.useState(false);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const [payRes, methRes] = await Promise.allSettled([
          paymentService.getPaymentHistory(),
          paymentService.getPaymentMethods(),
        ]);
        if (payRes.status === 'fulfilled') setPayments(payRes.value || []);
        if (methRes.status === 'fulfilled') setMethods(methRes.value || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!selectedMethod) { toast.error('Please select a payment method'); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { toast.error('Please enter a valid amount'); return; }
    setPaying(true);
    try {
      await paymentService.makePayment({
        paymentMethod: selectedMethod,
        amount: Number(amount),
        referenceNumber: `PAY-${Date.now()}`,
      });
      toast.success('Payment submitted successfully!');
      setAmount('');
      setSelectedMethod(null);
      const updated = await paymentService.getPaymentHistory();
      setPayments(updated || []);
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <RequireAccount>
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-gray-500 dark:text-gray-400">Make payments and view your payment history</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Make a Payment</h3>
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(methods.length > 0 ? methods : [
                { code: 'gcash', name: 'GCash', type: 'ewallet' },
                { code: 'maya', name: 'Maya', type: 'ewallet' },
                { code: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
                { code: 'credit_card', name: 'Credit/Debit Card', type: 'card' },
                { code: 'cash', name: 'Cash', type: 'overthecounter' },
              ]).map((m) => (
                <button key={m.code} type="button" onClick={() => setSelectedMethod(m.code)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedMethod === m.code ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}>
                  <CreditCard className={`w-5 h-5 mb-2 ${selectedMethod === m.code ? 'text-primary-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.type}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Amount (&#x20B1;)</label>
            <input type="number" step="0.01" min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <button type="submit" disabled={paying} className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {paying && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {paying ? 'Processing...' : `Pay ${amount ? `\u20B1${Number(amount).toLocaleString()}` : ''}`}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No payment history yet</p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${p.status === 'confirmed' || p.status === 'verified' ? 'bg-green-100 dark:bg-green-900/30' : p.status === 'failed' || p.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    {p.status === 'confirmed' || p.status === 'verified' ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> : p.status === 'failed' || p.status === 'rejected' ? <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" /> : <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div>
                    <p className="font-medium">&#x20B1;{(p.amount || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{p.paymentMethod || p.payment_method} - {p.referenceNumber || p.reference_number}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  p.status === 'confirmed' || p.status === 'verified' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  p.status === 'failed' || p.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </RequireAccount>
  );
}
