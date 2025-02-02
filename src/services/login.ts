import { auth, db } from "@/config/firebase-config";
import { UserType } from "@/redux/slices/userSlice";
import { doc, getDoc } from "@firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useDispatch, UseDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import Router from "next/router";


export const loginUser = async (e: React.FormEvent,email : string,password: string) => {
    
    const dispatch = useDispatch();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Directly access the user's document using their UID
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData : UserType = userDoc.data() as UserType;
        dispatch(setUser(userData));
        return {
            status : true,
        }
      } else {
        throw new Error("User information not found in Firestore.");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("User does not exist.");

      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password.");

      } else {
        
        throw new Error("Unknown error.");
      }
    } 
  };