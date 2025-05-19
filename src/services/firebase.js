import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const googleProvider = new GoogleAuthProvider();



 
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQ4BlGabtMq-bJfefUXcOH65wG5xCc4Sg",
//   authDomain: "unipar-724a0.firebaseapp.com",
//   projectId: "unipar-724a0",
//   storageBucket: "unipar-724a0.firebasestorage.app",
//   messagingSenderId: "366164634650",
//   appId: "1:366164634650:web:4b78a31814d919220d35a3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app)

// export const googleProvider = new GoogleAuthProvider();