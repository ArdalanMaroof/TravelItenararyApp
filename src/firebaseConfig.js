// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKmd5Wn_w-gL8aYo4WekPp0ap5kVz8amg",
  authDomain: "travelapp9899.firebaseapp.com",
  projectId: "travelapp9899",
  storageBucket: "travelapp9899.firebasestorage.app",
  messagingSenderId: "963898498719",
  appId: "1:963898498719:web:10c5d2545642558dd98caa",
  measurementId: "G-J1BX65QBN1"
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