import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getAccounts, getBills } from './billing';

export async function getDashboardData(accountId) {
  const user = auth.currentUser;
  if (!user) return {};

  let bills = [];
  if (accountId) {
    bills = await getBills(accountId);
    bills = bills.slice(0, 6);
  }

  const currentBill = bills.find(b => b.status === 'unpaid' || b.status === 'pending') || bills[0] || null;

  return { currentBill, bills };
}
