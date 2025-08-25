
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { app, db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

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
            // Handle case where user exists in Auth but not in Firestore
            console.error("User profile not found in Firestore!");
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

  const value = {
    user,
    loading,
    isAdmin,
    userName,
    salon,
    login,
    logout,
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
