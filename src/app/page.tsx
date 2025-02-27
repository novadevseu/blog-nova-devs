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

import { motion, AnimatePresence } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-24 bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95 text-white"
    >
      {/* Hero Banner Section */}
      <motion.div 
        variants={heroVariants}
        className="relative py-16 overflow-hidden border-b border-[#E0C600]/10"
      >
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10"
        />
        <div className="container mx-auto px-4">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-center mb-6 tracking-tight"
          >
            Coffee
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#E0C600]"
            >
              Script
            </motion.span>
            <span className="text-gray-400">&</span>
            Chill
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-center max-w-2xl mx-auto text-lg"
          >
            Explora el mundo del desarrollo web a través de historias, tutoriales y experiencias compartidas
          </motion.p>
        </div>
      </motion.div>

      {/* Featured Posts Carousel */}
      <motion.section 
        variants={itemVariants}
        className="py-12 bg-[#090d1f]/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <LastPosts
            posts={posts.slice(0, 4)}
            loading={loading && posts.length === 0}
          />
        </div>
      </motion.section>

      {/* Main Content Section */}
      <motion.div 
        variants={itemVariants}
        className="container mx-auto px-4 py-12"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Posts Column */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-2/3"
          >
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

<AnimatePresence>
              {hasMore && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchPosts()}
                    className="px-6 py-3 bg-[#E0C600] text-[#090d1f] rounded-lg
                      font-semibold transition-all duration-300
                      hover:bg-[#E0C600]/90
                      shadow-[0_0_15px_rgba(224,198,0,0.3)]
                      hover:shadow-[0_0_20px_rgba(224,198,0,0.4)]"
                  >
                    Cargar Más
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/3"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-24 bg-[#0c1023] rounded-xl p-6 border border-gray-800/50
                shadow-lg backdrop-blur-sm"
            >
              {/* ...existing sidebar content... */}
              <motion.ul 
                variants={containerVariants}
                className="space-y-4"
              >
                {sidebarLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="transform transition-all duration-300"
                  >
                    <a href={link.href} 
                      className="text-gray-300 hover:text-[#E0C600] flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-[#E0C600] rounded-full"
                      />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-8 pt-8 border-t border-gray-800/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToTop}
                  className="w-full px-4 py-3 bg-[#090d1f] text-gray-300
                    rounded-lg transition-all duration-300
                    hover:text-[#E0C600] hover:shadow-[0_0_15px_rgba(224,198,0,0.2)]
                    border border-gray-800/50 hover:border-[#E0C600]/50
                    flex items-center justify-center gap-2"
                >
                  <span>Volver arriba</span>
                  <motion.span 
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm"
                  >
                    ↑
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Error Message with Animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg
              shadow-lg backdrop-blur-sm"
          >
            <motion.p 
              animate={{ x: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span>⚠️</span>
              {error}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;
