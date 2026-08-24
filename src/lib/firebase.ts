import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Cloudflare Environment Variables & Local Fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCv6Xr40_dhA4GjLiISjutt9BJLxeHD1ks",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rehan-haidar.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rehan-haidar",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rehan-haidar.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "450436831043",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:450436831043:web:e2b3b9b368011523d401f6",
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);
export { onAuthStateChanged };
