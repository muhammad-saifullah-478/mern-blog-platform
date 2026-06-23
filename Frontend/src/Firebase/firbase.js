// Firebase/firbase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDWIIn7nQzpcUGMWA8o19EdRJrL8C3xSdo",
  authDomain: "blogwebsite-1417c.firebaseapp.com",
  projectId: "blogwebsite-1417c",
  storageBucket: "blogwebsite-1417c.firebasestorage.app",
  messagingSenderId: "1002605906515",
  appId: "1:1002605906515:web:3d2767fe78e37a10dc94a6",
  measurementId: "G-8G5NGYMPHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  // Sync with backend
  try {
    const res = await fetch("http://localhost:5000/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        provider: "google",
      }),
      credentials: "include",
    });

    const data = await res.json();
    localStorage.setItem("backendUser", JSON.stringify(data.user || null));
  } catch (err) {
    console.error("Backend sync error:", err);
  }

  return firebaseUser;
};

// Logout
export const logout = async () => {
  await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(console.error);
// logout


  localStorage.removeItem("backendUser");
  await signOut(auth);
};

// Listen to auth changes
export const listenAuthChange = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let backendUser = null;
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        backendUser = data.user || null;
        localStorage.setItem("backendUser", JSON.stringify(backendUser));
      } catch {}
      callback({ ...firebaseUser, backendUser });
    } else {
      callback(null);
    }
  });

  return unsubscribe;
};

// Get backend user from localStorage
export const getBackendUser = () => {
  try {
    const userStr = localStorage.getItem("backendUser");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
