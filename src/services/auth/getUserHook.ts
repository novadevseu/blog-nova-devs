// services/auth/getUserHook.ts
import { getOrCreateUserDocument } from "./firebaseAuthService";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { Dispatch } from "@reduxjs/toolkit";

/**
 * Recupera los datos del usuario desde Firestore usando el UID almacenado en localStorage.
 * Actualiza el estado global (Redux) con la información obtenida.
 */
export const getUserData = async (dispatch: Dispatch) => {
  const userId = localStorage.getItem("uid");

  if (!userId) {
    return null;
  }

  try {
    // Se puede pasar un email vacío si no se conoce, ya que el documento ya existe
    const userData = await getOrCreateUserDocument({ uid: userId, email: "" });
    dispatch(setUser(userData));
    return userData;
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    return null;
  }
};
