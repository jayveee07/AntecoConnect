import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export const dashboardService = {
  getAll: async (accountId) => {
    const user = auth.currentUser;
    if (!user) return {};
    console.log('[dashboardService.getAll] accountId:', accountId);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};

    let bills = [];
    if (accountId) {
      console.log('[dashboardService.getAll] querying billingStatements for consumerAccountId:', accountId);
      const snap = await getDocs(
        query(collection(db, 'billingStatements'), where('consumerAccountId', '==', accountId))
      );
      console.log('[dashboardService.getAll] snap size:', snap.size);
      snap.docs.forEach(d => console.log('[dashboardService.getAll] doc:', d.id, d.data()));
      bills = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0))
        .slice(0, 6);
    } else {
      console.log('[dashboardService.getAll] no accountId provided');
    }

    console.log('[dashboardService.getAll] bills array length:', bills.length);
    const currentBill = bills.find(b => b.status === 'unpaid' || b.status === 'pending') || bills[0] || null;
    console.log('[dashboardService.getAll] currentBill:', currentBill);

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
