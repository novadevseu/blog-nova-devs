import { db } from "@/config/firebase-config";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { doc, getDoc } from "@firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";

export const getUserData = async (dispatch : Dispatch) => {
    try {
      const userId = localStorage.getItem('user-id');
  
      if (!userId) {
        console.error("User ID not found in localStorage.");
        return null;
      }
  
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
  
      const userData = userDoc.data() as UserType;
  
      if (userDoc.exists()) {
        dispatch(setUser({
          role : userData.role,
          email : userData.email,
          uid : userData.uid
        })); ; 
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  };