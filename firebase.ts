import { initializeApp } from "firebase/app";
// Fix: Changed firebase/auth to @firebase/auth to resolve module loading issue.
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from './constants';

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };