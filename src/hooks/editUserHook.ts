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

/**
 * Updates the user document in Firestore with the provided data.
 * If the user's email is updated, it also updates the email in related comments.
 * Finally, it dispatches an action to update the user state in Redux and reloads the page.
 *
 * @param dispatch - Redux dispatch function.
 * @param updateUserData - Partial object of UserType with updated values (e.g., email, linkedIn, etc.)
 */
export const editUserData = async (
  dispatch: Dispatch,
  updateUserData: Partial<UserType>
) => {
  // Retrieve the current user ID from localStorage.
  const userId = localStorage.getItem("uid");

  if (!userId) {
    return null;
  }

  try {
    // Get a reference to the user's document in Firestore.
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update the user's document with the new data.
      await updateDoc(userDocRef, updateUserData);

      // Get the current data of the user document.
      const newUserData = userDoc.data() as UserType;

      // If the email is updated, update the email in all related comments.
      const emailData = updateUserData.email;
      if (emailData) {
        const commentsQuery = query(
          collection(db, "comments"),
          where("email", "==", emailData)
        );
        const querySnapshot = await getDocs(commentsQuery);

        // Update the email field in each comment document.
        const updatePromises = querySnapshot.docs.map(async (commentDoc) => {
          const commentRef = doc(db, "comments", commentDoc.id);
          await updateDoc(commentRef, { email: emailData });
        });
        await Promise.all(updatePromises);
      }

      // Dispatch the updated user data to Redux.
      // Note: This now includes the new "linkedIn" field along with other fields.
      dispatch(
        setUser({
          role: newUserData.role,
          email: newUserData.email,
          uid: newUserData.uid,
          username: newUserData.username || "",
          fullName: newUserData.fullName || "",
          img: newUserData.img || "",
          profile: newUserData.profile || "",
          linkedIn: newUserData.linkedIn || "", // New LinkedIn field added.
          bio: newUserData.bio || "",
          company: newUserData.company || "",
          education: newUserData.education || "",
          jobDescription: newUserData.jobDescription || "",
          skills: newUserData.skills || "",
        })
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  } finally {
    // Reload the page to reflect the updates.
    window.location.reload();
  }
};
