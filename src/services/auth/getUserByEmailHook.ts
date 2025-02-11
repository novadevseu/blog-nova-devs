// services/auth/getUserHook.ts
import { getOrCreateUserDocument, getUserDocumentByEmail } from "./firebaseAuthService";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { Dispatch } from "@reduxjs/toolkit";

/**
 * Recupera los datos del usuario desde Firestore usando el UID almacenado en localStorage.
 * Actualiza el estado global (Redux) con la información obtenida.
 */
export const getUserByEmailHook = async (email : string) => {   
    try {
        const userData = await getUserDocumentByEmail(email);
        return userData;
    } catch (error) {
        console.log(error);
    }
};
