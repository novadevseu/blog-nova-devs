import { db } from "@/config/firebase-config";
import { setUser } from "@/redux/slices/userSlice";
import { UserType } from "@/types/UserType";
import { doc, getDoc } from "@firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";

export const getUserData = async (dispatch : Dispatch) => {

  const userId = localStorage.getItem('uid');

  if (!userId) {
    return null;
  }
  
  try {

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    const userData = userDoc.data() as UserType;
    
    if (userDoc.exists()) {
      dispatch(setUser({
        role : userData.role,
        email : userData.email,
        uid : userData.uid,
        username : userData.username
      })); ; 
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};