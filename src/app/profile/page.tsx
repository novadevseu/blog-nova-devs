"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import Navbar from "../components/Navbar";
import dynamic from "next/dynamic";

// Cargar el editor dinámicamente para evitar problemas con SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const Profile: React.FC = () => {
  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState(""); // Nuevo campo
  const [content, setContent] = useState<string | undefined>(""); // Ajustar para MDEditor
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
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
          console.error("Error al cargar los datos del usuario:", error);
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
    if (!title || !shortDescription || !content) return;

    try {
      await addDoc(collection(db, "posts"), {
        title,
        shortDescription,
        content,
        timestamp: new Date(),
      });

      setTitle("");
      setShortDescription("");
      setContent("");
      setSuccessMessage("¡Post creado con éxito!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
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
        
        <p className="mb-4 text-gray-700">No estás autenticado.</p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={() => router.push("/login")}
        >
          Iniciar sesión
        </button>
      </div> </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-center mb-4">Perfil</h2>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-700">
              <strong>Correo:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Rol:</strong> {user.role}
            </p>
          </div>

          {/* Mostrar formulario si el rol es Admin */}
          {user.role === "Admin" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Crear Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                    Descripción Corta
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Contenido
                  </label>
                  <MDEditor value={content} onChange={setContent} height={500} />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Crear Post
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
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
