import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const SEED_DATA = {
  consumers: [
    { can: 'ANT-2025-0001', ownerName: 'Juan Dela Cruz', address: '123 P. Burgos St., San Isidro', barangay: 'San Isidro', city: 'Antipolo City', province: 'Rizal', zipCode: '1870', meterNumber: 'MTR-1001', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0002', ownerName: 'Maria Santos', address: '456 M.L. Quezon St., Mayamot', barangay: 'Mayamot', city: 'Antipolo City', province: 'Rizal', zipCode: '1870', meterNumber: 'MTR-1002', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0003', ownerName: 'Pedro Reyes', address: '789 Rizal Ave., San Isidro', barangay: 'San Isidro', city: 'Antipolo City', province: 'Rizal', zipCode: '1870', meterNumber: 'MTR-1003', rateType: 'commercial', status: 'active' },
  ],
  billingStatements: [
    { billNumber: 'BILL-2025-06-001', billingPeriod: 'Jun 2025', dueDate: '2025-07-15', kwh: 245, consumptionKwh: 245, totalAmountDue: 2540.75, amountPaid: 0, balance: 2540.75, status: 'unpaid', readingDays: 30, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-05-001', billingPeriod: 'May 2025', dueDate: '2025-06-15', kwh: 220, consumptionKwh: 220, totalAmountDue: 2281.50, amountPaid: 2281.50, balance: 0, status: 'paid', readingDays: 31, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-04-001', billingPeriod: 'Apr 2025', dueDate: '2025-05-15', kwh: 200, consumptionKwh: 200, totalAmountDue: 2074.00, amountPaid: 2074.00, balance: 0, status: 'paid', readingDays: 30, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-03-001', billingPeriod: 'Mar 2025', dueDate: '2025-04-15', kwh: 210, consumptionKwh: 210, totalAmountDue: 2177.70, amountPaid: 2177.70, balance: 0, status: 'paid', readingDays: 30, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-02-001', billingPeriod: 'Feb 2025', dueDate: '2025-03-15', kwh: 195, consumptionKwh: 195, totalAmountDue: 2022.15, amountPaid: 0, balance: 2022.15, status: 'overdue', readingDays: 28, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-01-001', billingPeriod: 'Jan 2025', dueDate: '2025-02-15', kwh: 180, consumptionKwh: 180, totalAmountDue: 1866.60, amountPaid: 1866.60, balance: 0, status: 'paid', readingDays: 30, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-06-002', billingPeriod: 'Jun 2025', dueDate: '2025-07-15', kwh: 380, consumptionKwh: 380, totalAmountDue: 3940.60, amountPaid: 0, balance: 3940.60, status: 'unpaid', readingDays: 30, ratePerKwh: 8.50 },
    { billNumber: 'BILL-2025-05-002', billingPeriod: 'May 2025', dueDate: '2025-06-15', kwh: 350, consumptionKwh: 350, totalAmountDue: 3629.50, amountPaid: 3629.50, balance: 0, status: 'paid', readingDays: 31, ratePerKwh: 8.50 },
  ],
  consumptionData: [
    { periodType: 'monthly', periodDate: '2025-01-01', consumptionKwh: 180, estimatedCost: 1530 },
    { periodType: 'monthly', periodDate: '2025-02-01', consumptionKwh: 195, estimatedCost: 1657.50 },
    { periodType: 'monthly', periodDate: '2025-03-01', consumptionKwh: 210, estimatedCost: 1785 },
    { periodType: 'monthly', periodDate: '2025-04-01', consumptionKwh: 200, estimatedCost: 1700 },
    { periodType: 'monthly', periodDate: '2025-05-01', consumptionKwh: 220, estimatedCost: 1870 },
    { periodType: 'monthly', periodDate: '2025-06-01', consumptionKwh: 245, estimatedCost: 2082.50 },
    { periodType: 'monthly', periodDate: '2025-06-01', consumptionKwh: 380, estimatedCost: 3230 },
    { periodType: 'monthly', periodDate: '2025-05-01', consumptionKwh: 350, estimatedCost: 2975 },
    { periodType: 'monthly', periodDate: '2025-04-01', consumptionKwh: 340, estimatedCost: 2890 },
    { periodType: 'monthly', periodDate: '2025-03-01', consumptionKwh: 320, estimatedCost: 2720 },
    { periodType: 'monthly', periodDate: '2025-02-01', consumptionKwh: 310, estimatedCost: 2635 },
    { periodType: 'monthly', periodDate: '2025-01-01', consumptionKwh: 300, estimatedCost: 2550 },
  ],
  payments: [
    { amount: 2281.50, paymentMethod: 'gcash', referenceNumber: 'GC-202506-001', status: 'confirmed' },
    { amount: 2074.00, paymentMethod: 'maya', referenceNumber: 'MY-202505-001', status: 'confirmed' },
    { amount: 1866.60, paymentMethod: 'bank_transfer', referenceNumber: 'BT-202504-001', status: 'confirmed' },
    { amount: 3629.50, paymentMethod: 'gcash', referenceNumber: 'GC-202506-002', status: 'confirmed' },
  ],
  outageReports: [
    { ticketNumber: 'OUT-DEMO-001', type: 'power_outage', address: '123 P. Burgos St., San Isidro', description: 'No power since 2pm', status: 'resolved', priority: 'high', updates: [{ status: 'reported', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Outage reported' }, { status: 'resolved', timestamp: new Date().toISOString(), note: 'Power restored' }] },
    { ticketNumber: 'OUT-DEMO-002', type: 'low_voltage', address: '456 M.L. Quezon St., Mayamot', description: 'Lights are dim', status: 'in_progress', priority: 'medium', updates: [{ status: 'reported', timestamp: new Date(Date.now() - 7200000).toISOString(), note: 'Low voltage reported' }, { status: 'in_progress', timestamp: new Date().toISOString(), note: 'Technician dispatched' }] },
  ],
  serviceRequests: [
    { requestNumber: 'SR-DEMO-001', type: 'new_connection', status: 'completed', updates: [{ status: 'completed', timestamp: new Date().toISOString(), note: 'Completed' }] },
    { requestNumber: 'SR-DEMO-002', type: 'reconnection', status: 'under_review', updates: [{ status: 'submitted', timestamp: new Date().toISOString(), note: 'Submitted' }] },
    { requestNumber: 'SR-DEMO-003', type: 'meter_transfer', status: 'submitted', updates: [{ status: 'submitted', timestamp: new Date().toISOString(), note: 'Submitted' }] },
  ],
  supportTickets: [
    { ticketNumber: 'TKT-DEMO-001', category: 'billing', subject: 'Bill inquiry', description: 'My bill seems higher than usual this month.', status: 'resolved', priority: 'medium', messages: [{ userId: 'you', message: 'My bill seems higher than usual.', isStaffReply: false, timestamp: new Date(Date.now() - 86400000).toISOString() }, { userId: 'staff', message: 'We reviewed your bill. The increase is due to higher consumption this billing period due to hot weather.', isStaffReply: true, timestamp: new Date().toISOString() }] },
    { ticketNumber: 'TKT-DEMO-002', category: 'technical_issue', subject: 'Meter issue', description: 'My meter stopped spinning a few days ago.', status: 'open', priority: 'high', messages: [{ userId: 'you', message: 'My meter stopped spinning.', isStaffReply: false, timestamp: new Date().toISOString() }] },
  ],
  plannedInterruptions: [
    { title: 'Line Maintenance - San Isidro', type: 'scheduled', description: 'Routine line maintenance and tree trimming along P. Burgos St.', affectedAreas: ['San Isidro'], status: 'upcoming', isActive: true, startTime: new Date(Date.now() + 86400000 * 7).toISOString(), endTime: new Date(Date.now() + 86400000 * 7 + 3600000 * 5).toISOString(), reason: 'Line maintenance and tree clearing' },
    { title: 'Transformer Replacement - Mayamot', type: 'scheduled', description: 'Replacing old transformer to improve service reliability.', affectedAreas: ['Mayamot'], status: 'upcoming', isActive: true, startTime: new Date(Date.now() + 86400000 * 14).toISOString(), endTime: new Date(Date.now() + 86400000 * 14 + 3600000 * 5).toISOString(), reason: 'Transformer upgrade' },
  ],
  announcements: [
    { title: 'Welcome to ANTECOConnect!', type: 'general', content: 'Your digital gateway to manage your electric cooperative account. View bills, report outages, track consumption, and access services all in one place.', isActive: true, priority: 'high' },
    { title: 'Summer Heat Advisory', type: 'general', content: 'Due to the ongoing hot weather, we advise members to practice energy conservation to help manage demand and avoid power interruptions.', isActive: true, priority: 'medium' },
  ],
  energySavingTips: [
    { category: 'Cooling', title: 'Optimize Air Conditioner Usage', description: 'Set your AC to 25\u00b0C and use a timer to reduce energy consumption by up to 20%.', estimatedSavingsPercent: 20, difficulty: 'easy', isActive: true, sortOrder: 1 },
    { category: 'Lighting', title: 'Switch to LED Bulbs', description: 'LED bulbs use up to 80% less energy than incandescent bulbs and last much longer.', estimatedSavingsPercent: 15, difficulty: 'easy', isActive: true, sortOrder: 2 },
    { category: 'Appliances', title: 'Unplug Devices When Not in Use', description: 'Standby power can account for up to 10% of your electricity bill.', estimatedSavingsPercent: 10, difficulty: 'easy', isActive: true, sortOrder: 3 },
    { category: 'Laundry', title: 'Use Cold Water for Laundry', description: 'Heating water accounts for 90% of the energy used by washing machines.', estimatedSavingsPercent: 8, difficulty: 'easy', isActive: true, sortOrder: 4 },
    { category: 'Advanced', title: 'Install Solar Panels', description: 'Generate your own electricity and reduce dependence on the grid with net metering.', estimatedSavingsPercent: 50, difficulty: 'advanced', isActive: true, sortOrder: 5 },
  ],
  faqs: [
    { category: 'Account', question: 'How do I create an account?', answer: 'Click Register on the login page and fill in your details.', isPublished: true, sortOrder: 1 },
    { category: 'Account', question: 'How do I reset my password?', answer: 'Click Forgot Password on the login page and follow the instructions.', isPublished: true, sortOrder: 2 },
    { category: 'Billing', question: 'How can I view my bill?', answer: 'Log in and go to the Billing section to view current and past bills.', isPublished: true, sortOrder: 3 },
    { category: 'Billing', question: 'What payment methods are accepted?', answer: 'We accept GCash, Maya, bank transfer, credit/debit cards, and cash.', isPublished: true, sortOrder: 4 },
    { category: 'Outage', question: 'How do I report a power outage?', answer: 'Go to the Outages section and click Report Outage.', isPublished: true, sortOrder: 5 },
    { category: 'Service', question: 'What service requests can I submit?', answer: 'You can request new connections, reconnections, meter installations, and more.', isPublished: true, sortOrder: 6 },
  ],
};

const USER_SCOPED = ['billingStatements', 'consumptionData', 'payments', 'outageReports', 'serviceRequests', 'supportTickets'];

async function seedCollection(name, data, userId) {
  let count = 0;
  for (const item of data) {
    try {
      const docData = { ...item, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      if (USER_SCOPED.includes(name) && userId) docData.userId = userId;
      await addDoc(collection(db, name), docData);
      count++;
    } catch (e) {
      console.warn(`Failed to seed ${name}:`, e.message);
    }
  }
  return count;
}

export default function Seed() {
  const navigate = useNavigate();
  const [seeding, setSeeding] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [error, setError] = React.useState('');

  const user = auth.currentUser;

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSeed = async () => {
    setSeeding(true);
    setError('');
    const res = [];
    const userId = auth.currentUser?.uid;
    try {
      for (const [name, data] of Object.entries(SEED_DATA)) {
        const count = await seedCollection(name, data, userId);
        res.push({ name, count, total: data.length });
      }
      setResults(res);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dev Seeder</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {done ? 'Seed complete! Data has been added to Firestore.' : 'Populate Firestore with sample data for development.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-6 space-y-1.5 text-left">
            {results.map((r) => (
              <div key={r.name} className={`text-sm flex justify-between px-3 py-1.5 rounded-lg ${r.count === r.total ? 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400'}`}>
                <span>{r.name}</span>
                <span className="font-semibold">{r.count}/{r.total}</span>
              </div>
            ))}
          </div>
        )}

        {!done ? (
          <button onClick={handleSeed} disabled={seeding}
            className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {seeding && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {seeding ? 'Seeding...' : 'Seed Demo Data'}
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all">
            Go to Dashboard
          </button>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Logged in as: {user?.email || 'Unknown'}
        </p>
      </div>
    </div>
  );
}
