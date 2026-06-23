import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

export const authService = {
  register: async ({ first_name, last_name, email, password, mobile_number, address_line1, barangay, city, province, zip_code }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      role: 'consumer',
      first_name,
      last_name,
      email,
      mobile_number,
      phoneNumber: mobile_number,
      address_line1,
      barangay,
      city,
      province,
      zip_code,
      isEmailVerified: false,
      accountStatus: 'active',
      is_verified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { user: { uid: user.uid, first_name, last_name, email, mobile_number } };
  },

  login: async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    const userData = userDoc.data() || {};
    return { user: { uid: cred.user.uid, ...userData } };
  },

  firebaseLogin: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const names = (user.displayName || '').split(' ');
      return { needs_profile: true, firebase_token: user.uid, first_name: names[0] || '', last_name: names.slice(1).join(' ') || '', email: user.email };
    }
    return { user: { uid: user.uid, ...userDoc.data() }, token: user.uid };
  },

  completeProfile: async ({ first_name, last_name, mobile_number, address_line1, barangay, city, province, zip_code }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      role: 'consumer',
      first_name: first_name || user.displayName?.split(' ')[0] || '',
      last_name: last_name || user.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      mobile_number,
      phoneNumber: mobile_number,
      address_line1,
      barangay,
      city,
      province,
      zip_code,
      isEmailVerified: user.emailVerified,
      accountStatus: 'active',
      is_verified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { user: { uid: user.uid, first_name, last_name, email: user.email, mobile_number } };
  },

  logout: async () => {
    await signOut(auth);
  },

  forgotPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  resetPassword: async ({ token, newPassword }) => {
    await confirmPasswordReset(auth, token, newPassword);
  },

  getProfile: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const data = userDoc.data() || {};
    return { data: { ...data, consumer_code: data.consumer_code || `ANT-${user.uid.slice(0, 8).toUpperCase()}` } };
  },

  updateProfile: async (data) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const updates = { ...data, updatedAt: serverTimestamp() };
    await updateDoc(doc(db, 'users', user.uid), updates);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return { data: userDoc.data() };
  },

  changePassword: async ({ current_password, password }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const cred = EmailAuthProvider.credential(user.email, current_password);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, password);
  },
};
