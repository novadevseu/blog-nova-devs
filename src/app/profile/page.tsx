"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/services/auth/firebaseAuthService";
import { useDispatch } from "react-redux";
import { editUserData } from "@/services/auth/editUserHook";
import NameContainer from "./NameContainer";
import UsernameContainer from "./UsernameContainer";

/**
 * The Profile component relies on Redux and our prebuilt services,
 * so it does not contain any direct Firebase logic.
 */
const Profile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get the current user from Redux using our custom hook.
  const currentUser = useUser();

  // contains current input datas in email, username
  const [formData,setFormData] = useState({
    fullName : "",
    username : "",
  })

  const [adminFormData,setAdminFormData] = useState({
    jobDescription : "",
    company : "",
    education : "",
    skills : ""
  })

  // fetch the user details to the form data
  useEffect(()=>{
    if(currentUser){
      setFormData({
        fullName : currentUser.fullName,
        username : currentUser.username
      })
    }
  },[currentUser])

  // If no user is logged in, display an authentication prompt.
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
        <p className="mb-4 text-gray-300">You are not authenticated.</p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={() => router.push("/auth/login")}
        >
          Log In
        </button>
      </div>
    );
  }

  // Logout handler using our service method.
  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally, display an error message to the user.
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      
      <div className=" flex flex-col items-center justify-center py-10">
        {/* Main Profile Card */}
        <div className=" bg-[#0c122a] p-6 rounded-lg w-full max-w-4xl  ">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">Profile</h2>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-300">
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>

          {/* Profile Settings Section (placeholders, non-functional) */}
          <div className="mt-8 bg-transparent p-4 border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Profile Settings</h3>
            {/* Profile Picture */}
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-500">
                <img
                  src={currentUser.img || "https://placehold.co/600x400"}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                // Placeholder: update picture functionality is not implemented.
              >
                Update Picture
              </button>
            </div>
            {/* Display Name */}
            <NameContainer {...{formData,setFormData}} />
            {/* Email Notifications Toggle */}
            <div className="mb-4 flex items-center">
              <label className="block text-gray-300 mr-4">Email Notifications</label>
              <div className="w-6 h-6 flex items-center justify-center bg-green-600 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* This toggle is only visual and non-functional. */}
            </div>
            {/* Reset Password */}
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                // Placeholder: reset password functionality is not implemented.
              >
                Reset Password
              </button>
            </div>
            {/* Update Username */}
            <UsernameContainer {...{formData,setFormData}} />
            { currentUser.role === "Admin" && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Job Description</label>
                <input
                  type="text"
                  placeholder="Enter a Description"
                  className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                  disabled={false}
                  onChange={(e)=>setAdminFormData(v => ({...v,jobDescription : e.target.value}))}
                  value={adminFormData.jobDescription || "" }
                />
                <label className="block text-gray-300 mb-1">Company/Organization</label>
                <input
                  type="text"
                  placeholder="Enter an Company/Organization"
                  className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                  disabled={false}
                  onChange={(e)=>setAdminFormData(v => ({...v,company : e.target.value}))}
                  value={adminFormData.company || "" }
                />
                <label className="block text-gray-300 mb-1">Education</label>
                <input
                  type="text"
                  placeholder="Enter an Education"
                  className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                  disabled={false}
                  onChange={(e)=>setAdminFormData(v => ({...v,education : e.target.value}))}
                  value={adminFormData.education || "" }
                />
                <label className="block text-gray-300 mb-1">Skills/Technologies</label>
                <input
                  type="text"
                  placeholder="Enter skills"
                  className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                  disabled={false}
                  onChange={(e)=>setAdminFormData(v => ({...v,skills : e.target.value}))}
                  value={adminFormData.skills || "" }
                />
                <label className="block text-gray-300 mb-1">Biography</label>
                <textarea  ></textarea>
              </div>      
            ) }
          </div>
          {/* Admin-only "Create a New Post" Button */}
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

          {/* Logout Button */}
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
