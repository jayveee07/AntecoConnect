import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAB5xg3MuXh4a8YBUHjhwplu-8_XLaafNo",
  authDomain: "antecoconnect.firebaseapp.com",
  projectId: "antecoconnect",
  storageBucket: "antecoconnect.firebasestorage.app",
  messagingSenderId: "741998841135",
  appId: "1:741998841135:web:f92f86259de5260c77a5da",
  measurementId: "G-D8ZKCTS9K4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { app, analytics, auth, db, storage, messaging, getToken };
