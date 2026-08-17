// @ts-nocheck
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCv6Xr40_dhA4GjLiISjutt9BJLxeHD1ks",
  authDomain: "rehan-haidar.firebaseapp.com",
  projectId: "rehan-haidar",
  storageBucket: "rehan-haidar.firebasestorage.app",
  messagingSenderId: "450436831043",
  appId: "1:450436831043:web:e4c43affc85a46c7d401f6",
  measurementId: "G-D7PP3RFT0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
