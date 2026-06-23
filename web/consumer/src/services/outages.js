import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

const generateTicketNumber = () => `OUT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const outageService = {
  getOutages: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await getDocs(
      query(collection(db, 'outageReports'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  getOutage: async (outageId) => {
    const snap = await getDoc(doc(db, 'outageReports', outageId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  reportOutage: async (data) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const ticketNumber = generateTicketNumber();
    const ref = await addDoc(collection(db, 'outageReports'), {
      userId: user.uid,
      ticketNumber,
      ...data,
      status: 'reported',
      priority: data.type === 'transformer_issue' || data.type === 'damaged_line' ? 'high' : 'medium',
      updates: [{ status: 'reported', timestamp: new Date().toISOString(), note: 'Outage reported' }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, ticketNumber };
  },

  trackOutage: async (ticketNumber) => {
    const user = auth.currentUser;
    if (!user) return null;
    const q = query(collection(db, 'outageReports'), where('ticketNumber', '==', ticketNumber), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  getActiveInterruptions: async () => {
    const snap = await getDocs(
      query(collection(db, 'plannedInterruptions'), where('status', 'in', ['upcoming', 'ongoing']), orderBy('startTime', 'asc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  getAllInterruptions: async () => {
    const snap = await getDocs(
      query(collection(db, 'plannedInterruptions'), orderBy('startTime', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
