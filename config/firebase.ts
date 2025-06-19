import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBy0V0Y_sFmWsevlKVbLd0dS7rCvlmTGnk",
  authDomain: "expense-tracker-b71f4.firebaseapp.com",
  projectId: "expense-tracker-b71f4",
  storageBucket: "expense-tracker-b71f4.firebasestorage.app",
  messagingSenderId: "43380806076",
  appId: "1:43380806076:web:c2e8de4b5e2deb1a9a5bb9",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);
