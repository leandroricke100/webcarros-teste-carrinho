import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCssu1Ogg0ImfEn_KxKe0OF8YmgFjVg84I",
  authDomain: "webcarros-46756.firebaseapp.com",
  projectId: "webcarros-46756",
  storageBucket: "webcarros-46756.appspot.com",
  messagingSenderId: "352720205702",
  appId: "1:352720205702:web:ca28f5a7d14884e41a9e07",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
