"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData } from "firebase/firestore";
import { db } from "./config/firebase-config";
import Navbar from "./components/Navbar";

// Define la interfaz para un post
interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const POSTS_PER_PAGE = 5;

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    setError("");

    try {
      const postsRef = collection(db, "posts");
      let q = query(postsRef, orderBy("timestamp", "desc"), limit(POSTS_PER_PAGE));

      if (!reset && lastVisible) {
        q = query(postsRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(POSTS_PER_PAGE));
      }

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(reset ? newPosts : [...posts, ...newPosts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Hubo un error al cargar los posts. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-stretch min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <header className="row-start-1">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="row-start-2 p-8 bg-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-8">Firestore Posts</h2>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-500">Cargando posts...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* No Posts Found */}
        {!loading && posts.length === 0 && !error && (
          <p className="text-center text-gray-500">No se encontraron posts.</p>
        )}

        {/* Posts List */}
        <div className="flex flex-col items-center gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="bg-white p-6 rounded-lg shadow w-full max-w-4xl hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold">{post.title}</h3>
              <p className="text-lg text-gray-700 mt-4">{post.shortDescription || "NA"}</p>
              <p className="text-sm text-gray-500 mt-4">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchPosts()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Cargar más
            </button>
          </div>
        )}
      </main>

      
    </div>
  );
}
