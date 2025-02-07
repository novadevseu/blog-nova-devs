"use client";
import React from "react";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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

interface LastPostsProps {
  posts: Post[];
  loading: boolean;
}

const LastPosts: React.FC<LastPostsProps> = ({ posts, loading }) => {
  if (loading && posts.length === 0) {
    // Render a skeleton carousel when loading
    return (
      <section className="last-posts py-8">
        <div className="container mx-auto px-4">
          <Skeleton height={400} />
        </div>
      </section>
    );
  }

  return (
    <section className="last-posts py-8">
      <div className="container mx-auto px-4">
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <img
                src={post.thumbnailUrl || "/placeholder.jpg"}
                alt={post.title}
                className="object-cover w-full h-80"
              />
              {/* Grey overlay for text */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full bg-gray-700 bg-opacity-75 p-4">
                  <p className="text-sm text-white">
                    {new Date(post.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-300">By {post.author}</p>
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-2xl font-bold text-white mt-2 cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-200 mt-2">
                    {post.shortDescription || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default LastPosts;
