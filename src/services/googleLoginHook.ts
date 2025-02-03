import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

interface GoogleLoginProps {
  setError : React.Dispatch<React.SetStateAction<string | null>>,
  setLoading : React.Dispatch<React.SetStateAction<boolean>>,
  router: AppRouterInstance;
  dispatch: ReturnType<typeof useDispatch>
}

export const googleLoginHook = async ({
  setError,
  setLoading,
  router,
  dispatch
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

      dispatch(setUser({
        role : "Viewer",
        email : user.email!,
        uid : user.uid!
      })); 

      localStorage.setItem('uid',user.uid);
    }

    router.push("/profile");
  } catch (error: any) {
    console.error("Error during Google Sign-In:", error);
    setError(error.message || "Unknown error.");
  } finally {
    setLoading(false);
  }
}; 