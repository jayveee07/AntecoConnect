import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function getAccounts(userId) {
  const snap = await getDoc(doc(db, 'linkAccounts', userId));
  return snap.exists() ? (snap.data().accounts || []) : [];
}

export async function getBills(accountId) {
  if (!accountId) return [];
  const snap = await getDocs(
    query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => ((b.billingPeriod || '') > (a.billingPeriod || '') ? 1 : -1));
}

export async function getCurrentBill(accountId) {
  const bills = await getBills(accountId);
  return bills.find(b => b.status === 'unpaid' || b.status === 'pending') || bills[0] || null;
}
