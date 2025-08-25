
"use server";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, app } from "./firebase"; // Assuming `app` is exported from firebase.ts

let auth: Auth;
// Since app can be undefined on first load, check before calling getAuth
if (app) {
  auth = getAuth(app);
}

// Role checking is now based on Firestore data, not a hardcoded list.
// The isAdmin status will be determined in the AuthContext by reading the user's profile.

// This function can still be used for server-side checks if needed, but the primary
// logic is now client-side in the AuthContext for better reactivity.
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user || !db) {
    return false;
  }
  const userDocRef = doc(db, "users", user.uid);
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data().role === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// We cannot directly export the auth functions from the server component,
// so we wrap them for client-side usage. This file is not used directly
// by components, but its logic is encapsulated within the AuthContext.
export {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
