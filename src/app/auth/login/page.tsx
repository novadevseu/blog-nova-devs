"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginHook } from "@/hooks/mailLoginHook";
import { googleLoginHook } from "@/hooks/googleLoginHook";
import { githubLoginHook } from "@/hooks/githubLoginHook";
import { yahooLoginHook } from "@/hooks/yahooLoginHook";
// Import the reset email function from the Firebase Auth service
import { sendResetPasswordEmail } from "@/services/auth/firebaseAuthService";

const LoginPage: React.FC = () => {
  // States for login form fields and loading/error statuses
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // States for controlling the password reset dialog and its fields/statuses
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  /**
   * Handles the login form submission by calling the email login hook.
   */
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

  /**
   * Handles Google sign-in by calling the corresponding hook.
   */
  const handleGoogleSignIn = async () => {
    await googleLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  /**
   * Handles GitHub sign-in by calling the corresponding hook.
   */
  const handleGithubSignIn = async () => {
    await githubLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  /**
   * Handles Yahoo sign-in by calling the corresponding hook.
   */
  const handleYahooSignIn = async () => {
    await yahooLoginHook({
      setError,
      setLoading,
      router,
      dispatch,
    });
  };

  // Array of provider objects for rendering social login buttons.
  const providers = [
    {
      name: "Google",
      color: "hover:border-gray-500 bg-white",
      icon: "/google.svg",
      action: handleGoogleSignIn,
    },
    {
      name: "GitHub",
      color: "hover:border-gray-500 bg-white",
      icon: "/github.svg",
      action: handleGithubSignIn,
    },
    {
      name: "Yahoo",
      color: "hover:border-gray-500 bg-white",
      icon: "/yahoo.svg",
      action: handleYahooSignIn,
    },
  ];

  /**
   * Handles sending a password reset email using the provided email address.
   */
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

  return (
    <div className="flex flex-col mt-20">
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
                className="text-black mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
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
                className={`py-2 px-4 font-medium rounded-md shadow-sm flex justify-center items-center w-32 h-12 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : `text-white border-2 ${provider.color}`
                  }`}
              >
                {loading ? (
                  "Loading..."
                ) : (
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-7 h-7"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-blue-500 flex justify-between mx-7 underline">
            <button
              onClick={() => router.push("/auth/signup")}
              className="hover:text-blue-600"
            >
              Don't have an account?
            </button>
            <button
              onClick={() => setShowResetDialog(true)}
              className="hover:text-blue-600"
            >
              Forgot your password?
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
              className="w-full p-2 mb-4 border border-gray-300 rounded"
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
                className={`px-4 py-2 rounded text-sm font-medium ${resetLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
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
