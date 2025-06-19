import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { createContext, useState } from "react";

const authContext = createContext<AuthContextType | null>(null);

export const authProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);

  const login = async (email: string, password: string) => {
    try {
      // Login User

      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let message = error.message;
      return {
        success: false,
        message,
      };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Registering User
        const response =await  createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(firestore, 'users', response?.user?.uid), {
          name,
          email,
          uid: response?.user?.uid
        })
      return { success: true };
    } catch (error: any) {
      let message = error.message;
      return {
        success: false,
        message,
      };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
     const response = await crea
    } catch (error) {
      
    }
  }
};
