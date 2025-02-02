"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData } from "firebase/firestore";
import { db } from "../config/firebase-config";
import Navbar from "../components/Navbar";

// Define the interface for a post
interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
  thumbnailUrl: string; // New field
  categories: string[]; // New field
  author: string; // New field
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
      setError("There was an error loading the posts. Please try again later.");
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
      <main className="row-start-2 p-8 ">
        <h2 className="text-2xl font-semibold text-center mb-8">Firestore Posts</h2>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-500">Loading posts...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* No Posts Found */}
        {!loading && posts.length === 0 && !error && (
          <p className="text-center text-gray-500">No posts found.</p>
        )}

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className=" p-6 flex">
              <Link href={`/posts/${post.id}`} className="flex-shrink-0">
                  
                
              {post.thumbnailUrl ? (
                <img src={post.thumbnailUrl} alt="Thumbnail" className="w-40 h-40 rounded-lg mr-4" />
              ) : (
                <div className="w-40 h-40  rounded-lg flex items-center justify-center mr-4">
                  <span>Unknown</span>
                </div>
              )}</Link>
              <div className="flex flex-col justify-between">
                <Link href={`/posts/${post.id}`} className="text-2xl font-bold hover:text-gray-600">
                  {post.title}
                </Link>
                <p className="text-sm  mt-2">
                  <strong>Author:</strong> {post.author || <span>Unknown</span>}
                </p>
                <p className="text-lg  mt-2">{post.shortDescription || "NA"}</p>
                <p className="text-sm  mt-2">
                  {new Date(post.timestamp.seconds * 1000).toLocaleString()}
                </p>
                <p className="text-sm  mt-2">
                  {post.categories && post.categories.length > 0 ? <strong>Categories: {post.categories.join(", ")}</strong> : <span></span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchPosts()}
              className="px-4 py-2 bg-indigo-600  hover:bg-indigo-700"
            >
              Load more
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
