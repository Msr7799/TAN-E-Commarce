// ============================================================
// Firebase Configuration & Initialization
// ============================================================

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCrw-S3ucIuF5RZD6vRLYdRhr2UedHESM0",
  authDomain: "marbella-e35dd.firebaseapp.com",
  projectId: "marbella-e35dd",
  storageBucket: "marbella-e35dd.firebasestorage.app",
  messagingSenderId: "824914440922",
  appId: "1:824914440922:web:3b091399d94240512cabe3",
  measurementId: "G-ZP0CVQ85H5",
  databaseURL: "https://marbella-e35dd-default-rtdb.firebaseio.com",
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app);

export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.warn("Firebase analytics support check failed", error);
    });
}

export default app;
