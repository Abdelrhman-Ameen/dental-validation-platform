"use client";

import {
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

async function setSessionCookie() {
  const token = await auth.currentUser?.getIdToken(true);
  if (!token) {
    return;
  }
  await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });
}

export async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  await setSessionCookie();
  return result.user;
}

export async function loginWithEmail(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  await setSessionCookie();
  return result.user;
}

export async function registerWithEmail(name: string, email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await setSessionCookie();
  return result.user;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  try {
    await signOut(auth);
  } catch {
    // Local admin sessions do not always have an active Firebase user to sign out.
  }
}
