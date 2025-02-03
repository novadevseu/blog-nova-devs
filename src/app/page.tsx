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

import LastPosts from "@/components/LastPosts"; // Import LastPosts component
import AllPosts from "@/components/AllPosts"; // Import AllPosts component
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserType } from "@/redux/slices/userSlice";
import { useUser } from "@/hooks/useUser";

// Define the interface for a post
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());
  
  const POSTS_PER_PAGE = 5;

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

      setPosts(reset ? newPosts : [...posts, ...newPosts]);
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

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-stretch min-h-screen ">
      {/* Main Content */}
      <main className="row-start-2">
        <h2
          className=" font-semibold text-center font-sans mb-8 border-t-2 border-b-2 border-white"
          id="title"
        >
          Coffee<span style={{ color: "#E0C600" }}>Script</span> & Chill
        </h2>
        {/* Loading State */}
        {loading && <p className="text-center text-gray-500"></p>}
        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}
        {/* No Posts Found */}
        {!loading && posts.length === 0 && !error && (
          <p className="text-center text-gray-500">No posts found.</p>
        )}
        {/* Section for the first 4 posts */}
        <LastPosts posts={posts.slice(0, 4)} />
        {/* Section for the remaining posts */}
        <AllPosts posts={posts.slice(4)} />
        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchPosts()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700"
            >
              Load more
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
