"use client";
import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

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

interface PostListProps {
  posts: Post[];
  loading: boolean;
}

const AllPosts: React.FC<PostListProps> = ({ posts, loading }) => {
  if (loading && posts.length === 0) {
    // Renderizamos esqueletos más vistosos para 6 cards de posts
    return (
      <div className="grid gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-transparent rounded overflow-hidden">
            <Skeleton
              height={320}
              baseColor="#2c2c2c"
              highlightColor="#444"
              className="rounded"
            />
            <div className="p-4">
              <Skeleton
                height={20}
                width="60%"
                baseColor="#2c2c2c"
                highlightColor="#444"
              />
              <Skeleton
                height={30}
                width="80%"
                className="mt-2 rounded"
                baseColor="#2c2c2c"
                highlightColor="#444"
              />
              <Skeleton
                count={3}
                className="mt-2 rounded"
                baseColor="#2c2c2c"
                highlightColor="#444"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-transparent rounded overflow-hidden">
          <div className="w-full h-80">
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-white">Image not available</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500">
              {new Date(post.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link href={`/posts/${post.id}`}>
              <span className="block text-2xl font-bold mt-2 cursor-pointer text-gray-800">
                {post.title}
              </span>
            </Link>
            <p className="text-gray-600 mt-2">
              {post.shortDescription || "No description available"}
            </p>
            <div className="flex flex-wrap mt-4 gap-2">
              {post.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
            <Link href={`/posts/${post.id}`}>
              <span className="text-sm text-blue-500 mt-4 cursor-pointer inline-block">
                Read more...
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllPosts;
