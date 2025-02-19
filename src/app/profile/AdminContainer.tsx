"use client";

import { useUser } from "@/hooks/useUser";
import { editUserData } from "@/hooks/editUserHook";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/**
 * Component for admin-specific settings.
 * It allows an admin to edit fields such as job description, company, education,
 * skills, biography, and a new LinkedIn profile URL.
 */
function AdminContainer() {
  // State to hold the admin form data, including the new "linkedIn" field.
  const [adminFormData, setAdminFormData] = useState({
    jobDescription: "",
    company: "",
    education: "",
    skills: "",
    bio: "",
    linkedIn: "", // New LinkedIn field.
  });

  // State to toggle between edit mode and view mode.
  const [edit, setEdit] = useState(false);

  const currentUser = useUser();
  const dispatch = useDispatch();

  // When the currentUser data loads, populate the form with existing values.
  useEffect(() => {
    if (currentUser)
      setAdminFormData({
        bio: currentUser?.bio || "",
        company: currentUser?.company || "",
        education: currentUser?.education || "",
        jobDescription: currentUser?.jobDescription || "",
        skills: currentUser?.skills || "",
        linkedIn: currentUser?.linkedIn || "", // Initialize LinkedIn field.
      });
  }, [currentUser]);

  // Function to handle saving the admin settings.
  const handleSaveAdminValues = async () => {
    if (currentUser && currentUser.role === "Admin")
      await editUserData(dispatch, { ...adminFormData });
  };

  if (currentUser)
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Admin Only Settings
        </h3>
        {!edit ? (
          // Button to enter edit mode.
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-2 my-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
        ) : (
          <>
            {/* Confirm button to save changes */}
            <button
              onClick={() => {
                setEdit(false);
                handleSaveAdminValues();
              }}
              className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
            >
              Confirm
            </button>
            {/* Cancel button to discard changes */}
            <button
              onClick={() => {
                setEdit(false);
                setAdminFormData((v) => ({
                  ...v,
                  bio: currentUser?.bio || "",
                  company: currentUser?.company || "",
                  education: currentUser?.education || "",
                  jobDescription: currentUser?.jobDescription || "",
                  skills: currentUser?.skills || "",
                  linkedIn: currentUser?.linkedIn || "", // Reset LinkedIn field.
                }));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </>
        )}
        {/* Input for Job Description */}
        <label className="block text-gray-300 mb-1">Job Description</label>
        <input
          type="text"
          placeholder="Enter a Description"
          className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
          disabled={!edit}
          onChange={(e) =>
            setAdminFormData((v) => ({
              ...v,
              jobDescription: e.target.value,
            }))
          }
          value={adminFormData.jobDescription || ""}
        />
        {/* Input for Company/Organization */}
        <label className="block text-gray-300 mb-1">Company/Organization</label>
        <input
          type="text"
          placeholder="Enter a Company/Organization"
          className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
          disabled={!edit}
          onChange={(e) =>
            setAdminFormData((v) => ({ ...v, company: e.target.value }))
          }
          value={adminFormData.company || ""}
        />
        {/* Input for Education */}
        <label className="block text-gray-300 mb-1">Education</label>
        <input
          type="text"
          placeholder="Enter Education"
          className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
          disabled={!edit}
          onChange={(e) =>
            setAdminFormData((v) => ({
              ...v,
              education: e.target.value,
            }))
          }
          value={adminFormData.education || ""}
        />
        {/* Input for Skills/Technologies */}
        <label className="block text-gray-300 mb-1">Skills/Technologies</label>
        <input
          type="text"
          placeholder="Enter skills"
          className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
          disabled={!edit}
          onChange={(e) =>
            setAdminFormData((v) => ({ ...v, skills: e.target.value }))
          }
          value={adminFormData.skills || ""}
        />
        {/* Input for Biography */}
        <label className="block text-gray-300 mb-1">Biography</label>
        <textarea
          value={adminFormData.bio || ""}
          onChange={(e) =>
            setAdminFormData((v) => ({ ...v, bio: e.target.value }))
          }
          className="w-full h-32 resize-none p-2 border border-gray-500 rounded"
          placeholder="Type something..."
          disabled={!edit}
        ></textarea>
        {/* Input for LinkedIn Profile */}
        <label className="block text-gray-300 mb-1">LinkedIn Profile</label>
        <input
          type="text"
          placeholder="Enter your LinkedIn URL"
          className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
          disabled={!edit}
          onChange={(e) =>
            setAdminFormData((v) => ({ ...v, linkedIn: e.target.value }))
          }
          value={adminFormData.linkedIn || ""}
        />
      </div>
    );
}

export default AdminContainer;
