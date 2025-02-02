"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase-config";
import Navbar from "../../components/Navbar";
import dynamic from "next/dynamic";

// React Redux Toolkit
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Load the editor dynamically to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const Profile: React.FC = () => {
  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState(""); // New field
  const [content, setContent] = useState<string | undefined>(""); // Adjust for MDEditor
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // New field
  const [categories, setCategories] = useState<string[]>([]); // New field
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const currentUser = useSelector((state : RootState) => state.currentUser);
  useEffect(() => {
    
    console.log(currentUser);

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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !content || !thumbnailUrl || categories.length === 0) return;

    try {
      await addDoc(collection(db, "posts"), {
        title,
        shortDescription,
        content,
        thumbnailUrl, // Include thumbnail URL
        categories, // Include categories
        author: user?.email, // Include author
        timestamp: new Date(),
      });

      setTitle("");
      setShortDescription("");
      setContent("");
      setThumbnailUrl(""); // Reset thumbnail URL
      setCategories([]); // Reset categories
      setSuccessMessage("Post created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories?.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

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
        {/* Navbar */}
        <header>
          <Navbar />
        </header>
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
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center ">
        <div className=" p-6 rounded-lg w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-center mb-4">Profile</h2>
          <div className="text-center mb-6">
            <p className="text-sm ">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm ">
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          {/* Show form if role is Admin */}
          {user.role === "Admin" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Create Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ color: 'black' }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium ">
                    Short Description
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    required
                    style={{ color: 'black' }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    id="thumbnailUrl"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    required
                    style={{ color: 'black' }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="mt-2 space-y-2">
                    {["Technology", "Health", "Finance", "Education", "Entertainment"].map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={category}
                          checked={categories?.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={category} className="ml-2 block text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <MDEditor value={content} onChange={setContent} height={500} />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Post
                </button>
              </form>
              {successMessage && (
                <p className="text-green-500 text-sm mt-4">{successMessage}</p>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
