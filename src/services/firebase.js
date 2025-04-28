import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBcVorjdsaeHjQkgLejDKM69WMvRZ6RqEY",
  authDomain: "letiq-quizapp.firebaseapp.com",
  projectId: "letiq-quizapp",
  storageBucket: "letiq-quizapp.firebasestorage.app",
  messagingSenderId: "295583194433",
  appId: "1:295583194433:web:bd016943c33a43e22055c0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);