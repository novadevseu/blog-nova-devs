import { useUser } from "@/hooks/useUser";
import { editUserData } from "@/hooks/editUserHook";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ProfilePictureContainer() {
    
    const [edit, setEdit] = useState(false);
    const [selectedImage,setSelectedImage] = useState("0");

    const currentUser = useUser();
      const dispatch = useDispatch();

  const handleSavePicture = async () => {
    await editUserData(dispatch,{img : selectedImage})
  }

  if (currentUser)
    return (
      <div className="flex items-center mb-4">
        {edit && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            id="profileModal"
          >
            <div className="bg-white rounded-lg p-6 w-80 text-center">
              <h2 className="text-lg font-semibold mb-4">
                Select a Profile Picture
              </h2>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[...Array(8)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 ${selectedImage === `/profile_pictures/${index + 1}.png` ? 'border-blue-500' : 'border-gray-300'} hover:border-blue-500`}
                    onClick={()=>setSelectedImage(`/profile_pictures/${index + 1}.png`)}
                    
                  >
                    <img
                      src={`/profile_pictures/${index + 1}.png`}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <button 
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={()=>setEdit(false)}    
                >
                  Cancel
                </button>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSavePicture}    
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-500">
          <img
            src={currentUser.img || "https://placehold.co/600x400"}
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setEdit(true)}
        >
          Update Picture
        </button>
      </div>
    );
}
