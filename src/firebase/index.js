// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGYY1M6FrfJurlStr98LnmKk7al5pyt0E",
  authDomain: "vandal-project-2b16e.firebaseapp.com",
  projectId: "vandal-project-2b16e",
  storageBucket: "vandal-project-2b16e.firebasestorage.app",
  messagingSenderId: "48931134017",
  appId: "1:48931134017:web:852d246da8e6d071fdc4c0",
  measurementId: "G-NHG2QQDVFC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// const analytics = getAnalytics(app);
