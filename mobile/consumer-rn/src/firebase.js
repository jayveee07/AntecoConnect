import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAB5xg3MuXh4a8YBUHjhwplu-8_XLaafNo",
  authDomain: "antecoconnect.firebaseapp.com",
  databaseURL: "https://antecoconnect-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "antecoconnect",
  storageBucket: "antecoconnect.firebasestorage.app",
  messagingSenderId: "741998841135",
  appId: "1:741998841135:web:f92f86259de5260c77a5da",
  measurementId: "G-D8ZKCTS9K4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
