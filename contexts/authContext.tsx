import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
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
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,

        }
        setUser({...userData})
      }
      
    } catch (error: any) {
      const message = error.message;
      
      console.log('Error', message);
      
    }
  }

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData
  }

  return (
    <AuthContext.Provider value={contextValue}> 
      {children}
    </AuthContext.Provider>
  )
};


export const useAuth = ():AuthContextType => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('userAuth must be wrapped inside AuthProvider')
  }
  return context;
}