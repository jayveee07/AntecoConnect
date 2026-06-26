import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAB5xg3MuXh4a8YBUHjhwplu-8_XLaafNo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'antecoconnect.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://antecoconnect-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'antecoconnect',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'antecoconnect.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '741998841135',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:741998841135:web:f92f86259de5260c77a5da',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-D8ZKCTS9K4',
};

const app = initializeApp(firebaseConfig);
let analytics = null;
try { analytics = getAnalytics(app); } catch (e) { console.warn('Analytics not supported:', e); }
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let messaging = null;
try { messaging = getMessaging(app); } catch (e) { console.warn('FCM not supported:', e); }

export { app, analytics, auth, db, storage, messaging, getToken };
