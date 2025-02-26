"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

// Cargar el editor dinámicamente para evitar problemas de SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleCategoryChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
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
      router.push(`/posts/${docRef.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6  rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      {/* Switch de modo oscuro */}
      <div className="flex justify-end mb-4">
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600"
        >
          <span className="sr-only">Toggle Dark Mode</span>
          <span
            className={`transform transition ease-in-out duration-200 inline-block w-4 h-4 rounded-full ${
              darkMode ? "translate-x-6 bg-yellow-400" : "translate-x-1 bg-gray-800"
            }`}
          >
            {darkMode ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
          </span>
        </Switch>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Datos */}
        <div className="col-span-2 p-6  shadow bg-gray-100 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 dark:text-white" />
          <input type="text" placeholder="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 dark:text-white" />
        </div>
        
        {/* Columna derecha - Imagen y URL */}
        <div className="flex flex-col gap-6">
          <div className="p-4  shadow-100 bg-gray-100 dark:bg-gray-800">
            <input type="text" placeholder="Thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="p-4  shadow bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img src={thumbnailUrl || "https://via.placeholder.com/150"} alt="Thumbnail preview" className="max-h-40 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Selección de categorías */}
      <div className="mt-6 p-6  shadow bg-gray-100 dark:bg-gray-800">
        <label className="block text-sm font-medium">Categories</label>
        <div className="mt-2 space-y-2">
          {["Technology", "Health", "Finance", "Education", "Entertainment"].map((category) => (
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
          ))}
        </div>
      </div>
      
      {/* Contenido */}
      <div className="mt-6 p-6 shadow bg-gray-100 dark:bg-gray-800">
        <MDEditor value={content} onChange={setContent} height={200} />
      </div>

      {/* Botón */}
      <div className="mt-6 flex justify-center">
        <button type="submit" onClick={handleCreatePost} disabled={loading}
          className="py-2 px-6 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition duration-300">
          {loading ? "Creating..." : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
