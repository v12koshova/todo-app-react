import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, remove, set } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true)



  async function signup(email, password) {
    try {
        const data = await auth.createUserWithEmailAndPassword(email, password);
        const userId = data.user.uid;

        await set(ref(db, `users/${userId}/`), {
            id: userId,
        });
        await data.user.sendEmailVerification()
        await data.user.reload()
        return data;
    } catch (error) {
        console.error("Error during signup:", error);
        throw error;
    }
}

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function signout() {
    return auth.signOut()
  }

  function changePassword(password) {
    return currentUser.updatePassword(password);
  }
  function changeEmail(email) {
    return currentUser.updateEmail(email);
  }

  function resetPass(email) {
    return auth.sendPasswordResetEmail(email)
  }

  async function deleteAcc() {
    try {
      await remove(ref(db, `users/${currentUser.uid}`))
      await currentUser.delete();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false)
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signout,
    changePassword,
    changeEmail,
    resetPass,
    deleteAcc
  };
  return <AuthContext.Provider value={value}>
    {!loading && children}
    </AuthContext.Provider>;
}
