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
export const analytics = getAnalytics(app);

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
