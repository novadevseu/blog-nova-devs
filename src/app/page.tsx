"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

import LastPosts from "@/app/LastPosts";
import AllPosts from "@/app/AllPosts";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
  thumbnailUrl: string;
  categories: string[];
  author: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);


  const POSTS_PER_PAGE = 6; // Load 6 posts per page

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      const postsRef = collection(db, "posts");
      let q = query(
        postsRef,
        orderBy("timestamp", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (!reset && lastVisible) {
        q = query(
          postsRef,
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts((prevPosts) => (reset ? newPosts : [...prevPosts, ...newPosts]));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("There was an error loading the posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Sidebar links (dummy data)
  const sidebarLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Guides", href: "/guides" },
    { name: "Contact", href: "/contact" },
    { name: "Our Website", href: "https://example.com" },
  ];

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95 text-white">
      {/* Hero Banner Section */}
      <div className="relative py-16 overflow-hidden border-b border-[#E0C600]/10">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 tracking-tight">
            Coffee<span className="text-[#E0C600] animate-pulse">Script</span>
            <span className="text-gray-400">&</span>
            Chill
          </h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto text-lg">
            Explora el mundo del desarrollo web a través de historias, tutoriales y experiencias compartidas
          </p>
        </div>
      </div>

      {/* Featured Posts Carousel */}
      <section className="py-12 bg-[#090d1f]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <LastPosts
            posts={posts.slice(0, 4)}
            loading={loading && posts.length === 0}
          />
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Posts Column */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#E0C600]"></span>
              Últimos Posts
            </h2>
            
            {loading && posts.length === 0 ? (
              <div className="space-y-6">
                <Skeleton count={6} height={200} baseColor="#1a1f35" highlightColor="#252b47" />
              </div>
            ) : (
              <div className="grid gap-6">
                <AllPosts
                  posts={posts.slice(4)}
                  loading={loading && posts.length === 0}
                />
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => fetchPosts()}
                  className="px-6 py-3 bg-[#E0C600] text-[#090d1f] rounded-lg
                    font-semibold transition-all duration-300
                    hover:bg-[#E0C600]/90 hover:scale-105
                    shadow-[0_0_15px_rgba(224,198,0,0.3)]
                    hover:shadow-[0_0_20px_rgba(224,198,0,0.4)]"
                >
                  Cargar Más
                </button>
              </div>
            )}
            {!hasMore && !loading && (
              <p className="text-center text-gray-400 mt-8 italic">
                Has llegado al final 🎉
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-[#0c1023] rounded-xl p-6 border border-gray-800/50
              shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#E0C600]"></span>
                Explorar
              </h3>
              <ul className="space-y-4">
                {sidebarLinks.map((link, index) => (
                  <li key={index}
                    className="transform transition-all duration-300 hover:translate-x-2">
                    <a href={link.href} 
                      className="text-gray-300 hover:text-[#E0C600] flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-800/50">
                <button
                  onClick={scrollToTop}
                  className="w-full px-4 py-3 bg-[#090d1f] text-gray-300
                    rounded-lg transition-all duration-300
                    hover:text-[#E0C600] hover:shadow-[0_0_15px_rgba(224,198,0,0.2)]
                    border border-gray-800/50 hover:border-[#E0C600]/50
                    flex items-center justify-center gap-2"
                >
                  <span>Volver arriba</span>
                  <span className="text-sm">↑</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg
          shadow-lg backdrop-blur-sm animate-slide-up">
          <p className="flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
