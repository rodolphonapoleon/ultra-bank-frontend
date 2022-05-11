import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDC0kn5xWzI9hJ5qZZ7PVVJor9Ye5KzvwE",
  authDomain: "bad-bank-339cf.firebaseapp.com",
  projectId: "bad-bank-339cf",
  storageBucket: "bad-bank-339cf.appspot.com",
  messagingSenderId: "128385907464",
  appId: "1:128385907464:web:fd0a85c40a58b5f8798abd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
