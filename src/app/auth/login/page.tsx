"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginHook } from "@/hooks/mailLoginHook";
import { googleLoginHook } from "@/hooks/googleLoginHook";
import { githubLoginHook } from "@/hooks/githubLoginHook";
import { yahooLoginHook } from "@/hooks/yahooLoginHook";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleGoogleSignIn = async () => {
    await googleLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  const handleGithubSignIn = async () => {
    await githubLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  const handleYahooSignIn = async () => {
    await yahooLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  const providers = [
    { 
      name: "Google", 
      color: "hover:bg-[#0c1023] bg-[#090d1f]", 
      icon: "/google.svg", 
      action: handleGoogleSignIn 
    },
    { 
      name: "GitHub", 
      color: "hover:bg-[#0c1023] bg-[#090d1f]", 
      icon: "/github.svg", 
      action: handleGithubSignIn 
    },
    { 
      name: "Yahoo", 
      color: "hover:bg-[#0c1023] bg-[#090d1f]", 
      icon: "/yahoo.svg", 
      action: handleYahooSignIn 
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95">
      <div className="flex items-center justify-center w-full">
        <div className="bg-[#0c1023] p-8 rounded-xl shadow-[0_0_15px_rgba(224,198,0,0.1)] w-full max-w-md 
          transform transition-all duration-300 border border-gray-800/50 hover:border-[#E0C600]/30">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#E0C600] to-[#c4ad00] bg-clip-text text-transparent">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="transition-all duration-200">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-800/50 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent
                  bg-[#090d1f] transition-all duration-200 hover:border-[#E0C600]/30"
              />
            </div>
            <div className="transition-all duration-200">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-800/50 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent
                  bg-[#090d1f] transition-all duration-200 hover:border-[#E0C600]/30"
              />
            </div>
            {error && (
              <div className="bg-red-900/50 text-red-400 p-4 rounded-lg text-sm mt-4 border border-red-800
                animate-fadeIn transition-all duration-300">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-medium rounded-lg shadow-md transition-all duration-200
                ${loading 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-[#E0C600] hover:bg-[#E0C600]/90 text-[#090d1f] hover:shadow-[0_0_15px_rgba(224,198,0,0.3)] active:transform active:scale-95"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#090d1f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : "Iniciar Sesión"}
            </button>
          </form>
  
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-800/50"></div>
            <span className="mx-4 font-semibold text-gray-400">o</span>
            <div className="flex-grow border-t border-gray-800/50"></div>
          </div>
  
          <div className="flex justify-center gap-6">
            {providers.map((provider) => (
              <button
                key={provider.name}
                onClick={provider.action}
                disabled={loading}
                className={`p-3 rounded-lg shadow-md flex justify-center items-center w-16 h-16
                  transition-all duration-200 transform hover:scale-110 active:scale-95
                  ${loading 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : `border border-gray-800/50 hover:border-[#E0C600]/50 ${provider.color}
                      hover:shadow-[0_0_15px_rgba(224,198,0,0.1)]`
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#E0C600]/30 border-t-transparent rounded-full animate-spin"/>
                ) : (
                  <img src={provider.icon} alt={provider.name} className="w-6 h-6 transition-transform duration-200 filter invert" />
                )}
              </button>
            ))}
          </div>
  
          <div className="mt-8 text-center text-sm flex justify-between px-2">
            <button 
              onClick={() => router.push("/auth/signup")} 
              className="text-gray-400 hover:text-[#E0C600] transition-colors duration-200"
            >
              ¿No tienes una cuenta?
            </button>
            <button 
              onClick={() => router.push("/auth/forgot-password")} 
              className="text-gray-400 hover:text-[#E0C600] transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;