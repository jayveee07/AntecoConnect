import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const generateRequestNumber = () => `SR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const serviceRequestService = {
  getRequests: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await getDocs(
      query(collection(db, 'serviceRequests'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  getRequest: async (requestId) => {
    const snap = await getDoc(doc(db, 'serviceRequests', requestId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  createRequest: async (data) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const requestNumber = generateRequestNumber();
    const ref = await addDoc(collection(db, 'serviceRequests'), {
      userId: user.uid,
      requestNumber,
      ...data,
      status: 'submitted',
      updates: [{ status: 'submitted', timestamp: new Date().toISOString(), note: 'Request submitted' }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, requestNumber };
  },

  cancelRequest: async (requestId) => {
    await updateDoc(doc(db, 'serviceRequests', requestId), {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  },
};
