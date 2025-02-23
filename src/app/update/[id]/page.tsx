"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../config/firebase-config";

import dynamic from "next/dynamic";

// Load the editor dynamically to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Post {
  title: string;
  shortDescription: string;
  content: string;
  thumbnailUrl: string; // New field
  categories: string[]; // New field
  timestamp: { seconds: number; nanoseconds: number };
}

const UpdatePostPage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params!.id) ? params!.id[0] : params!.id;
  const router = useRouter();

  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // New field
  const [categories, setCategories] = useState<string[]>([]); // New field
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "Admin") {
              setUser({
                email: userData.email as string,
                role: userData.role as string,
              });
            } else {
              router.push("/"); // Redirect if the user is not Admin
            }
          } else {
            router.push("/login"); // Redirect if the user is not found
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          router.push("/login"); // Redirect in case of error
        }
      } else {
        router.push("/login"); // Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        router.push("/404");
        return;
      }

      try {
        const postRef = doc(db, "posts", id); // Use the validated ID here
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = postDoc.data() as Post;
          setPost(postData);
          setTitle(postData.title);
          setShortDescription(postData.shortDescription);
          setContent(postData.content);
          setThumbnailUrl(postData.thumbnailUrl); // Set thumbnail URL
          setCategories(postData.categories); // Set categories
        } else {
          router.push("/404"); // Redirect if the post does not exist
        }
      } catch (err) {
        console.error("Error loading post:", err);
        router.push("/404");
      }
    };

    if (user && user.role === "Admin") {
      fetchPost();
    }
  }, [id, router, user]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("Invalid post ID.");
      return;
    }

    try {
      const postRef = doc(db, "posts", id); // Use the validated ID here
      await updateDoc(postRef, {
        title,
        shortDescription,
        content,
        thumbnailUrl, // Include thumbnail URL
        categories, // Include categories
      });

      setSuccessMessage("Post updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Hide the message after 3 seconds
      router.push(`/posts/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!id) {
      console.error("Invalid post ID.");
      return;
    }

    try {
      const postRef = doc(db, "posts", id); // Use the validated ID here
      await deleteDoc(postRef);

      router.push("/"); // Redirect to the main page after deletion
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories?.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mb-4 text-gray-700">You are not authenticated or do not have permission.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
    
      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center ">
        <div className=" p-6 rounded-lg  w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-center mb-4">Edit Post</h2>

          <form onSubmit={handleUpdatePost} className="space-y-4">
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
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
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
                {[
  "Technology",
  "Health",
  "Finance",
  "Education",
  "Entertainment",
  "News",
  "Tutorials",
  "Projects",
  "Guides",
  "Tips"
]
.map((category) => (
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
              Save Changes
            </button>
          </form>

          {successMessage && (
            <p className="text-green-500 text-sm mt-4">{successMessage}</p>
          )}

          <button
            onClick={handleDeletePost}
            className="mt-6 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostPage;
