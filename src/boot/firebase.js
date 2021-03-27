import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnzJsuF-1KBPEOyNVU2PfWIQtIRXgvtQw",
  authDomain: "qwitter-rajeshj3.firebaseapp.com",
  projectId: "qwitter-rajeshj3",
  storageBucket: "qwitter-rajeshj3.appspot.com",
  messagingSenderId: "411593026078",
  appId: "1:411593026078:web:27b1c605226ea06c825c0f"
};

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db
