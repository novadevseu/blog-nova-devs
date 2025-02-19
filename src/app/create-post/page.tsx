"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";

// Cargar el editor dinámicamente para evitar problemas de SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useUser();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!title || !shortDescription || !content || !thumbnailUrl || categories.length === 0)
      return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        shortDescription,
        content,
        thumbnailUrl,
        categories,
        author: user?.email,
        timestamp: new Date(),
      });

      // Redirige al detalle del post recién creado
      router.push(`/posts/${docRef.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleCreatePost} className="w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ color: "black" }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shortDescription" className="block text-sm font-medium">
            Short Description
          </label>
          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            style={{ color: "black" }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            required
            style={{ color: "black" }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Categories</label>
          <div className="mt-2 space-y-2">
            {["Technology", "Health", "Finance", "Education", "Entertainment"].map(
              (category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={category} className="ml-2 text-sm">
                    {category}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <MDEditor value={content} onChange={setContent} height={300} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 transition duration-300"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
