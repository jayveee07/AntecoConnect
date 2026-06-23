import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

export const paymentService = {
  getPaymentHistory: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await getDocs(
      query(collection(db, 'payments'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  makePayment: async (paymentData) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const ref = await addDoc(collection(db, 'payments'), {
      userId: user.uid,
      ...paymentData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, ...paymentData, status: 'pending' };
  },

  getPaymentMethods: async () => {
    const snap = await getDocs(collection(db, 'paymentGateways'));
    if (snap.empty) {
      return [
        { code: 'gcash', name: 'GCash', type: 'ewallet', isActive: true },
        { code: 'maya', name: 'Maya', type: 'ewallet', isActive: true },
        { code: 'bank_transfer', name: 'Bank Transfer', type: 'bank', isActive: true },
        { code: 'credit_card', name: 'Credit/Debit Card', type: 'card', isActive: true },
        { code: 'cash', name: 'Cash', type: 'overthecounter', isActive: true },
      ];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
