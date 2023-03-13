import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCmBhQ03J77LpeN6hjY6LYzSbDgaxaWvrc",
  authDomain: "fir-app-c58bd.firebaseapp.com",
  projectId: "fir-app-c58bd",
  storageBucket: "fir-app-c58bd.appspot.com",
  messagingSenderId: "732291242162",
  appId: "1:732291242162:web:39bec9302d05feea9e91ab",
  measurementId: "G-NYZC4ZPJ4N"
};

  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)

  export { db }