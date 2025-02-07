"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase-config";
import { loginHook } from "@/services/loginHook";

import { useDispatch } from "react-redux";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter(); // Initialize the router

  const dispatch = useDispatch();

  // Handle login with email and password
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
      dispatch
    });
  };

  // Handle login with Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create document if the user does not exist in Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: "Viewer",
          createdAt: new Date(),
        });
      }

      router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error);
      setError(error.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-20">

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 ">
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
                className="font-black mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            {loading ? "Loading..." : "Log in with Google"}
          </button>
          <div className="mt-6 text-center text-sm text-blue-500 flex justify-between mx-7 underline ">
            <button
              onClick={() => router.push('/auth/signup')}
              className="hover:text-blue-600"
            >
              Don't have an account?
            </button>

            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="hover:text-blue-600"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
