"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
  thumbnailUrl: string;
  categories: string[];
  author: string; // Este campo contiene el uid del autor
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
}

const getValidImageUrl = (url: string | undefined) => {
  const placeholder = "https://placehold.co/600x400/090d1f/E0C600/png?text=CoffeeScript";
  if (!url || url.trim() === '') return placeholder;
  try {
    new URL(url);
    return url;
  } catch {
    return placeholder;
  }
};

const AllPosts: React.FC<PostListProps> = ({ posts, loading }) => {
  // Estado para almacenar el mapping: uid -> username
  const [usernameMapping, setUsernameMapping] = useState<Record<string, string>>({});

  // Cuando los posts cambien, obtenemos de Firestore los username de aquellos uids que aún no tenemos
  useEffect(() => {
    const fetchUsernames = async () => {
      const uidsToFetch: Set<string> = new Set();
      posts.forEach((post) => {
        if (post.author && !usernameMapping[post.author]) {
          uidsToFetch.add(post.author);
        }
      });
      if (uidsToFetch.size > 0) {
        const newMapping: Record<string, string> = {};
        for (const uid of Array.from(uidsToFetch)) {
          try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              newMapping[uid] = userData.username || "Unknown";
            } else {
              newMapping[uid] = "Unknown";
            }
          } catch (error) {
            console.error("Error fetching username for uid:", uid, error);
            newMapping[uid] = "Unknown";
          }
        }
        setUsernameMapping((prev) => ({ ...prev, ...newMapping }));
      }
    };

    fetchUsernames();
  }, [posts, usernameMapping]);

  if (loading && posts.length === 0) {
    return (
      <div className="grid gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-[#0c1023] rounded-xl overflow-hidden border border-gray-800/50">
            <Skeleton
              height={320}
              baseColor="#1a1f35"
              highlightColor="#252b47"
              className="rounded-t-xl"
            />
            <div className="p-6">
              <Skeleton
                height={20}
                width="40%"
                baseColor="#1a1f35"
                highlightColor="#252b47"
              />
              <Skeleton
                height={30}
                width="80%"
                className="mt-3"
                baseColor="#1a1f35"
                highlightColor="#252b47"
              />
              <Skeleton
                count={2}
                className="mt-3"
                baseColor="#1a1f35"
                highlightColor="#252b47"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-[#0c1023] rounded-xl overflow-hidden border border-gray-800/50
            hover:border-[#E0C600]/30 transition-all duration-300
            hover:shadow-[0_0_15px_rgba(224,198,0,0.1)] group"
        >
          <Link href={`/posts/${post.id}`} className="block">
            <div className="relative w-full h-80 overflow-hidden">
              <Image
                src={getValidImageUrl(post.thumbnailUrl)}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1023] via-transparent to-transparent" />
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
                  {new Date(post.timestamp.seconds * 1000).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
                  {/* Se muestra el username si está disponible, sino se muestra el uid */}
                  {usernameMapping[post.author] || post.author}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-[#E0C600] 
                transition-colors duration-300 mb-3">
                {post.title}
              </h2>

              <p className="text-gray-300 mb-4 line-clamp-2">
                {post.shortDescription || "No description available"}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#E0C600]/10 text-[#E0C600] text-xs 
                      font-medium rounded-full border border-[#E0C600]/20"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 text-[#E0C600] text-sm
                group-hover:gap-3 transition-all duration-300">
                Leer más
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default AllPosts;
