
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your own Firebase project configuration!
const firebaseConfig = {
  apiKey: "AIzaSyC4ES0Nd7o-CsjiEPBFeXhPv1E5lVH2HF4",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "nextgenhome-daae4",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "533601655997",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
