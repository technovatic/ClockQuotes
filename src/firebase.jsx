// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0bhMbdg92f7WdKW61M0Z6A7PE7h2Wodc",
  authDomain: "analogquotes.firebaseapp.com",
  projectId: "analogquotes",
  storageBucket: "analogquotes.appspot.com",
  messagingSenderId: "321838571641",
  appId: "1:321838571641:web:ba83ed37d5cb97b88bf4a8",
  measurementId: "G-54Q13N6YS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to create a new user with email and password
const createUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("User signed up:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing up:", errorCode, errorMessage);
    });
};

// Function to sign in a user with email and password
const signInUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
    });
};

// Export auth and googleProvider for use in other parts of your application
export { auth, googleProvider, createUser, signInUser };
