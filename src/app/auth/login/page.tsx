"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginHook } from "@/hooks/mailLoginHook";
import { googleLoginHook } from "@/hooks/googleLoginHook";
import { githubLoginHook } from "@/hooks/githubLoginHook";
import { yahooLoginHook } from "@/hooks/yahooLoginHook";
import { sendResetPasswordEmail } from "@/services/auth/firebaseAuthService";
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
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
  const handleSendResetEmail = async () => {
    // Reset previous error and message statuses
    setResetError("");
    setResetMessage("");
    setResetLoading(true);
    try {
      // Call the service function to send a password reset email
      await sendResetPasswordEmail(resetEmail);
      // Display a success message if the email was sent successfully
      setResetMessage("Reset email sent successfully. Please check your inbox.");
    } catch (err: any) {
      // Display an error message if sending fails
      setResetError("Failed to send reset email. Please try again.");
      console.error("Error sending reset email:", err);
    } finally {
      setResetLoading(false);
    }
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
              onClick={() => setShowResetDialog(true)}
              className="text-gray-400 hover:text-[#E0C600] transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
       {/* Password Reset Dialog */}
       {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            {/* Dialog Header */}
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            {/* Dialog Instruction */}
            <p className="mb-4 text-sm text-gray-600">
              Please enter your email address to receive a password reset link.
            </p>
            {/* Input for email used in password reset */}
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
            />
            {/* Display error message if any */}
            {resetError && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                {resetError}
              </div>
            )}
            {/* Display success message if email is sent */}
            {resetMessage && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
                {resetMessage}
              </div>
            )}
            <div className="flex justify-end gap-4">
              {/* Cancel button to close the dialog */}
              <button
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                disabled={resetLoading}
              >
                Cancel
              </button>
              {/* Button to send the reset email */}
              <button
                onClick={handleSendResetEmail}
                disabled={resetLoading || !resetEmail}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  resetLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-black"
                }`}
              >
                {resetLoading ? "Sending..." : "Send Reset Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default LoginPage;