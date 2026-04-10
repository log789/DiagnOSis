import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AppUser, UserRole } from "@/types/user";

interface AuthPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export async function registerUser(payload: AuthPayload): Promise<AppUser> {
  const cred = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );

  const appUser: AppUser = {
    uid: cred.user.uid,
    name: payload.name,
    email: payload.email,
    role: payload.role
  };

  await setDoc(doc(db, "users", appUser.uid), appUser);
  return appUser;
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const ref = doc(db, "users", cred.user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("User profile missing. Please contact support.");
  }

  return snap.data() as AppUser;
}
