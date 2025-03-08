"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";

// Cargamos el editor de Markdown de forma dinámica para evitar problemas con SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const user = useUser();

  const validateForm = () => {
    if (!title.trim()) return "El título es requerido";
    if (!shortDescription.trim()) return "La descripción corta es requerida";
    if (!content) return "El contenido es requerido";
    if (!thumbnailUrl.trim()) return "La URL de la miniatura es requerida";
    if (categories.length === 0) return "Selecciona al menos una categoría";
    return "";
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      console.error("[Client] Error en la validación del formulario:", validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("[Client] Creando post en Firestore...");
      // Crear el post en Firestore (sin el username aún)
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        shortDescription,
        content,
        thumbnailUrl,
        categories,
        // Guardamos inicialmente el uid
        author: user?.uid,
        timestamp: new Date(),
      });
      console.log("[Client] Post creado en Firestore con ID:", docRef.id);

      // Recuperar el username del usuario desde la base de datos
      let username = "Unknown";
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          username = userData.username || "Unknown";
        } else {
          console.warn("[Client] No se encontró documento para el usuario:", user.uid);
        }
      }

      // Preparar datos del post para el correo, usando el username en lugar del uid
      const postData = {
        title,
        shortDescription,
        thumbnailUrl,
        author: username,
        timestamp: new Date().getTime(),
        id: docRef.id, // Agregamos el id para el link en el email
      };
      console.log("[Client] Datos del post para email preparados:", postData);

      // Consultar los usuarios suscritos
      console.log("[Client] Consultando usuarios suscritos...");
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("subscribed", "==", true),
        where("email", "!=", "")
      );
      const snapshot = await getDocs(q);
      const recipients = snapshot.docs.map((doc) => ({ email: doc.data().email }));
      console.log("[Client] Destinatarios encontrados:", recipients);

      // Enviar el correo llamando al endpoint
      console.log("[Client] Llamando al endpoint de newsletter...");
      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, post: postData }),
      });
      console.log("[Client] Estado de la respuesta del endpoint:", res.status);

      const data = await res.json();
      console.log("[Client] Respuesta del endpoint:", data);

      if (!data.success) {
        throw new Error("Error al enviar emails de notificación");
      }
      alert("Emails de notificación enviados exitosamente!");
      router.push(`/posts/${docRef.id}`);
    } catch (error: any) {
      console.error("[Client] Error al crear el post o enviar emails:", error);
      setError("Error al crear el post. Por favor, intenta de nuevo.");
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="min-h-screen pt-28 py-12 px-4 bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95"
    >
      <motion.form
        onSubmit={handleCreatePost}
        variants={itemVariants}
        className="w-full max-w-4xl mx-auto bg-[#0c1023] p-8 rounded-xl shadow-[0_0_15px_rgba(224,198,0,0.1)] border border-gray-800/50 hover:border-[#E0C600]/30 transition-all duration-300"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#E0C600] to-[#c4ad00] bg-clip-text text-transparent"
        >
          Crear Nuevo Post
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {[
            { id: "title", label: "Título", value: title, setter: setTitle },
            { id: "shortDescription", label: "Descripción Corta", value: shortDescription, setter: setShortDescription },
            { id: "thumbnailUrl", label: "URL de Miniatura", value: thumbnailUrl, setter: setThumbnailUrl },
          ].map((field) => (
            <motion.div key={field.id} variants={itemVariants} className="mb-4">
              <label htmlFor={field.id} className="block text-gray-300 text-sm font-medium mb-2">
                {field.label}
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id={field.id}
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#090d1f] text-gray-200 border border-gray-800/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent transition-all duration-200 hover:border-[#E0C600]/30"
              />
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Categorías
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Tecnología",
                "Desarrollo",
                "JavaScript",
                "React",
                "Node.js",
                "Python",
              ].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    categories.includes(category)
                      ? "bg-[#E0C600] text-[#090d1f] shadow-[0_0_15px_rgba(224,198,0,0.3)]"
                      : "bg-[#090d1f] text-gray-400 border border-gray-800/50 hover:border-[#E0C600]/30"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Contenido
            </label>
            <div data-color-mode="dark">
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
                preview={showPreview ? "preview" : "edit"}
                className="bg-[#090d1f] border border-gray-800/50 rounded-lg overflow-hidden"
              />
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPreview(!showPreview)}
              className="mt-2 px-4 py-2 text-sm text-gray-400 hover:text-[#E0C600] transition-colors duration-200"
            >
              {showPreview ? "Editar" : "Vista Previa"}
            </motion.button>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#E0C600] text-[#090d1f] hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando Post...
              </span>
            ) : (
              "Crear Post"
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default CreatePost;
