import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgip5WFKq2UV9JqAJV4jfkx1PKPEecUZ0",
    authDomain: "gym-booking-system-310f7.firebaseapp.com",
    projectId: "gym-booking-system-310f7",
    storageBucket: "gym-booking-system-310f7.firebasestorage.app",
    messagingSenderId: "896594130528",
    appId: "1:896594130528:web:5a152eb0fa65ba5ed33505"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;