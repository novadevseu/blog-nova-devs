"use client";
import Link from "next/link";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
  authorUid: string;
}

interface LastPostsProps {
  posts: Post[];
  loading: boolean;
  authorsMap: { [uid: string]: { username: string; linkedIn?: string } };
}

const LastPosts: React.FC<LastPostsProps> = ({ posts, loading, authorsMap }) => {
  if (loading && posts.length === 0) {
    return (
      <section className="last-posts py-8">
        <div className="container mx-auto px-4">
          <Skeleton
            height={400}
            baseColor="#2c2c2c"
            highlightColor="#444"
            className="rounded"
          />
        </div>
      </section>
    );
  }
  return (
    <section className="last-posts py-8">
      <div className="container mx-auto px-4">
        <Carousel
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          infiniteLoop
          autoPlay
        >
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <Link href={`/posts/${post.id}`}>
                <img
                  src={post.thumbnailUrl || "/placeholder.jpg"}
                  alt={post.title}
                  className="object-cover w-full h-80 rounded-t"
                />
              </Link>
              <div className="bg-gray-700 bg-opacity-75 p-4 rounded-b">
                <p className="text-sm text-white">
                  {new Date(post.timestamp.seconds * 1000).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-xs text-gray-300">
                  By {authorsMap[post.authorUid]?.username || "Unknown"}
                  {authorsMap[post.authorUid]?.linkedIn && (
                    <span className="text-blue-500 ml-2">
                      <a
                        href={authorsMap[post.authorUid].linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </span>
                  )}
                </p>
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-2xl font-bold text-white mt-2 cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-200 mt-2">
                  {post.shortDescription || "No description available"}
                </p>
                <div className="flex justify-center flex-wrap mt-4 gap-2">
                  {post.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
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
