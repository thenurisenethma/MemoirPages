// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyJVqLwySbGZ3MbBEQv81aeIwr5jrnciI",
  authDomain: "memoirpages.firebaseapp.com",
  projectId: "memoirpages",
  storageBucket: "memoirpages.firebasestorage.app",
  messagingSenderId: "167162893930",
  appId: "1:167162893930:web:24277802076cb98d189c13",
  measurementId: "G-MB3D0QX4CS"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()

export const db = getFirestore(app)
export const auth = getAuth(app)
