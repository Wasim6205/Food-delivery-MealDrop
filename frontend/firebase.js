// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mealdrop-food-delivery.firebaseapp.com",
  projectId: "mealdrop-food-delivery",
  storageBucket: "mealdrop-food-delivery.firebasestorage.app",
  messagingSenderId: "184155707137",
  appId: "1:184155707137:web:5f757cdc42874872f66d00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth}