"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase-config";
import Navbar from "../../../components/Navbar";
import { useSignUp } from '@/services/signupHook'
import { googleLoginHook } from "@/services/googleLoginHook";
import { useDispatch } from "react-redux";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState<null | string>(null);
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await useSignUp({email,password,setError,setLoading,dispatch})
    
    if (!error) {
      alert("Registration successful.");
      router.push("/profile");
    }
  };

  const handleGoogleSignIn = async () => {
      await googleLoginHook({
        setError,
        setLoading,
        router,
        dispatch
      });
    };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
    

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Sign Up
          </h2>

          {/* Email Sign-Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <hr className="my-6" />

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Continue with Google"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
