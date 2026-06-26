import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const billingService = {
  getCurrentBill: async (accountId) => {
    console.log('[billingService.getCurrentBill] accountId:', accountId);
    if (!accountId) return null;
    const billsSnap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
    );
    console.log('[billingService.getCurrentBill] snap size:', billsSnap.size);
    billsSnap.docs.forEach(d => console.log('[billingService.getCurrentBill] doc:', d.id, d.data()));
    const bills = billsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    bills.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt || 0;
      return bTime - aTime;
    });
    const result = bills.length > 0 ? bills[0] : null;
    console.log('[billingService.getCurrentBill] result:', result);
    return result;
  },

  getBills: async (accountId) => {
    console.log('[billingService.getBills] accountId:', accountId);
    if (!accountId) return [];
    const snap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
    );
    console.log('[billingService.getBills] snap size:', snap.size);
    snap.docs.forEach(d => console.log('[billingService.getBills] doc:', d.id, d.data()));
    const bills = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    bills.sort((a, b) => {
      const aPeriod = a.billingPeriod || '';
      const bPeriod = b.billingPeriod || '';
      return bPeriod.localeCompare(aPeriod);
    });
    console.log('[billingService.getBills] result count:', bills.length);
    return bills;
  },

  getBill: async (billId) => {
    const snap = await getDoc(doc(db, 'billingStatements', billId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  downloadPdf: async (billId) => {
    const bill = await billingService.getBill(billId);
    if (!bill) return null;
    return bill.pdfUrl || null;
  },
};
