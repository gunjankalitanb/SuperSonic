import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
// import 'firebase/firestore';
// import 'firebase/storage';
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALZ7StzF2bUqi59dfnJU_9ZkpceFau3UA",
  authDomain: "supersonic-41476.firebaseapp.com",
  projectId: "supersonic-41476",
  storageBucket: "supersonic-41476.appspot.com",
  messagingSenderId: "1098799948389",
  appId: "1:1098799948389:web:6ffbfebda2566aba0c5c8c",
};

// const firebase = initializeApp(firebaseConfig);

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
// const fs = firebase.firestore();
// const storage = firebase.storage();
const app = initializeApp(firebaseConfig);

//  export default firebaseConfig;
// Set authentication persistence to "LOCAL"

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
