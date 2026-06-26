import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const billingService = {
  getCurrentBill: async (accountId) => {
    if (!accountId) return null;
    const billsSnap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
    );
    const bills = billsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    bills.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt || 0;
      return bTime - aTime;
    });
    return bills.length > 0 ? bills[0] : null;
  },

  getBills: async (accountId) => {
    if (!accountId) return [];
    const snap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
    );
    const bills = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    bills.sort((a, b) => {
      const aPeriod = a.billingPeriod || '';
      const bPeriod = b.billingPeriod || '';
      return bPeriod.localeCompare(aPeriod);
    });
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
