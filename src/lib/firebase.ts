// @ts-nocheck
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8IepGW8g7qZ3mZ-abap51wW3GTCRjw-o",
  authDomain: "zees-global-environment.firebaseapp.com",
  databaseURL: "https://zees-global-environment-default-rtdb.firebaseio.com",
  projectId: "zees-global-environment",
  storageBucket: "zees-global-environment.firebasestorage.app",
  messagingSenderId: "1040517613538",
  appId: "1:1040517613538:web:733be845bb11241f2edbbb",
  measurementId: "G-3PHJMV7WYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Auth & Database Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
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
