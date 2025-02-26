"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { Post } from "@/types/PostType";
import { motion } from "framer-motion";

const Archive: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extraer categorías únicas de los posts
  const categories = posts.reduce((acc: string[], post) => {
    post.categories?.forEach(category => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
    });
    return acc;
  }, []);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  // Filtrar posts basado en búsqueda y categoría
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E0C600] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#E0C600]">Cargando archivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95">
        <p className="text-red-500 bg-red-500/10 px-6 py-3 rounded-lg border border-red-500/20">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95 pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 relative inline-block">
            Archivo de Posts
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#E0C600] rounded-full"></span>
          </h1>
          <p className="text-gray-400">Explora nuestro archivo de {posts.length} posts</p>
        </motion.div>

        {/* Filtros */}
        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#0c1023] border border-gray-800/50 rounded-lg
              text-gray-300 placeholder-gray-500 focus:border-[#E0C600]/50
              focus:outline-none focus:ring-1 focus:ring-[#E0C600]/30
              transition-all duration-300"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#0c1023] border border-gray-800/50 rounded-lg
              text-gray-300 focus:border-[#E0C600]/50
              focus:outline-none focus:ring-1 focus:ring-[#E0C600]/30
              transition-all duration-300"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Lista de Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid gap-4"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/posts/${post.id}`}>
                <div className="p-6 bg-[#0c1023] rounded-xl border border-gray-800/50
                  hover:border-[#E0C600]/30 transition-all duration-300
                  hover:shadow-[0_0_15px_rgba(224,198,0,0.1)]">
                  <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
                      {post.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
                      {new Date((post.timestamp?.seconds ?? 0) * 1000).toLocaleDateString()}
                    </span>
                    {post.categories?.map(category => (
                      <span key={category} className="px-2 py-1 bg-[#E0C600]/10 rounded-full text-[#E0C600] text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron posts que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;