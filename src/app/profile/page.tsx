"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/services/auth/firebaseAuthService";
import { useDispatch } from "react-redux";
import NameContainer from "./NameContainer";
import UsernameContainer from "./UsernameContainer";
import AdminContainer from "./AdminContainer";
import ProfilePictureContainer from "./ProfilePictureContainer";
import UserComments from "./UserComments";
import EmailContainer from "./EmailContainer";

const Profile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Obtenemos el usuario actual desde Redux.
  const currentUser = useUser();

  // Estado global para el formulario de datos del usuario.
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    subscribe: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cuando currentUser cambie, actualizamos el estado.
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        username: currentUser.username,
        email: currentUser.email,
        subscribe: currentUser.subscribed || false,
      });
    }
  }, [currentUser]);

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

  // Logout handler.
  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex flex-col items-center justify-center py-10">
        {/* Main Profile Card */}
        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Comments
          </button>
          <UserComments isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
        <div className="bg-[#0c122a] p-6 rounded-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Profile
          </h2>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-300">
              <strong>Welcome:</strong> {currentUser.username}
            </p>
          </div>

          {/* Profile Settings Section */}
          <div className="mt-8 bg-transparent p-4 border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Profile Settings
            </h3>
            {/* Profile Picture */}
            <ProfilePictureContainer />
            {/* Display Name */}
            <NameContainer formData={formData} setFormData={setFormData} />
            {/* Email & Newsletter */}
            <EmailContainer formData={formData} setFormData={setFormData} />
            {/* Reset Password (placeholder) */}
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                // Aquí podrías implementar la funcionalidad de reset de password.
              >
                Reset Password
              </button>
            </div>
            {/* Update Username */}
            <UsernameContainer formData={formData} setFormData={setFormData} />
            {currentUser.role === "Admin" && <AdminContainer />}
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
