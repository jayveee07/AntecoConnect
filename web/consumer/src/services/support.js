import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const generateTicketNumber = () => `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const supportService = {
  getTickets: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await getDocs(
      query(collection(db, 'supportTickets'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  getTicket: async (ticketId) => {
    const snap = await getDoc(doc(db, 'supportTickets', ticketId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  createTicket: async (data) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const ticketNumber = generateTicketNumber();
    const ref = await addDoc(collection(db, 'supportTickets'), {
      userId: user.uid,
      ticketNumber,
      ...data,
      status: 'open',
      priority: 'medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, ticketNumber };
  },

  sendMessage: async (ticketId, message) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    if (!ticketSnap.exists()) throw new Error('Ticket not found');
    const messages = ticketSnap.data().messages || [];
    messages.push({
      userId: user.uid,
      message,
      isStaffReply: false,
      isRead: false,
      timestamp: new Date().toISOString(),
    });
    await updateDoc(ticketRef, { messages, updatedAt: serverTimestamp() });
    return true;
  },

  getFaqs: async () => {
    const snap = await getDocs(
      query(collection(db, 'faqs'), where('isPublished', '==', true), orderBy('sortOrder', 'asc'))
    );
    if (snap.empty) {
      return [
        { id: '1', category: 'Account', question: 'How do I create an account?', answer: 'Click Register on the login page and fill in your details.', isPublished: true },
        { id: '2', category: 'Account', question: 'How do I reset my password?', answer: 'Click Forgot Password on the login page and follow the instructions sent to your email.', isPublished: true },
        { id: '3', category: 'Billing', question: 'How can I view my bill?', answer: 'Log in and navigate to the Billing section to view your current and past bills.', isPublished: true },
        { id: '4', category: 'Billing', question: 'What payment methods are accepted?', answer: 'We accept GCash, Maya, bank transfer, credit/debit cards, and cash payments.', isPublished: true },
        { id: '5', category: 'Outage', question: 'How do I report a power outage?', answer: 'Go to the Outages section and click Report Outage to submit a report.', isPublished: true },
        { id: '6', category: 'Service', question: 'What service requests can I submit?', answer: 'You can request new connections, reconnections, meter installations, and more.', isPublished: true },
      ];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
