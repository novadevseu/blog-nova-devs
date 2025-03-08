// services/auth/githubLoginHook.ts
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase-config";
import { getOrCreateUserDocument } from "../services/auth/firebaseAuthService";
import { setUser } from "@/redux/slices/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

interface GithubLoginProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  dispatch: ReturnType<typeof useDispatch>;
}

export const githubLoginHook = async ({
  setError,
  setLoading,
  router,
  dispatch,
}: GithubLoginProps) => {
  setLoading(true);
  setError("");

  try {
    // Inicia sesión con GitHub
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
  
    const user = result.user;
   

    // Obtén o crea el documento del usuario en Firestore
    const userData = await getOrCreateUserDocument({
      uid: user.uid,
      
    });

    // Actualiza Redux y guarda el uid en localStorage
    dispatch(setUser(userData));
   

    // Redirige al perfil
    router.push("/profile");
  } catch (error: any) {
    console.error("Error durante la autenticación con GitHub:", error);
    setError(error.message || "Error desconocido.");
  } finally {
    setLoading(false);
  }
};
