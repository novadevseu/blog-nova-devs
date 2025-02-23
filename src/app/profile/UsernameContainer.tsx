"use client";

import { useUser } from '@/hooks/useUser';
import { editUserData } from '@/hooks/editUserHook';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

interface UsernameContainerInterface {
    formData : {
        username : string,
        fullName : string
    };
    setFormData : React.Dispatch<React.SetStateAction<{
        username : string,
        fullName : string,
        email: string;
      subscribe: boolean;
    }>>;
}

function UsernameContainer ({formData,setFormData} : UsernameContainerInterface) {

    // sets if user clicked to edit username or not
    const [usernameEdit,setUsernameEdit] = useState(false);

    const currentUser = useUser();
    const dispatch = useDispatch();

    const handleEditUsername = async () => {
        editUserData(dispatch,{username : formData.username})
    }

    if(currentUser)
        return (
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Username</label>
              <input
                type="text"
                placeholder="Update username"
                className="w-full p-2 bg-transparent border border-gray-500 rounded text-white placeholder-gray-400"
                disabled={!usernameEdit}
                onChange={(e)=>setFormData(v => ({...v,username : e.target.value}))}
                value={formData.username || "" }
              />
              {
                !usernameEdit 
                ? 
                  <button 
                    onClick={()=>setUsernameEdit(true)}
                    className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  >
                    Edit
                  </button>  
                : 
                  <>
                    <button 
                      onClick={()=>{
                        setUsernameEdit(false);
                        handleEditUsername();
                      }}
                      className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2" 
                    >Confirm</button>
                    <button 
                      onClick={()=>{
                        setUsernameEdit(false);
                        setFormData(v => ({...v,username : currentUser.username || ""}));
                      }} 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"  
                    >Cancel</button>
                  </>
              }
            </div>
        )
}

export default UsernameContainer;