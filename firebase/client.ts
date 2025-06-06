
import { initializeApp,getApp,getApps } from "firebase/app";

import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"



const firebaseConfig = {
  apiKey: "AIzaSyBf3BPNfeO-mpfAMXZEv0v_vThtYtVxmXs",
  authDomain: "prepwise-f2ddc.firebaseapp.com",
  projectId: "prepwise-f2ddc",
  storageBucket: "prepwise-f2ddc.firebasestorage.app",
  messagingSenderId: "579287518593",
  appId: "1:579287518593:web:ad01001bcdc6f70bedec80",
  measurementId: "G-FHT2EYG4L3"
};

// Initialize Firebase
const app =!getApps.length? initializeApp(firebaseConfig):getApp();
export const auth =getAuth(app);
export const db=getFirestore(app);