// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config (DON'T hardcode in production — use .env instead)
const firebaseConfig = {
  apiKey: "AIzaSyA-bLpPyM__Am-p_JVqVHC2aN3cCWrbQIA",
  authDomain: "v-events-87376.firebaseapp.com",
  projectId: "v-events-87376",
  storageBucket: "v-events-87376.appspot.com", // fixed typo from `.app` to `.com`
  messagingSenderId: "560467718748",
  appId: "1:560467718748:web:57b881799f7a66fffe2c99",
  measurementId: "G-BYEWTC5Q8P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics only if supported (avoids server-side errors in Next.js)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

// Initialize other services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
