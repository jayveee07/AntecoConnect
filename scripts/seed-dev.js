/**
 * Dev Seed Utility — paste this into your browser console while logged in
 * as admin on the ANTECOConnect consumer app to seed dummy data.
 * 
 * Usage:
 * 1. Log in to ANTECOConnect as any user
 * 2. Open browser console (F12)
 * 3. Copy-paste this entire file and press Enter
 * 4. Type: seedAll() and press Enter
 */

const SEED_DATA = {
  consumers: [
    { can: 'ANT-2025-0001', ownerName: 'Juan Dela Cruz', address: '123 Mabini St., Brgy. 5', barangay: 'Brgy. 5', city: 'San Jose de Buenavista', province: 'Antique', zipCode: '5700', meterNumber: 'MTR-1001', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0002', ownerName: 'Maria Santos', address: '456 Rizal St., Brgy. San Angel', barangay: 'San Angel', city: 'Sibalom', province: 'Antique', zipCode: '5713', meterNumber: 'MTR-1002', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0003', ownerName: 'Pedro Reyes', address: '789 Quezon Ave., Brgy. Igbaclag', barangay: 'Igbaclag', city: 'Hamtic', province: 'Antique', zipCode: '5715', meterNumber: 'MTR-1003', rateType: 'commercial', status: 'active' },
    { can: 'ANT-2025-0004', ownerName: 'Ana Gonzales', address: '321 Bonifacio St., Brgy. Funda', barangay: 'Funda', city: 'San Jose de Buenavista', province: 'Antique', zipCode: '5700', meterNumber: 'MTR-1004', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0005', ownerName: 'Jose Rizal II', address: '555 National Rd., Brgy. Astorga', barangay: 'Astorga', city: 'Sibalom', province: 'Antique', zipCode: '5713', meterNumber: 'MTR-1005', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0006', ownerName: 'Linda Mercado', address: '888 Dela Cruz St., Brgy. Bongbongan', barangay: 'Bongbongan', city: 'Hamtic', province: 'Antique', zipCode: '5715', meterNumber: 'MTR-1006', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0007', ownerName: 'Antonio Villanueva', address: '12 Lakeview Drive, Brgy. 4', barangay: 'Brgy. 4', city: 'San Jose de Buenavista', province: 'Antique', zipCode: '5700', meterNumber: 'MTR-1007', rateType: 'commercial', status: 'active' },
    { can: 'ANT-2025-0008', ownerName: 'Cristina Lopez', address: '76 Lopez Jaena St., Brgy. Culasi', barangay: 'Culasi', city: 'Sibalom', province: 'Antique', zipCode: '5713', meterNumber: 'MTR-1008', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0009', ownerName: 'Ramon Fernandez', address: '90 Gomez St., Brgy. San Jose', barangay: 'San Jose', city: 'Hamtic', province: 'Antique', zipCode: '5715', meterNumber: 'MTR-1009', rateType: 'residential', status: 'active' },
    { can: 'ANT-2025-0010', ownerName: 'Sofia Morales', address: '234 Luna St., Brgy. Supa', barangay: 'Supa', city: 'San Jose de Buenavista', province: 'Antique', zipCode: '5700', meterNumber: 'MTR-1010', rateType: 'commercial', status: 'active' },
  ],
  users: [
    { uid: 'demo-consumer-1', role: 'consumer', first_name: 'Juan', last_name: 'Dela Cruz', email: 'juan@anteco.ph', mobile_number: '09171234567', address_line1: '123 P. Burgos St.', barangay: 'San Isidro', city: 'Antipolo City', province: 'Rizal', zip_code: '1870', isEmailVerified: true, accountStatus: 'active', is_verified: true },
    { uid: 'demo-consumer-2', role: 'consumer', first_name: 'Maria', last_name: 'Santos', email: 'maria@anteco.ph', mobile_number: '09179876543', address_line1: '456 M.L. Quezon St.', barangay: 'Mayamot', city: 'Antipolo City', province: 'Rizal', zip_code: '1870', isEmailVerified: true, accountStatus: 'active', is_verified: true },
  ],
  billingStatements: [
    { userId: 'demo-consumer-1', consumerAccountId: 'ANT-2025-0001', billNumber: 'BILL-2025-06-001', billingPeriod: 'Jun 2025', dueDate: '2025-07-15', kwh: 245, totalAmountDue: 2540.75, amountPaid: 0, balance: 2540.75, status: 'unpaid', readingDays: 30, ratePerKwh: 8.50, breakdown: { generationCharge: 1102.50, transmissionCharge: 208.25, systemLossCharge: 110.25, distributionCharge: 539.00, subsidiesCharge: 73.50, vat: 232.43, franchiseTax: 40.72 } },
    { userId: 'demo-consumer-1', consumerAccountId: 'ANT-2025-0001', billNumber: 'BILL-2025-05-001', billingPeriod: 'May 2025', dueDate: '2025-06-15', kwh: 220, totalAmountDue: 2281.50, amountPaid: 2281.50, balance: 0, status: 'paid', readingDays: 31, ratePerKwh: 8.50, breakdown: { generationCharge: 990.00, transmissionCharge: 187.00, systemLossCharge: 99.00, distributionCharge: 484.00, subsidiesCharge: 66.00, vat: 207.72, franchiseTax: 36.52 } },
    { userId: 'demo-consumer-1', consumerAccountId: 'ANT-2025-0001', billNumber: 'BILL-2025-04-001', billingPeriod: 'Apr 2025', dueDate: '2025-05-15', kwh: 200, totalAmountDue: 2074.00, amountPaid: 2074.00, balance: 0, status: 'paid', readingDays: 30, ratePerKwh: 8.50, breakdown: { generationCharge: 900.00, transmissionCharge: 170.00, systemLossCharge: 90.00, distributionCharge: 440.00, subsidiesCharge: 60.00, vat: 188.40, franchiseTax: 33.20 } },
    { userId: 'demo-consumer-2', consumerAccountId: 'ANT-2025-0003', billNumber: 'BILL-2025-06-002', billingPeriod: 'Jun 2025', dueDate: '2025-07-15', kwh: 380, totalAmountDue: 3940.60, amountPaid: 0, balance: 3940.60, status: 'unpaid', readingDays: 30, ratePerKwh: 8.50, breakdown: { generationCharge: 1710.00, transmissionCharge: 323.00, systemLossCharge: 171.00, distributionCharge: 836.00, subsidiesCharge: 114.00, vat: 356.60, franchiseTax: 62.80 } },
    { userId: 'demo-consumer-2', consumerAccountId: 'ANT-2025-0003', billNumber: 'BILL-2025-05-002', billingPeriod: 'May 2025', dueDate: '2025-06-15', kwh: 350, totalAmountDue: 3629.50, amountPaid: 3629.50, balance: 0, status: 'paid', readingDays: 31, ratePerKwh: 8.50, breakdown: { generationCharge: 1575.00, transmissionCharge: 297.50, systemLossCharge: 157.50, distributionCharge: 770.00, subsidiesCharge: 105.00, vat: 327.80, franchiseTax: 57.75 } },
  ],
  consumptionData: [
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-01-01', periodYear: 2025, consumptionKwh: 180, estimatedCost: 1530 },
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-02-01', periodYear: 2025, consumptionKwh: 195, estimatedCost: 1657.50 },
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-03-01', periodYear: 2025, consumptionKwh: 210, estimatedCost: 1785 },
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-04-01', periodYear: 2025, consumptionKwh: 200, estimatedCost: 1700 },
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-05-01', periodYear: 2025, consumptionKwh: 220, estimatedCost: 1870 },
    { userId: 'demo-consumer-1', periodType: 'monthly', periodDate: '2025-06-01', periodYear: 2025, consumptionKwh: 245, estimatedCost: 2082.50 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-01-01', periodYear: 2025, consumptionKwh: 300, estimatedCost: 2550 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-02-01', periodYear: 2025, consumptionKwh: 310, estimatedCost: 2635 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-03-01', periodYear: 2025, consumptionKwh: 320, estimatedCost: 2720 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-04-01', periodYear: 2025, consumptionKwh: 340, estimatedCost: 2890 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-05-01', periodYear: 2025, consumptionKwh: 350, estimatedCost: 2975 },
    { userId: 'demo-consumer-2', periodType: 'monthly', periodDate: '2025-06-01', periodYear: 2025, consumptionKwh: 380, estimatedCost: 3230 },
  ],
  payments: [
    { userId: 'demo-consumer-1', amount: 2281.50, paymentMethod: 'gcash', referenceNumber: 'GC-202506-001', status: 'confirmed' },
    { userId: 'demo-consumer-1', amount: 2074.00, paymentMethod: 'maya', referenceNumber: 'MY-202505-001', status: 'confirmed' },
    { userId: 'demo-consumer-2', amount: 3629.50, paymentMethod: 'bank_transfer', referenceNumber: 'BT-202506-001', status: 'confirmed' },
  ],
  outageReports: [
    { userId: 'demo-consumer-1', ticketNumber: 'OUT-DEMO-001', type: 'power_outage', address: '123 P. Burgos St., San Isidro', description: 'No power since 2pm', status: 'resolved', priority: 'high', updates: [{ status: 'reported', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Outage reported' }, { status: 'resolved', timestamp: new Date().toISOString(), note: 'Power restored' }] },
    { userId: 'demo-consumer-2', ticketNumber: 'OUT-DEMO-002', type: 'low_voltage', address: '456 M.L. Quezon St., Mayamot', description: 'Lights are dim in the area', status: 'in_progress', priority: 'medium', updates: [{ status: 'reported', timestamp: new Date(Date.now() - 7200000).toISOString(), note: 'Low voltage reported' }, { status: 'in_progress', timestamp: new Date().toISOString(), note: 'Technician dispatched' }] },
  ],
  serviceRequests: [
    { userId: 'demo-consumer-1', requestNumber: 'SR-DEMO-001', type: 'new_connection', status: 'completed', notes: 'New house connection installed' },
    { userId: 'demo-consumer-1', requestNumber: 'SR-DEMO-002', type: 'reconnection', status: 'under_review', notes: 'Reconnect service after payment' },
    { userId: 'demo-consumer-2', requestNumber: 'SR-DEMO-003', type: 'meter_transfer', status: 'submitted', notes: 'Transfer meter to new address' },
  ],
  supportTickets: [
    { userId: 'demo-consumer-1', ticketNumber: 'TKT-DEMO-001', category: 'billing', subject: 'Bill inquiry', description: 'My bill seems higher than usual.', status: 'resolved', priority: 'medium', messages: [{ userId: 'demo-consumer-1', message: 'My bill seems higher than usual.', isStaffReply: false, timestamp: new Date(Date.now() - 86400000).toISOString() }, { userId: 'admin', message: 'We checked your bill. Consumption was higher due to hot weather.', isStaffReply: true, timestamp: new Date().toISOString() }] },
    { userId: 'demo-consumer-2', ticketNumber: 'TKT-DEMO-002', category: 'technical_issue', subject: 'Meter issue', description: 'Meter stopped spinning.', status: 'open', priority: 'high', messages: [{ userId: 'demo-consumer-2', message: 'My meter stopped spinning.', isStaffReply: false, timestamp: new Date().toISOString() }] },
  ],
  plannedInterruptions: [
    { title: 'Line Maintenance - San Isidro', type: 'scheduled', description: 'Routine line maintenance along P. Burgos St.', affectedAreas: ['San Isidro'], status: 'upcoming', isActive: true, startTime: new Date(Date.now() + 86400000 * 7).toISOString(), reason: 'Line maintenance' },
    { title: 'Transformer Replacement - Mayamot', type: 'scheduled', description: 'Replacing old transformer.', affectedAreas: ['Mayamot'], status: 'upcoming', isActive: true, startTime: new Date(Date.now() + 86400000 * 14).toISOString(), reason: 'Transformer upgrade' },
  ],
  announcements: [
    { title: 'Welcome to ANTECOConnect!', type: 'general', content: 'Your digital gateway to manage your electric cooperative account. View bills, report outages, and more.', isActive: true, priority: 'high' },
    { title: 'Summer Heat Advisory', type: 'general', content: 'Practice energy conservation to help manage demand during the hot season.', isActive: true, priority: 'medium' },
  ],
  energySavingTips: [
    { category: 'Cooling', title: 'Optimize Air Conditioner', description: 'Set AC to 25\u00b0C and use a timer. Clean filters monthly.', estimatedSavingsPercent: 20, difficulty: 'easy', isActive: true, sortOrder: 1 },
    { category: 'Lighting', title: 'Switch to LED Bulbs', description: 'LED bulbs use 80% less energy than incandescent bulbs.', estimatedSavingsPercent: 15, difficulty: 'easy', isActive: true, sortOrder: 2 },
    { category: 'Appliances', title: 'Unplug Devices', description: 'Standby power can account for 10% of your bill. Unplug when not in use.', estimatedSavingsPercent: 10, difficulty: 'easy', isActive: true, sortOrder: 3 },
    { category: 'Advanced', title: 'Install Solar Panels', description: 'Generate your own electricity with net metering.', estimatedSavingsPercent: 50, difficulty: 'advanced', isActive: true, sortOrder: 4 },
  ],
  faqs: [
    { category: 'Account', question: 'How do I create an account?', answer: 'Click Register on the login page and fill in your details.', isPublished: true, sortOrder: 1 },
    { category: 'Account', question: 'How do I reset my password?', answer: 'Click Forgot Password on the login page.', isPublished: true, sortOrder: 2 },
    { category: 'Billing', question: 'How can I view my bill?', answer: 'Log in and go to the Billing section.', isPublished: true, sortOrder: 3 },
    { category: 'Billing', question: 'What payment methods are accepted?', answer: 'GCash, Maya, bank transfer, credit/debit cards, and cash.', isPublished: true, sortOrder: 4 },
    { category: 'Outage', question: 'How do I report a power outage?', answer: 'Go to Outages and click Report Outage.', isPublished: true, sortOrder: 5 },
  ],
};

const USER_SCOPED = ['billingStatements', 'consumptionData', 'payments', 'outageReports', 'serviceRequests', 'supportTickets'];
const PUBLIC_COLLECTIONS = ['consumers', 'plannedInterruptions', 'announcements', 'energySavingTips', 'faqs'];

async function seedCollection(name, data, userId) {
  const { db } = await import('./firebase.js');
  const { collection, addDoc, Timestamp } = await import('firebase/firestore');

  let count = 0;
  for (const item of data) {
    try {
      const docData = { ...item, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      if (USER_SCOPED.includes(name) && userId) docData.userId = userId;
      await addDoc(collection(db, name), docData);
      count++;
    } catch (e) {
      console.warn(`  Failed to seed ${name}:`, e.message);
    }
  }
  console.log(`  Seeded ${count}/${data.length} ${name}`);
}

async function seedAll(userId) {
  const uid = userId || (await import('./firebase.js')).auth?.currentUser?.uid;
  if (!uid) {
    console.error('You must be logged in to seed data. Pass userId or log in first.');
    return;
  }
  console.log('ANTECOConnect Dev Seeder');
  console.log(`Seeding Firestore for user: ${uid}\n`);

  for (const [collectionName, data] of Object.entries(SEED_DATA)) {
    await seedCollection(collectionName, data, uid);
  }

  console.log('\nDone! Refresh the app to see seeded data.');
}

// Make it available globally
window.seedAll = seedAll;
console.log('Dev seeder loaded!');
console.log('Run: seedAll() to populate Firestore with demo data');
