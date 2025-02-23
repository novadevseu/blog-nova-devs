// services/auth/yahooLoginHook.ts
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase-config";
import { getOrCreateUserDocument } from "../services/auth/firebaseAuthService";
import { setUser } from "@/redux/slices/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

interface YahooLoginProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  dispatch: ReturnType<typeof useDispatch>;
}

export const yahooLoginHook = async ({
  setError,
  setLoading,
  router,
  dispatch,
}: YahooLoginProps) => {
  setLoading(true);
  setError("");

  try {
    // Crea el provider para Yahoo (el providerId debe ser "yahoo.com")
    const provider = new OAuthProvider('yahoo.com');
    // Agrega scopes o parámetros adicionales si son necesarios
    // provider.addScope('...');

    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const user = result.user;
    console.log(user);

    // Obtén o crea el documento del usuario en Firestore
    const userData = await getOrCreateUserDocument({
      uid: user.uid,
    });

    // Actualiza Redux y guarda el uid en localStorage
    dispatch(setUser(userData));
    

    // Redirige al perfil
    router.push("/profile");
  } catch (error: any) {
    console.error("Error durante la autenticación con Yahoo:", error);
    setError(error.message || "Error desconocido.");
  } finally {
    setLoading(false);
  }
};
