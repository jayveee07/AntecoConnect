import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Config ---
const SERVICE_ACCOUNT_PATH = resolve(__dirname, 'service-account.json');
const DATABASE_URL = 'https://antecoconnect-default-rtdb.asia-southeast1.firebasedatabase.app';

// --- Sample Data ---
const SAMPLE_USERS = [
  {
    uid: 'consumer-001',
    role: 'consumer',
    first_name: 'Juan',
    last_name: 'Dela Cruz',
    email: 'juan@example.com',
    mobile_number: '09171234567',
    phoneNumber: '09171234567',
    address_line1: '123 P. Burgos St.',
    barangay: 'San Isidro',
    city: 'Antipolo City',
    province: 'Rizal',
    zip_code: '1870',
    isEmailVerified: true,
    accountStatus: 'active',
    is_verified: true,
  },
  {
    uid: 'consumer-002',
    role: 'consumer',
    first_name: 'Maria',
    last_name: 'Santos',
    email: 'maria@example.com',
    mobile_number: '09179876543',
    phoneNumber: '09179876543',
    address_line1: '456 M.L. Quezon St.',
    barangay: 'Mayamot',
    city: 'Antipolo City',
    province: 'Rizal',
    zip_code: '1870',
    isEmailVerified: true,
    accountStatus: 'active',
    is_verified: true,
  },
  {
    uid: 'admin-001',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@anteco.ph',
    mobile_number: '09170000001',
    phoneNumber: '09170000001',
    address_line1: 'ANTECO Building, Sumulong Hwy',
    barangay: 'Bagong Nayon',
    city: 'Antipolo City',
    province: 'Rizal',
    zip_code: '1870',
    isEmailVerified: true,
    accountStatus: 'active',
    is_verified: true,
  },
];

const SAMPLE_ACCOUNTS = [
  { userId: 'consumer-001', account_number: 'ANT-2024-0001', meter_number: 'MTR-100001', service_address: '123 P. Burgos St., San Isidro, Antipolo City', connection_type: 'residential', status: 'active' },
  { userId: 'consumer-001', account_number: 'ANT-2024-0002', meter_number: 'MTR-100002', service_address: 'Unit B, 123 P. Burgos St., San Isidro, Antipolo City', connection_type: 'residential', status: 'active' },
  { userId: 'consumer-002', account_number: 'ANT-2024-0003', meter_number: 'MTR-100003', service_address: '456 M.L. Quezon St., Mayamot, Antipolo City', connection_type: 'commercial', status: 'active' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = 2025;

function generateBills(userId, accountId) {
  const bills = [];
  for (let i = 0; i < 6; i++) {
    const monthIdx = ((new Date().getMonth() - i) + 12) % 12;
    const year = new Date().getMonth() - i < 0 ? CURRENT_YEAR - 1 : CURRENT_YEAR;
    const kwh = Math.round(180 + Math.random() * 150);
    const genCharge = kwh * 4.50;
    const transCharge = kwh * 0.85;
    const sysLossCharge = kwh * 0.45;
    const distCharge = kwh * 2.20;
    const subsidiesCharge = kwh * 0.30;
    const vat = (genCharge + transCharge + sysLossCharge + distCharge + subsidiesCharge) * 0.12;
    const franchiseTax = (genCharge + transCharge + sysLossCharge + distCharge + subsidiesCharge) * 0.02;
    const total = Math.round((genCharge + transCharge + sysLossCharge + distCharge + subsidiesCharge + vat + franchiseTax) * 100) / 100;
    const status = i === 0 ? 'unpaid' : i === 1 ? 'overdue' : 'paid';
    const dueDate = new Date(year, monthIdx + 1, 15);
    bills.push({
      userId,
      consumerAccountId: accountId,
      billNumber: `BILL-${year}-${String(monthIdx + 1).padStart(2, '0')}-${accountId.slice(-4)}`,
      billingPeriod: `${MONTHS[monthIdx]} ${year}`,
      billingDate: new Date(year, monthIdx, 1).toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      kwh,
      consumptionKwh: kwh,
      generationCharge: Math.round(genCharge * 100) / 100,
      transmissionCharge: Math.round(transCharge * 100) / 100,
      systemLossCharge: Math.round(sysLossCharge * 100) / 100,
      distributionCharge: Math.round(distCharge * 100) / 100,
      subsidiesCharge: Math.round(subsidiesCharge * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      franchiseTax: Math.round(franchiseTax * 100) / 100,
      totalAmountDue: total,
      amountPaid: status === 'paid' ? total : 0,
      balance: status === 'paid' ? 0 : total,
      status,
      readingDays: 30,
      ratePerKwh: 8.50,
      breakdown: {
        generationCharge: Math.round(genCharge * 100) / 100,
        transmissionCharge: Math.round(transCharge * 100) / 100,
        systemLossCharge: Math.round(sysLossCharge * 100) / 100,
        distributionCharge: Math.round(distCharge * 100) / 100,
        subsidiesCharge: Math.round(subsidiesCharge * 100) / 100,
        vat: Math.round(vat * 100) / 100,
        franchiseTax: Math.round(franchiseTax * 100) / 100,
      },
    });
  }
  return bills;
}

function generateConsumption(userId) {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const monthIdx = ((new Date().getMonth() - i) + 12) % 12;
    const year = new Date().getMonth() - i < 0 ? CURRENT_YEAR - 1 : CURRENT_YEAR;
    const kwh = Math.round(160 + Math.random() * 140);
    data.push({
      userId,
      periodType: 'monthly',
      periodDate: `${year}-${String(monthIdx + 1).padStart(2, '0')}-01`,
      periodYear: year,
      periodMonth: monthIdx + 1,
      consumptionKwh: kwh,
      kwh,
      estimatedCost: Math.round(kwh * 8.50 * 100) / 100,
      averageDailyKwh: Math.round((kwh / 30) * 10) / 10,
      status: i > 0 ? 'actual' : 'estimated',
    });
  }
  return data;
}

const SAMPLE_PAYMENTS = [
  { userId: 'consumer-001', amount: 2500.00, paymentMethod: 'gcash', referenceNumber: 'GC-202501-001', status: 'confirmed' },
  { userId: 'consumer-001', amount: 2100.00, paymentMethod: 'maya', referenceNumber: 'MY-202502-001', status: 'confirmed' },
  { userId: 'consumer-002', amount: 3200.00, paymentMethod: 'bank_transfer', referenceNumber: 'BT-202501-001', status: 'confirmed' },
  { userId: 'consumer-002', amount: 1800.00, paymentMethod: 'cash', referenceNumber: 'CS-202502-001', status: 'pending' },
];

const SAMPLE_OUTAGES = [
  { userId: 'consumer-001', ticketNumber: 'OUT-A1B2C3', type: 'power_outage', address: '123 P. Burgos St., San Isidro', description: 'No power since 2pm', status: 'resolved', priority: 'high', updates: [
    { status: 'reported', timestamp: '2025-01-15T14:00:00Z', note: 'Outage reported' },
    { status: 'verified', timestamp: '2025-01-15T14:30:00Z', note: 'Crew dispatched' },
    { status: 'in_progress', timestamp: '2025-01-15T15:00:00Z', note: 'Repair in progress' },
    { status: 'resolved', timestamp: '2025-01-15T16:30:00Z', note: 'Power restored' },
  ]},
  { userId: 'consumer-002', ticketNumber: 'OUT-D4E5F6', type: 'low_voltage', address: '456 M.L. Quezon St., Mayamot', description: 'Lights are dim', status: 'in_progress', priority: 'medium', updates: [
    { status: 'reported', timestamp: '2025-06-22T09:00:00Z', note: 'Low voltage reported' },
    { status: 'verified', timestamp: '2025-06-22T10:00:00Z', note: 'Technician assigned' },
    { status: 'in_progress', timestamp: '2025-06-22T11:00:00Z', note: 'Checking transformer' },
  ]},
];

const SAMPLE_REQUESTS = [
  { userId: 'consumer-001', requestNumber: 'SR-NEWCONN-001', type: 'new_connection', status: 'completed', preferredDate: '2025-01-10', notes: 'New house connection' },
  { userId: 'consumer-001', requestNumber: 'SR-RECONN-001', type: 'reconnection', status: 'under_review', preferredDate: '2025-06-25', notes: 'Reconnect after payment' },
  { userId: 'consumer-002', requestNumber: 'SR-MTRXFR-001', type: 'meter_transfer', status: 'submitted', preferredDate: '2025-07-01', notes: 'Transfer meter to new location' },
];

const SAMPLE_TICKETS = [
  { userId: 'consumer-001', ticketNumber: 'TKT-BILL-001', category: 'billing', subject: 'Question about bill charges', description: 'My bill seems higher than usual this month.', status: 'resolved', priority: 'medium', messages: [
    { userId: 'consumer-001', message: 'My bill seems higher than usual this month.', isStaffReply: false, timestamp: '2025-06-20T08:00:00Z' },
    { userId: 'admin-001', message: 'We reviewed your bill. The increase is due to higher consumption this billing period due to the hot weather.', isStaffReply: true, timestamp: '2025-06-20T10:00:00Z' },
  ]},
  { userId: 'consumer-002', ticketNumber: 'TKT-TECH-001', category: 'technical_issue', subject: 'Meter not working', description: 'My meter stopped spinning.', status: 'in_progress', priority: 'high', messages: [
    { userId: 'consumer-002', message: 'My meter stopped spinning a few days ago.', isStaffReply: false, timestamp: '2025-06-21T14:00:00Z' },
  ]},
];

const SAMPLE_INTERRUPTIONS = [
  { title: 'Line Maintenance - San Isidro', type: 'scheduled', description: 'Routine line maintenance and tree trimming along P. Burgos St.', affectedAreas: ['San Isidro', 'Bagong Nayon'], status: 'upcoming', startTime: '2025-07-15T09:00:00Z', endTime: '2025-07-15T14:00:00Z', reason: 'Line maintenance and tree clearing' },
  { title: 'Transformer Replacement - Mayamot', type: 'scheduled', description: 'Replacing old transformer to improve service reliability.', affectedAreas: ['Mayamot', 'Sta. Cruz'], status: 'upcoming', startTime: '2025-07-20T10:00:00Z', endTime: '2025-07-20T15:00:00Z', reason: 'Transformer upgrade' },
  { title: 'Emergency Line Repair - Dalig', type: 'emergency', description: 'Urgent repair of damaged primary line due to weather.', affectedAreas: ['Dalig', 'Munting Dilao'], status: 'ongoing', startTime: '2025-06-23T06:00:00Z', endTime: '2025-06-23T18:00:00Z', reason: 'Weather damage repair' },
  { title: 'Feeder Maintenance - Cupang', type: 'scheduled', description: 'Scheduled feeder maintenance to prevent outages.', affectedAreas: ['Cupang', 'San Jose'], status: 'completed', startTime: '2025-06-10T08:00:00Z', endTime: '2025-06-10T13:00:00Z', reason: 'Preventive maintenance' },
];

const SAMPLE_ANNOUNCEMENTS = [
  { title: 'New Online Payment Portal Launch', type: 'general', content: 'We are excited to announce the launch of our new online payment portal. Members can now pay their bills conveniently through GCash, Maya, and bank transfer.', isActive: true, priority: 'high', publishedAt: '2025-06-01T00:00:00Z' },
  { title: 'Scheduled System Maintenance', type: 'maintenance', content: 'ANTECOConnect will be undergoing scheduled maintenance on July 5, 2025 from 2:00 AM to 5:00 AM. Services may be temporarily unavailable.', isActive: true, priority: 'medium', publishedAt: '2025-06-15T00:00:00Z' },
  { title: 'Summer Heat Advisory', type: 'general', content: 'Due to the ongoing summer heat, we advise members to practice energy conservation to help manage demand and avoid power interruptions.', isActive: true, priority: 'low', publishedAt: '2025-05-20T00:00:00Z' },
];

const SAMPLE_TIPS = [
  { category: 'Cooling', title: 'Optimize Air Conditioner Usage', description: 'Set your AC to 25\u00b0C and use a timer to reduce energy consumption by up to 20%.', detailedAdvice: 'Clean filters monthly and ensure proper sealing of windows and doors.', estimatedSavingsPercent: 20, difficulty: 'easy', tags: ['ac', 'cooling', 'summer'], isActive: true, sortOrder: 1 },
  { category: 'Lighting', title: 'Switch to LED Bulbs', description: 'LED bulbs use up to 80% less energy than incandescent bulbs and last much longer.', detailedAdvice: 'Replace your most-used bulbs first for immediate savings.', estimatedSavingsPercent: 15, difficulty: 'easy', tags: ['lighting', 'led'], isActive: true, sortOrder: 2 },
  { category: 'Appliances', title: 'Unplug Devices When Not in Use', description: 'Standby power can account for up to 10% of your electricity bill.', detailedAdvice: 'Use power strips to easily switch off multiple devices at once.', estimatedSavingsPercent: 10, difficulty: 'easy', tags: ['standby', 'vampire-power'], isActive: true, sortOrder: 3 },
  { category: 'Laundry', title: 'Use Cold Water for Laundry', description: 'Heating water accounts for 90% of the energy used by washing machines.', detailedAdvice: 'Modern detergents work well with cold water for most loads.', estimatedSavingsPercent: 8, difficulty: 'easy', tags: ['laundry', 'water-heating'], isActive: true, sortOrder: 4 },
  { category: 'Refrigeration', title: 'Optimize Refrigerator Temperature', description: 'Set your fridge to 3-5\u00b0C and freezer to -18\u00b0C for optimal efficiency.', detailedAdvice: 'Ensure proper airflow around the refrigerator and clean coils annually.', estimatedSavingsPercent: 5, difficulty: 'easy', tags: ['refrigerator', 'temperature'], isActive: true, sortOrder: 5 },
  { category: 'Advanced', title: 'Install Solar Panels', description: 'Generate your own electricity and reduce dependence on the grid.', detailedAdvice: 'Consider net metering to sell excess power back to the grid.', estimatedSavingsPercent: 50, difficulty: 'advanced', tags: ['solar', 'renewable'], isActive: true, sortOrder: 6 },
];

const SAMPLE_FAQS = [
  { category: 'Account', question: 'How do I create an account?', answer: 'Click "Get Started" on the landing page or "Register" on the login page. Fill in your personal details including name, email, mobile number, and address. Once registered, you can log in immediately.', isPublished: true, sortOrder: 1 },
  { category: 'Account', question: 'How do I link my electric service account?', answer: 'After logging in, go to your Profile and select "Linked Accounts". Enter your account number to link it.', isPublished: true, sortOrder: 2 },
  { category: 'Account', question: 'How do I reset my password?', answer: 'Click "Forgot Password?" on the login page and enter your email. We will send you a link to reset your password.', isPublished: true, sortOrder: 3 },
  { category: 'Billing', question: 'How can I view my bill?', answer: 'Log in and click "Billing" from the dashboard or sidebar. Your current bill and billing history are displayed.', isPublished: true, sortOrder: 4 },
  { category: 'Billing', question: 'What payment methods are accepted?', answer: 'We accept GCash, Maya, bank transfer, credit/debit cards, and cash payments at our office.', isPublished: true, sortOrder: 5 },
  { category: 'Billing', question: 'Can I download my bill as PDF?', answer: 'Yes. On the billing page, click the download icon next to any billing statement to save it as a PDF.', isPublished: true, sortOrder: 6 },
  { category: 'Outage', question: 'How do I report a power outage?', answer: 'Log in, go to Outages, and click "Report Outage". Select the type, provide location and description, then submit.', isPublished: true, sortOrder: 7 },
  { category: 'Outage', question: 'How can I track my outage report?', answer: 'On the Outages page, enter your ticket number in the tracking field to see the current status.', isPublished: true, sortOrder: 8 },
  { category: 'Service', question: 'What service requests can I submit?', answer: 'You can request new connections, reconnections, meter installations, meter transfers, and change of ownership.', isPublished: true, sortOrder: 9 },
  { category: 'Service', question: 'Can I cancel a pending request?', answer: 'Yes. Go to Service Requests and click "Cancel" on any pending request.', isPublished: true, sortOrder: 10 },
];

// --- Timestamp helper ---
function ts(date) {
  return admin.firestore.Timestamp.fromDate(new Date(date || Date.now()));
}

function now() {
  return admin.firestore.Timestamp.now();
}

// --- Main seeder ---
async function seed() {
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('Service account file not found at:', SERVICE_ACCOUNT_PATH);
    console.error('\nTo generate one:');
    console.error('  1. Go to https://console.firebase.google.com/project/antecoconnect/settings/serviceaccounts');
    console.error('  2. Click "Generate new private key"');
    console.error('  3. Save the file as "service-account.json" in the scripts/ directory');
    console.error('\nOr run with environment variable:');
    console.error('  GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json node seed.js');
    process.exit(1);
  }

  console.log('Initializing Firebase Admin SDK...');
  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
  });

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question('This will DELETE all existing data and reseed. Continue? (y/N): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'y') {
    console.log('Aborted.');
    process.exit(0);
  }

  const collections = [
    'users', 'consumerAccounts', 'billingStatements', 'payments',
    'outageReports', 'serviceRequests', 'supportTickets',
    'announcements', 'plannedInterruptions',
    'consumptionData', 'aiPredictions',
    'energySavingTips', 'faqs',
  ];

  console.log('\nClearing existing data...');
  for (const col of collections) {
    const snap = await db.collection(col).get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    console.log(`  Cleared ${col} (${snap.size} docs)`);
  }

  console.log('\nSeeding data...\n');

  // Users
  for (const u of SAMPLE_USERS) {
    await db.collection('users').doc(u.uid).set({
      ...u,
      createdAt: now(),
      updatedAt: now(),
    });
    console.log(`  Created user: ${u.first_name} ${u.last_name} (${u.uid})`);
  }

  // Consumer accounts
  for (const a of SAMPLE_ACCOUNTS) {
    const ref = db.collection('consumerAccounts').doc();
    await ref.set({
      ...a,
      createdAt: now(),
      updatedAt: now(),
    });
    console.log(`  Created account: ${a.account_number}`);
  }

  // Bills
  const accountIds = {};
  const acctSnap = await db.collection('consumerAccounts').get();
  acctSnap.docs.forEach((d) => {
    const data = d.data();
    if (!accountIds[data.userId]) accountIds[data.userId] = [];
    accountIds[data.userId].push(d.id);
  });

  for (const [userId, ids] of Object.entries(accountIds)) {
    for (const accountId of ids) {
      const bills = generateBills(userId, accountId);
      for (const b of bills) {
        const ref = db.collection('billingStatements').doc();
        await ref.set({
          ...b,
          dueDate: b.dueDate,
          billingDate: b.billingDate,
          createdAt: ts(b.billingDate),
          updatedAt: now(),
        });
      }
      console.log(`  Created ${bills.length} bills for account ${accountId}`);
    }
  }

  // Consumption data
  for (const userId of ['consumer-001', 'consumer-002']) {
    const data = generateConsumption(userId);
    for (const c of data) {
      const ref = db.collection('consumptionData').doc();
      await ref.set({
        ...c,
        createdAt: ts(c.periodDate),
        updatedAt: now(),
      });
    }
    console.log(`  Created ${data.length} consumption records for ${userId}`);
  }

  // Payments
  for (const p of SAMPLE_PAYMENTS) {
    const ref = db.collection('payments').doc();
    await ref.set({
      ...p,
      createdAt: ts('2025-01-15'),
      updatedAt: now(),
    });
    console.log(`  Created payment: ${p.referenceNumber}`);
  }

  // Outages
  for (const o of SAMPLE_OUTAGES) {
    const ref = db.collection('outageReports').doc();
    await ref.set({
      ...o,
      updates: o.updates.map((u) => ({ ...u, timestamp: u.timestamp })),
      createdAt: ts(o.updates[0]?.timestamp),
      updatedAt: now(),
    });
    console.log(`  Created outage: ${o.ticketNumber}`);
  }

  // Service requests
  for (const r of SAMPLE_REQUESTS) {
    const ref = db.collection('serviceRequests').doc();
    await ref.set({
      ...r,
      updates: [{ status: r.status, timestamp: new Date().toISOString(), note: 'Request processed' }],
      createdAt: ts(r.preferredDate),
      updatedAt: now(),
    });
    console.log(`  Created request: ${r.requestNumber}`);
  }

  // Support tickets
  for (const t of SAMPLE_TICKETS) {
    const ref = db.collection('supportTickets').doc();
    await ref.set({
      ...t,
      messages: t.messages.map((m) => ({ ...m, timestamp: m.timestamp })),
      createdAt: ts(t.messages[0]?.timestamp),
      updatedAt: now(),
    });
    console.log(`  Created ticket: ${t.ticketNumber}`);
  }

  // Interruptions
  for (const i of SAMPLE_INTERRUPTIONS) {
    const ref = db.collection('plannedInterruptions').doc();
    await ref.set({
      ...i,
      isActive: i.status === 'upcoming' || i.status === 'ongoing',
      startTime: i.startTime,
      endTime: i.endTime,
      createdAt: now(),
      updatedAt: now(),
    });
    console.log(`  Created interruption: ${i.title}`);
  }

  // Announcements
  for (const a of SAMPLE_ANNOUNCEMENTS) {
    const ref = db.collection('announcements').doc();
    await ref.set({
      ...a,
      publishedAt: a.publishedAt,
      createdAt: ts(a.publishedAt),
      updatedAt: now(),
    });
    console.log(`  Created announcement: ${a.title}`);
  }

  // Energy saving tips
  for (const t of SAMPLE_TIPS) {
    const ref = db.collection('energySavingTips').doc();
    await ref.set({
      ...t,
      createdAt: now(),
      updatedAt: now(),
    });
    console.log(`  Created tip: ${t.title}`);
  }

  // FAQs
  for (const f of SAMPLE_FAQS) {
    const ref = db.collection('faqs').doc();
    await ref.set({
      ...f,
      createdAt: now(),
      updatedAt: now(),
    });
    console.log(`  Created FAQ: ${f.question.slice(0, 40)}...`);
  }

  console.log('\n\u2705 Seed complete!');
  console.log('\nTest accounts:');
  console.log('  Consumer 1: juan@example.com (password: use Firebase Auth to create)');
  console.log('  Consumer 2: maria@example.com (password: use Firebase Auth to create)');
  console.log('  Admin:      admin@anteco.ph  (password: use Firebase Auth to create)');
  console.log('\nNote: Passwords are not seeded. Register these emails through the app to set passwords.');
}

seed().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
