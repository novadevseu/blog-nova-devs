"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase-config";
import Navbar from "../../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged } from "firebase/auth";

interface Post {
  title: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

const PostPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Asegurar que id es un string
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null); // Guardar el rol del usuario
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("No se proporcionó un ID válido.");
        setLoading(false);
        return;
      }

      try {
        const postRef = doc(db, "posts", id); // Usa el ID validado aquí
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          setPost(postDoc.data() as Post);
        } else {
          setError("El post no existe.");
        }
      } catch (err) {
        console.error("Error al obtener el post:", err);
        setError("Hubo un error al cargar el post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.role as string);
            }
          } catch (err) {
            console.error("Error al cargar el rol del usuario:", err);
          }
        }
      });
    };

    fetchPost();
    fetchUserRole();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <div className="flex items-center justify-center flex-1">
          Cargando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <div className="flex items-center justify-center flex-1 bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className=""
            >
              {post?.content || ""}
            </ReactMarkdown>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Publicado el:{" "}
            {new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}
          </p>

          {/* Botón de editar */}
          {userRole === "Admin" && (
            <div className="mt-6">
              <button
                onClick={() => router.push(`/update/${id}`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Editar Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
