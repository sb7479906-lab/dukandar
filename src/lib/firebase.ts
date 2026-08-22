// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
