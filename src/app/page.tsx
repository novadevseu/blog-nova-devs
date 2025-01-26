"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData } from "firebase/firestore";
import { db } from "./config/firebase-config";
import Navbar from "./components/Navbar";

// Define la interfaz para un post
interface Post {
  id: string;
  title: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const POSTS_PER_PAGE = 6;

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

        {/* Posts Grid */}
        <div className="flex flex-col gap-6 items-start">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow w-1/2"
            >
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{post.content}</p>
              <p className="text-xs text-gray-500 mt-4">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </div>
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

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 items-center justify-center p-4 bg-white">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
