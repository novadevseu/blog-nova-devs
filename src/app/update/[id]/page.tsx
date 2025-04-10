"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase-config";
import Navbar from "../../components/Navbar";
import dynamic from "next/dynamic";

// Cargar el editor dinámicamente para evitar problemas con SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Post {
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

const UpdatePostPage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Asegurar que el id es un string
  const router = useRouter();

  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState<string | undefined>("");
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
              router.push("/"); // Redirigir si el usuario no es Admin
            }
          } else {
            router.push("/login"); // Redirigir si no se encuentra el usuario
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          router.push("/login"); // Redirigir en caso de error
        }
      } else {
        router.push("/login"); // Redirigir si no está autenticado
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
        const postRef = doc(db, "posts", id); // Usar el ID validado aquí
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = postDoc.data() as Post;
          setPost(postData);
          setTitle(postData.title);
          setShortDescription(postData.shortDescription);
          setContent(postData.content);
        } else {
          router.push("/404"); // Redirigir si el post no existe
        }
      } catch (err) {
        console.error("Error al cargar el post:", err);
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
      console.error("El ID del post es inválido.");
      return;
    }

    try {
      const postRef = doc(db, "posts", id); // Usar el ID validado aquí
      await updateDoc(postRef, {
        title,
        shortDescription,
        content,
        timestamp: new Date(),
      });

      setSuccessMessage("¡Post actualizado con éxito!");
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar el mensaje después de 3 segundos
      router.push(`/posts/${id}`);
    } catch (err) {
      console.error("Error al actualizar el post:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!id) {
      console.error("El ID del post es inválido.");
      return;
    }

    try {
      const postRef = doc(db, "posts", id); // Usar el ID validado aquí
      await deleteDoc(postRef);

      router.push("/"); // Redirigir a la página principal tras eliminar
    } catch (err) {
      console.error("Error al eliminar el post:", err);
    }
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mb-4 text-gray-700">No estás autenticado o no tienes permiso.</p>
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
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-center mb-4">Editar Post</h2>

          <form onSubmit={handleUpdatePost} className="space-y-4">
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
              Guardar Cambios
            </button>
          </form>

          {successMessage && (
            <p className="text-green-500 text-sm mt-4">{successMessage}</p>
          )}

          <button
            onClick={handleDeletePost}
            className="mt-6 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostPage;
