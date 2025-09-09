import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Sign up new user
export const signup = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in existing user
export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Log out user
export const logout = async () => {
  return await signOut(auth);
};
