import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export const billingService = {
  getCurrentBill: async (accountId) => {
    if (!accountId) return null;
    const billsSnap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId), orderBy('createdAt', 'desc'), limit(1))
    );
    return billsSnap.empty ? null : { id: billsSnap.docs[0].id, ...billsSnap.docs[0].data() };
  },

  getBills: async (accountId) => {
    if (!accountId) return [];
    const snap = await getDocs(
      query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId), orderBy('billingPeriod', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
