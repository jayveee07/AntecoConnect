import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export async function getNotifications() {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(
    query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function markAsRead(id) {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}

export async function markAllAsRead() {
  const user = auth.currentUser;
  if (!user) return;
  const snap = await getDocs(
    query(collection(db, 'notifications'), where('userId', '==', user.uid), where('read', '==', false))
  );
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { read: true })));
}
