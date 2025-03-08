"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { editUserData } from "@/hooks/editUserHook";
import { useDispatch } from "react-redux";

interface EmailContainerInterface {
  formData: {
    email: string;
    subscribe: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      subscribe: boolean;
      username: string;
      fullName: string;
      
      
    }>
  >;
}

function EmailContainer({ formData, setFormData }: EmailContainerInterface) {
  const [emailEdit, setEmailEdit] = useState(false);
  const currentUser = useUser();
  const dispatch = useDispatch();

  const handleEditEmail = async () => {
    await editUserData(dispatch, currentUser!.uid,{
      email: formData.email,
      subscribed: formData.subscribe,
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-300 mb-1">Email</label>
      <input
        type="email"
        placeholder="Your email"
        className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
        disabled={!emailEdit}
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <div className="mt-2 flex items-center">
        <input
          type="checkbox"
          id="newsletter"
          checked={formData.subscribe}
          disabled={!emailEdit}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subscribe: e.target.checked }))
          }
          className="mr-2"
        />
        <label htmlFor="newsletter" className="text-gray-300">
          Subscribe to Newsletter
        </label>
      </div>
      {!emailEdit ? (
        <button
          onClick={() => setEmailEdit(true)}
          className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit
        </button>
      ) : (
        <>
          <button
            onClick={async () => {
              setEmailEdit(false);
              await handleEditEmail();
            }}
            className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setEmailEdit(false);
              setFormData((prev) => ({
                ...prev,
                email: currentUser?.email || "",
                subscribe: false,
              }));
            }}
            className="px-4 py-2 mt-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

export default EmailContainer;