// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiI_5tLlOzU5L1HbmXtHbhwdSw3omiZVc",
  authDomain: "travel-itinerary-app-896c1.firebaseapp.com",
  projectId: "travel-itinerary-app-896c1",
  storageBucket: "travel-itinerary-app-896c1.firebasestorage.app",
  messagingSenderId: "912025465302",
  appId: "1:912025465302:web:ffddaed12fb3c3b24f3477"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleAuthProvider
}