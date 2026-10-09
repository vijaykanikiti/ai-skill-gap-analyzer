import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";

// =========================================================
// GOOGLE LOGIN
// =========================================================

export const loginWithGoogle = async () => {

  const provider =
    new GoogleAuthProvider();

  const result =
    await signInWithPopup(
      auth,
      provider
    );

  return result.user;
};


// =========================================================
// EMAIL + PASSWORD LOGIN
// =========================================================

export const loginWithEmail = async (
  email,
  password
) => {

  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
};


// =========================================================
// EMAIL + PASSWORD REGISTER
// =========================================================

export const registerWithEmail = async (
  email,
  password
) => {

  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
};


// =========================================================
// GET FIREBASE ID TOKEN
// =========================================================

export const getFirebaseIdToken = async () => {

  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "No Firebase user is currently logged in."
    );
  }

  return await currentUser.getIdToken();
};


// =========================================================
// FORGOT PASSWORD
// =========================================================

export const resetFirebasePassword = async (
  email
) => {

  await sendPasswordResetEmail(
    auth,
    email
  );
};


// =========================================================
// LOGOUT
// =========================================================

export const logoutFirebase = async () => {

  await signOut(auth);

};