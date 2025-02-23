"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/services/auth/useSignUp";
import { useDispatch } from "react-redux";
import { googleLoginHook } from "@/hooks/googleLoginHook";
import { githubLoginHook } from "@/hooks/githubLoginHook";
import { yahooLoginHook } from "@/hooks/yahooLoginHook";
import { validateEmail, validatePassword } from "@/utils/validation"; // Importamos las funciones

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    }

    await useSignUp({
      email,
      password,
      setError,
      setLoading,
      dispatch,
    });

    if (!error) {
      router.push("/profile");
    }
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
    { name: "Google", color: "hover:border-gray-500 bg-white", icon: "/google.svg", action: handleGoogleSignIn },
    { name: "GitHub", color: "hover:border-gray-500 bg-white", icon: "/github.svg", action: handleGithubSignIn },
    { name: "Yahoo", color: "hover:border-gray-500 bg-white", icon: "/yahoo.svg", action: handleYahooSignIn },
  ];

  return (
    <div className="flex flex-col mt-20">
      <div className="flex items-center justify-center flex-1">
        <div className="bg-[#0c122a] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
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
                className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
              {passwordError && (
                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mt-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? "Registering..." : "Sign Up"}
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

          <div className="mt-6 text-center text-sm text-blue-500 flex mx-7 underline justify-center">
            <button onClick={() => router.push("/auth/login")} className="hover:text-blue-600">
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
