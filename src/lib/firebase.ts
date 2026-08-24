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

// Updated Firebase Config (rehan-haidar)
const firebaseConfig = {
  apiKey: "AIzaSyCv6Xr40_dhA4GjLiISjutt9BJLxeHD1ks",
  authDomain: "rehan-haidar.firebaseapp.com",
  projectId: "rehan-haidar",
  storageBucket: "rehan-haidar.firebasestorage.app",
  messagingSenderId: "450436831043",
  appId: "1:450436831043:web:e2b3b9b368011523d401f6",
  measurementId: "G-0VNFLZS2P9"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export Auth & Database Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Helper Function
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

// Logout Function
export const logoutUser = () => signOut(auth);
export { onAuthStateChanged };
