// services/auth/googleLoginHook.ts
import {
  loginWithGoogle,
  getOrCreateUserDocument,
} from "../services/auth/firebaseAuthService";
import { setUser } from "@/redux/slices/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

interface GoogleLoginProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  dispatch: ReturnType<typeof useDispatch>;
}

/**
 * Realiza el proceso de inicio de sesión con Google:
 * - Utiliza una ventana emergente para autenticar.
 * - Obtiene o crea el documento del usuario en Firestore.
 * - Actualiza el estado global y redirige al perfil.
 */
export const googleLoginHook = async ({
  setError,
  setLoading,
  router,
  dispatch,
}: GoogleLoginProps) => {
  setLoading(true);
  setError("");

  try {
    // Inicia sesión con Google
    const user = await loginWithGoogle();
    // Obtiene (o crea) el documento del usuario en Firestore
    const userData = await getOrCreateUserDocument({
      uid: user.uid,
      email: user.email,
    });
    // Actualiza Redux
    dispatch(setUser(userData));

    // Redirige al perfil
    router.push("/profile");
  } catch (error: any) {
    console.error("Error durante la autenticación con Google:", error);
    setError(error.message || "Error desconocido.");
  } finally {
    setLoading(false);
  }
};
