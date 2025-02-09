"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/types/UserType";
import { editUserData } from "@/services/auth/editUserHook";
import { useDispatch } from "react-redux";

const Profile: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [username,setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<null | UserType>(useUser());

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if(currentUser &&currentUser.username){
      setUsername(currentUser.username)
    }
    if(currentUser) {
      setLoading(false);
    }
    else router.push("/auth/login")
    
  }, [currentUser]);

  const handleLogOut = () => {
    localStorage.removeItem('uid');
    window.location.reload();
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editUserData(dispatch,{username : username});
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
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
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p className="text-sm">
              <strong>Role:</strong> {currentUser.role}
            </p>
            <p className="text-sm">
              <strong>Username:</strong> {currentUser.username || "You don't have an username"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-x-3">
            <label htmlFor="username" className="text-white-700">Username:</label>
            <input 
              name="username" 
              type="text"
              onChange={(e) => setUsername(e.target.value)} 
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </form>


          {/* Botón visible solo para Admins */}
          {currentUser.role === "Admin" && (
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
            onClick={handleLogOut}
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
