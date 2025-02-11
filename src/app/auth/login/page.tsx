// pages/auth/login.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginHook } from "@/services/auth/loginHook";
import { googleLoginHook } from "@/services/auth/googleLoginHook";
import { useUser } from "@/hooks/useUser";

const LoginPage: React.FC = () => {
  // Estados locales para email, contraseña, carga y errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene el usuario actual del estado global (Redux) mediante un custom hook
  const currentUser = useUser();

  const router = useRouter();
  const dispatch = useDispatch();

  // Si ya está autenticado, redirige al perfil
  useEffect(() => {
    if (currentUser?.uid === null) router.push("/profile");
  }, [currentUser, router]);

  // Maneja el envío del formulario para login con email/contraseña
  const handleLogin = async (e: React.FormEvent) => {
    await loginHook({
      e,
      setError,
      setLoading,
      email,
      password,
      router,
      setEmail,
      setPassword,
      dispatch,
    });
  };

  // Maneja el login con Google
  const handleGoogleSignIn = async () => {
    await googleLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  // Configuración de proveedores (por simplicidad, todos usan el mismo handler de Google)
  const providers = [
    { name: "Google", color: "hover:border-gray-500 bg-white", icon: "/google.svg", action: handleGoogleSignIn },
    { name: "Facebook", color: "border-blue-600 hover:border-blue-800 bg-[#0269e3]", icon: "/facebook.svg", action: handleGoogleSignIn },
    { name: "Apple", color: "border-black hover:border-gray-900 bg-black", icon: "/apple.svg", action: handleGoogleSignIn },
  ];

  return (
    <div className="flex flex-col mt-20">
      {/* Contenedor principal */}
      <div className="flex items-center justify-center flex-1">
        <div className="bg-[#0c122a] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mt-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 font-semibold">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="flex justify-center gap-4">
            {providers.map((provider) => (
              <button
                key={provider.name}
                onClick={provider.action}
                disabled={loading}
                className={`py-2 px-4 font-medium rounded-md shadow-sm flex justify-center items-center w-32 h-12 ${loading ? "bg-gray-400 cursor-not-allowed" : `text-white border-2 ${provider.color}`}`}
              >
                {loading ? "Loading..." : <img src={provider.icon} alt={provider.name} className="w-7 h-7" />}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-blue-500 flex justify-between mx-7 underline">
            <button onClick={() => router.push("/auth/signup")} className="hover:text-blue-600">
              Do you not have an account?
            </button>
            <button onClick={() => router.push("/auth/forgot-password")} className="hover:text-blue-600">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
