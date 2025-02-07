"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";

const Profile: React.FC = () => {
  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<null | UserType>(useUser());

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              email: userData.email as string,
              role: userData.role as string,
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <p className="mb-4 text-gray-700">You are not authenticated.</p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="p-6 rounded-lg w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-center mb-4">Profile</h2>
          <div className="text-center mb-6">
            <p className="text-sm">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm">
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          {/* Botón visible solo para Admins */}
          {user.role === "Admin" && (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push("/create-post")}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition duration-300"
              >
                Create a New Post
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
