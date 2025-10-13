// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "foodhub-service.firebaseapp.com",
  projectId: "foodhub-service",
  storageBucket: "foodhub-service.firebasestorage.app",
  messagingSenderId: "334538944398",
  appId: "1:334538944398:web:95d7315519ee9da3b6fedf",
  measurementId: "G-8DC3JENPDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 const auth = getAuth(app);
export { app, auth };