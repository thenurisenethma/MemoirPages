// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCyJVqLwySbGZ3MbBEQv81aeIwr5jrnciI",
  authDomain: "memoirpages.firebaseapp.com",
  projectId: "memoirpages",
  storageBucket: "memoirpages.firebasestorage.app",
  messagingSenderId: "167162893930",
  appId: "1:167162893930:web:24277802076cb98d189c13",
  measurementId: "G-MB3D0QX4CS",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Firestore instance
export const db = getFirestore(app);
