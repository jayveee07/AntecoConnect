import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export const dashboardService = {
  getAll: async () => {
    const user = auth.currentUser;
    if (!user) return {};

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};

    const billsSnap = await getDocs(
      query(collection(db, 'billingStatements'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(6))
    );
    const bills = billsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const currentBill = bills.find(b => b.status === 'unpaid' || b.status === 'pending') || bills[0] || null;

    const outagesSnap = await getDocs(
      query(collection(db, 'outageReports'), where('userId', '==', user.uid), where('status', 'in', ['reported', 'verified', 'assigned', 'in_progress']), limit(5))
    );
    const activeOutages = outagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const requestsSnap = await getDocs(
      query(collection(db, 'serviceRequests'), where('userId', '==', user.uid), where('status', 'in', ['submitted', 'under_review']), limit(5))
    );
    const pendingRequests = requestsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const announcementsSnap = await getDocs(
      query(collection(db, 'announcements'), where('isActive', '==', true), orderBy('createdAt', 'desc'), limit(3))
    );
    const announcements = announcementsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const interruptionsSnap = await getDocs(
      query(collection(db, 'plannedInterruptions'), where('status', 'in', ['upcoming', 'ongoing']), orderBy('startTime', 'asc'), limit(3))
    );
    const interruptions = interruptionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const totalBilled = bills.reduce((sum, b) => sum + (b.totalAmountDue || 0), 0);
    const totalPaid = bills.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

    return {
      user: userData,
      currentBill,
      bills,
      totalBilled,
      totalPaid,
      outstandingBalance: totalBilled - totalPaid,
      activeOutages,
      pendingRequests,
      announcements,
      interruptions,
      quickActions: [
        { label: 'View Bill', path: '/billing', icon: 'FileText' },
        { label: 'Report Outage', path: '/outages', icon: 'AlertTriangle' },
        { label: 'Request Service', path: '/service-requests', icon: 'Wrench' },
        { label: 'Contact Support', path: '/support', icon: 'Headphones' },
      ],
    };
  },
};
