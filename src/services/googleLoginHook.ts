import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface GoogleLoginProps {
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  router: AppRouterInstance;
}

export const googleLoginHook = async ({
  setError,
  setLoading,
  router,
}: GoogleLoginProps) => {
  setLoading(true);
  setError("");

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: "Viewer",
        createdAt: new Date(),
      });
    }

    router.push("/profile");
  } catch (error: any) {
    console.error("Error during Google Sign-In:", error);
    setError(error.message || "Unknown error.");
  } finally {
    setLoading(false);
  }
}; 