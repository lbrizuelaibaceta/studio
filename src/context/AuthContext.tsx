
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app, db } from "@/lib/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { SalonName } from "@/components/forms/LeadFormSchema";

interface UserProfile {
  userName: string;
  salonName: string;
  role: 'admin' | 'vendedor';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userName: string | null;
  salon: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userName: string, salonName: SalonName) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [salon, setSalon] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        // User is signed in, now fetch their profile from Firestore
        if (db) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userProfile = userDocSnap.data() as UserProfile;
            setIsAdmin(userProfile.role === 'admin');
            setUserName(userProfile.userName);
            setSalon(userProfile.salonName);
          } else {
            // This can happen briefly during registration before the doc is created.
            // Or if a user is in Auth but not Firestore for some reason.
            console.warn("User profile not found in Firestore for UID:", user.uid);
            setIsAdmin(false);
            setUserName(null);
            setSalon(null);
          }
        }
      } else {
        // User is signed out
        setUser(null);
        setIsAdmin(false);
        setUserName(null);
        setSalon(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const register = async (email: string, password: string, userName: string, salonName: SalonName) => {
    if (!db) {
      throw new Error("Firestore is not initialized.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Now, create the user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      userName: userName,
      salonName: salonName,
      role: 'vendedor' // All new sign-ups are vendors
    });

    // The onAuthStateChanged listener will automatically pick up the new user state
    return userCredential;
  };


  const value = {
    user,
    loading,
    isAdmin,
    userName,
    salon,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
