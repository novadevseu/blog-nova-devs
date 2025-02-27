import { db } from "@/config/firebase-config";
import { setUser, UserType } from "@/redux/slices/userSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";

export const editUserData = async (
  dispatch: Dispatch,
  updateUserData: Partial<UserType>
) => {
  const userId = localStorage.getItem("uid");

  if (!userId) {
    return null;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, updateUserData);

      const newUserData = userDoc.data() as UserType;

      const emailData = updateUserData.email;

      if (emailData) {
        const commentsQuery = query(
          collection(db, "comments"),
          where("email", "==", emailData)
        );
        const querySnapshot = await getDocs(commentsQuery);

        const updatePromises = querySnapshot.docs.map(async (commentDoc) => {
          const commentRef = doc(db, "comments", commentDoc.id);
          await updateDoc(commentRef, { email: emailData });
        });

        await Promise.all(updatePromises);
      }

      dispatch(
        setUser({
          role: newUserData.role,
          email: newUserData.email,
          uid: newUserData.uid,
          username: newUserData.username || "",
          fullName: newUserData.fullName || "",
          img: newUserData.img || "",
          profile: newUserData.profile || "",
        })
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  } finally {
    window.location.reload();
  }
};
