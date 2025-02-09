import { db } from "@/config/firebase-config";
import { setUser } from "@/redux/slices/userSlice";
import { UserType } from "@/types/UserType";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";

export const editUserData = async (dispatch : Dispatch,updateUserData : Partial<UserType>) => {

  const userId = localStorage.getItem('uid');

  if (!userId) {
    return null;
  }
  
  try {

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
    
        await updateDoc(userDocRef,updateUserData)

        const newUserData = userDoc.data() as UserType;

        dispatch(setUser({
          role : newUserData.role,
          email : newUserData.email,
          uid : newUserData.uid,
          username : newUserData.username
        })); 

    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
  finally {
    window.location.reload(); 
  }
};