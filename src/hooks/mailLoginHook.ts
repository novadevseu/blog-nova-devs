// services/auth/loginHook.ts
import { loginWithEmail, getOrCreateUserDocument } from "../services/auth/firebaseAuthService";
import { setUser } from "@/redux/slices/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

interface LoginHookProps {
  e: React.FormEvent;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  password: string;
  router: AppRouterInstance;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  dispatch: ReturnType<typeof useDispatch>;
}

/**
 * Realiza el proceso de login con email y contraseña:
 * - Llama a Firebase para autenticar.
 * - Obtiene o crea el documento del usuario en Firestore.
 * - Actualiza el estado global y redirige a la página de perfil.
 */
export const loginHook = async ({
  e,
  setError,
  setLoading,
  email,
  password,
  router,
  setEmail,
  setPassword,
  dispatch,
}: LoginHookProps) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Intenta iniciar sesión con email y contraseña
    const user = await loginWithEmail(email, password);
    // Obtiene (o crea) el documento del usuario en Firestore
    const userData = await getOrCreateUserDocument({ uid: user.uid, email: user.email });
    // Actualiza el estado global (Redux)
    dispatch(setUser(userData));
   
    // Limpia los campos del formulario
    setEmail("");
    setPassword("");
    // Redirige al perfil
    router.push("/profile");
  } catch (error: any) {
    // Manejo de errores según el código de error de Firebase
    if (error.code === "auth/user-not-found") {
      setError("El usuario no existe.");
    } else if (error.code === "auth/wrong-password") {
      setError("Contraseña incorrecta.");
    } else {
      setError(error.message || "Error desconocido.");
    }
  } finally {
    setLoading(false);
  }
};
