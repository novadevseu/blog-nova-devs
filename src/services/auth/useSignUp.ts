// services/auth/useSignUp.ts
import { signUpWithEmail, getOrCreateUserDocument } from "./firebaseAuthService";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

interface SignUpProps {
  email: string;
  password: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: ReturnType<typeof useDispatch>;
}

/**
 * Realiza el proceso de registro de un nuevo usuario:
 * - Crea el usuario en Firebase Authentication.
 * - Crea el documento en Firestore.
 * - Actualiza el estado global (Redux).
 */
export const useSignUp = async ({
  email,
  password,
  setError,
  setLoading,
  dispatch,
}: SignUpProps) => {
  setLoading(true);
  setError(null);

  try {
    // Crea un nuevo usuario con email y contraseña
    const user = await signUpWithEmail(email, password);
    // Crea (o obtiene) el documento del usuario en Firestore
    const userData = await getOrCreateUserDocument({ uid: user.uid, email: user.email });
    // Actualiza Redux
    dispatch(setUser(userData));
    // Guarda el uid en localStorage (opcional)
    localStorage.setItem("uid", userData.uid);
  } catch (err: any) {
    setError(err.message || "Ocurrió un error desconocido.");
  } finally {
    setLoading(false);
  }
};
 