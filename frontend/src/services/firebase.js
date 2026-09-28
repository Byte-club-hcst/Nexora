import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyADLnaRzQyiIdqO9wiVl-PxyJ-c1V0fmrI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexora-2026-3a2f2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexora-2026-3a2f2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexora-2026-3a2f2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "106896070822",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:106896070822:web:034a4718f7b0ed3fefbc67",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export {
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
};
