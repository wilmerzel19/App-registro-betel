

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import  { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbCFmw-SupYG1LBi3O1PpP-Jp6JOx8pII",
  authDomain: "metalmorales-34990.firebaseapp.com",
  projectId: "metalmorales-34990",
  storageBucket: "metalmorales-34990.appspot.com",
  messagingSenderId: "150116482199",
  appId: "1:150116482199:web:26152c0d4b87993fb2bdd2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
