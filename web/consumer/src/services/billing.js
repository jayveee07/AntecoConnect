import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export const billingService = {
  getCurrentBill: async (accountId) => {
    const user = auth.currentUser;
    if (!user) return null;
    const conditions = [where('userId', '==', user.uid)];
    if (accountId) conditions.push(where('consumerAccountId', '==', accountId));
    const billsSnap = await getDocs(
      query(collection(db, 'billingStatements'), ...conditions, orderBy('createdAt', 'desc'), limit(1))
    );
    if (billsSnap.empty) return null;
    return { id: billsSnap.docs[0].id, ...billsSnap.docs[0].data() };
  },

  getBills: async (accountId) => {
    const user = auth.currentUser;
    if (!user) return [];
    const conditions = [where('userId', '==', user.uid)];
    if (accountId) conditions.push(where('consumerAccountId', '==', accountId));
    const snap = await getDocs(
      query(collection(db, 'billingStatements'), ...conditions, orderBy('billingPeriod', 'desc'))
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
