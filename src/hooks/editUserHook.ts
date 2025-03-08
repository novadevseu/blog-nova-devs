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

// Ahora la función recibe el userId como parámetro
export const editUserData = async (
  dispatch: Dispatch,
  userId: string,
  updateUserData: Partial<UserType>
) => {
  if (!userId) {
    return null;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, updateUserData);

      // Para obtener los datos actualizados, se consulta de nuevo el documento
      const updatedUserDoc = await getDoc(userDocRef);
      const newUserData = updatedUserDoc.data() as UserType;

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
          subscribed: newUserData.subscribed,
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
