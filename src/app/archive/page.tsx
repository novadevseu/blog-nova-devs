"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { Post } from "@/types/PostType";

const Archive: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        // Order posts alphabetically by title (A-Z)
        const q = query(postsCollection, orderBy("title", "asc"));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c122a]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c122a]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c122a] py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Archive</h1>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 ">
              <Link href={`/posts/${post.id}`}>
                
                  {post.title} {" "}
                
                By: {post.author} Created on:{" "}
                {new Date(
                  (post.timestamp?.seconds ?? 0) * 1000
                ).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Archive;
