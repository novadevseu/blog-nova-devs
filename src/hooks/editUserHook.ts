import { db } from "@/config/firebase-config";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";

/**
 * Actualiza el documento del usuario en Firestore con los datos proporcionados.
 * Finalmente, despacha una acción para actualizar el estado del usuario en Redux,
 * muestra una confirmación y recarga la página.
 *
 * @param dispatch - Función dispatch de Redux.
 * @param updateUserData - Objeto parcial de UserType con los valores actualizados (ej. email, linkedIn, etc.)
 */
export const editUserData = async (
  dispatch: Dispatch,
  updateUserData: Partial<UserType>
) => {
  // Recupera el ID del usuario desde localStorage.
  const userId = localStorage.getItem("uid");

  if (!userId) {
    return null;
  }

  try {
    // Obtiene una referencia al documento del usuario en Firestore.
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Actualiza el documento del usuario con los nuevos datos.
      await updateDoc(userDocRef, updateUserData);

      // Vuelve a obtener los datos actualizados del usuario.
      const updatedUserDoc = await getDoc(userDocRef);
      const newUserData = updatedUserDoc.data() as UserType;

      // Despacha la acción para actualizar el estado del usuario en Redux.
      dispatch(
        setUser({
          role: newUserData.role,
          email: newUserData.email,
          uid: newUserData.uid,
          username: newUserData.username || "",
          fullName: newUserData.fullName || "",
          img: newUserData.img || "",
          profile: newUserData.profile || "",
          linkedIn: newUserData.linkedIn || "",
          bio: newUserData.bio || "",
          company: newUserData.company || "",
          education: newUserData.education || "",
          jobDescription: newUserData.jobDescription || "",
          skills: newUserData.skills || "",
          subscribed: newUserData.subscribed || false,
        })
      );

      // Muestra la confirmación de que se ha guardado exitosamente.
      alert("Your changes have been saved successfully.");

      // Recarga la página para reflejar las actualizaciones.
      window.location.reload();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};
