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

import LastPosts from "@/components/LastPosts";
import AllPosts from "@/components/AllPosts";
import { useUser } from "@/hooks/useUser";
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

  const currentUser = useUser();
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
    <div className="min-h-screen">
      {/* Banner Section */}
      <h2
          className=" font-semibold text-center font-sans mb-8 border-t-2 border-b-2 border-white"
          id="title"
        >
          Coffee<span style={{ color: "#E0C600" }}>Script</span> & Chill
        </h2>

      {/* Carousel Section */}
      <LastPosts
        posts={posts.slice(0, 4)}
        loading={loading && posts.length === 0}
      />

      {/* Two-column layout: Left for Posts Cards, Right for Sidebar */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Column (Posts) */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          {loading && posts.length === 0 ? (
            <Skeleton count={6} height={200} />
          ) : (
            // The posts used in the carousel (first 4) are skipped here
            <AllPosts
              posts={posts.slice(4)}
              loading={loading && posts.length === 0}
            />
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchPosts()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Load More
              </button>
            </div>
          )}
          {!hasMore && !loading && (
            <p className="text-center text-gray-500 mt-8">No more posts</p>
          )}
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="w-full md:w-1/2">
          <div className="p-4 sticky top-0">
            <h3 className="text-xl font-semibold mb-4">Learn More</h3>
            <ul className="space-y-2">
              {sidebarLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-blue-600 hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};

export default HomePage;
