import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyBWjfZBQ4LI8XkIuKBqCzZEUAwXCUSWUDo",
  authDomain: "schoolbustracker-11ddd.firebaseapp.com",
  projectId: "schoolbustracker-11ddd",
  storageBucket: "schoolbustracker-11ddd.appspot.com",
  messagingSenderId: "976122677882",
  appId: "1:976122677882:web:ea213e86cc88b2c95809c3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

export { database, auth, firebaseConfig }