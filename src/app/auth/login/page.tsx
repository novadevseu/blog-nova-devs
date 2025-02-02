"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase-config";
import Navbar from "../../../components/Navbar"; // Import the Navbar

// redux and redux functions
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlice"; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter(); // Initialize the router

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Directly access the user's document using their UID
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      console.log(userDoc.data())

      if (userDoc.exists()) {
        /* router.push("/profile"); */
      } else {
        throw new Error("User information not found in Firestore.");
      }

      setEmail("");
      setPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("User does not exist.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError(error.message || "Unknown error.");
      }
    } finally {
      setLoading(false);
    }
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
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Log In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
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
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mt-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <hr className="my-6" />
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Log in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
