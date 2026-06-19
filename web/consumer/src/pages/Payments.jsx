import React from 'react';
import { CreditCard, Smartphone, Building2, Landmark, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentService } from '../services';

const methodIcons = { ewallet: Smartphone, bank: Building2, card: CreditCard, overthecounter: Landmark };
const methodColors = { ewallet: 'bg-blue-500', bank: 'bg-red-500', card: 'bg-green-500', overthecounter: 'bg-orange-500' };

export default function Payments() {
  const [methods, setMethods] = React.useState([]);
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    Promise.allSettled([
      paymentService.getPaymentMethods(),
      paymentService.getPaymentHistory(),
    ]).then(([mRes, hRes]) => {
      if (mRes.status === 'fulfilled') {
        const d = mRes.value.data.methods || mRes.value.data.data || [];
        setMethods(d);
      }
      if (hRes.status === 'fulfilled') {
        const d = hRes.value.data.payments || hRes.value.data.data || [];
        setHistory(d);
      }
    });
  }, []);

  const handlePay = async () => {
    if (!selectedMethod) { toast.error('Select a payment method'); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    setSubmitting(true);
    try {
      await paymentService.makePayment({ payment_method_id: selectedMethod, amount });
      toast.success('Payment successful!');
      const { data } = await paymentService.getPaymentHistory();
      setHistory(data.payments || data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Make Payment</h1>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {methods.map((method) => {
            const Icon = methodIcons[method.type] || Smartphone;
            const color = methodColors[method.type] || 'bg-gray-500';
            return (
              <button key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`${color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.type}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-8 text-2xl font-bold" placeholder="0.00" />
            </div>
          </div>
          <button onClick={handlePay} disabled={!selectedMethod || submitting}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Payment History</h3>
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No payment history</p>
          ) : history.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">{item.payment_method || item.method}</p>
                  <p className="text-xs text-gray-500">{item.transaction_number || item.reference_number}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₱{parseFloat(item.amount || 0).toFixed(2)}</p>
                <p className="text-xs text-gray-500">{item.confirmed_at || item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
