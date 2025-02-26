"use client";

import { useUser } from '@/hooks/useUser';
import { editUserData } from '@/hooks/editUserHook';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

interface NameContainerInterface {
    formData : {
        username : string,
        fullName : string
    };
    setFormData : React.Dispatch<React.SetStateAction<{
        username : string,
        fullName : string
    }>>;
}

function NameContainer ({formData,setFormData} : NameContainerInterface) {
    
    // sets if user clicked to edit full name or not
    const [fullNameEdit,setFullNameEdit] = useState(false);

    const currentUser = useUser();
    const dispatch = useDispatch();

    const handleEditFullName = async () => {
        editUserData(dispatch,{fullName : formData.fullName})
    }

    if(currentUser)
        return (
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                disabled={!fullNameEdit}
                value={formData.fullName || "" }
                onChange={(e)=>setFormData(v => ({...v,fullName : e.target.value}))}
              />
              {
                !fullNameEdit ? (
                  <button
                    onClick={() => setFullNameEdit(true)}
                    className="px-4 py-2 mt-2 bg-blue-600  text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setFullNameEdit(false);
                        handleEditFullName();
                      }}
                      className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setFullNameEdit(false);
                        setFormData((v) => ({ ...v, fullName : currentUser.fullName || "" }));
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </>
                )
              }
            </div>
        )
}

export default NameContainer;