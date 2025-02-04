import { auth, db } from "@/config/firebase-config";
import { UserType } from "@/redux/slices/userSlice";
import { doc, getDoc } from "@firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface handleLogin {
    e: React.FormEvent,
    setLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setError : React.Dispatch<React.SetStateAction<string | null>>,
    email : string,
    password : string,
    router : AppRouterInstance,
    setEmail : React.Dispatch<React.SetStateAction<string>>,
    setPassword : React.Dispatch<React.SetStateAction<string>>,
    dispatch: ReturnType<typeof useDispatch>
}

export const loginHook = async ({e,setError,setLoading,email,password,router,setEmail,setPassword,dispatch} : handleLogin) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Directly access the user's document using their UID
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData : UserType = userDoc.data() as UserType;

        dispatch(setUser({
          role : userData.role,
          email : userData.email,
          uid : userData.uid
        })); 

        localStorage.setItem('uid',userData.uid);

        window.location.reload();
        router.push("/profile"); 
        
      } else {
        throw new Error("User information not found in Firestore.");
      }

      setEmail("");
      setPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("User does not exist.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError(error.message || "Unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };