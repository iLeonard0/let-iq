import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgJ6kil1guRDhcb-VZ1LTjq_UGdp12Rj0",
  authDomain: "letiq-oficial.firebaseapp.com",
  projectId: "letiq-oficial",
  storageBucket: "letiq-oficial.firebasestorage.app",
  messagingSenderId: "718814774855",
  appId: "1:718814774855:web:9d1bb4aa3a39be7ca15362",
  measurementId: "G-LY15K63KP8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
