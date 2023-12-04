import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzkc4wb-8hAvg2dFOu4lv0S7b0HZe4veU",
  authDomain: "web-carros-teste.firebaseapp.com",
  projectId: "web-carros-teste",
  storageBucket: "web-carros-teste.appspot.com",
  messagingSenderId: "954133249464",
  appId: "1:954133249464:web:7c7c57dbde1a9d31a8234d",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
