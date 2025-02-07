"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase-config";
import Navbar from "../../../components/Navbar";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create the record in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "Viewer",
        createdAt: new Date(),
      });

      alert("Registration successful.");
      router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error registering user:", error);
      setError(error.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If not, create a new record
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: "Viewer",
          createdAt: new Date(),
        });
      }

      alert("Login successful.");
      router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Google authentication:", error);
      setError(error.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { name: "Google", color: " hover:border-gray-500 bg-white", icon: "/google.svg", action: handleGoogleSignIn },
    { name: "Facebook", color: "border-blue-600 hover:border-blue-800 bg-[#0269e3]", icon: "/facebook.svg", action: handleGoogleSignIn },
    { name: "Apple", color: "border-black hover:border-gray-900 bg-black", icon: "/apple.svg", action: handleGoogleSignIn }
  ];

  return (
    <div className="flex flex-col mt-20">
      {/* Main Content */}
      <div className="flex items-center justify-center flex-1">
        <div className="bg-[#0c122a] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                className={`py-2 px-4 font-medium rounded-md shadow-sm flex justify-center items-center w-32 h-12 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `text-white border-2 ${provider.color}`
                  }`}
              >
                {loading ? "Loading..." : <img src={provider.icon} alt={provider.name} className="w-7 h-7" />}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-blue-500 flex mx-7 underline justify-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="hover:text-blue-600"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
