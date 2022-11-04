import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDmuM0VOy54z2NiDUhlCh9JmF3Ak_bZ9ao",
  authDomain: "backend-coder-977e5.firebaseapp.com",
  projectId: "backend-coder-977e5",
  storageBucket: "backend-coder-977e5.appspot.com",
  messagingSenderId: "535979638004",
  appId: "1:535979638004:web:dca8fd34d6dbf2433cf2a1",
};

const app = initializeApp(firebaseConfig);
const initFirebase = () => app;

export default initFirebase;
