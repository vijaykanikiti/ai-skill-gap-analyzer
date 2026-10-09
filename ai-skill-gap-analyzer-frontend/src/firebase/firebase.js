import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjmWqJVio0dKGTMEwcO9NB001PAsCf6IM",
  authDomain: "skillgap-ai-4ddff.firebaseapp.com",
  projectId: "skillgap-ai-4ddff",
  storageBucket: "skillgap-ai-4ddff.firebasestorage.app",
  messagingSenderId: "296591406613",
  appId: "1:296591406613:web:3701288672fa236f0d401c",
  measurementId: "G-7Q1T8JJC29"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;