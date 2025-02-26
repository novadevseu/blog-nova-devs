"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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

interface LastPostsProps {
  posts: Post[];
  loading: boolean;
}

const getValidImageUrl = (url: string | undefined) => {
  const placeholder =
    "https://placehold.co/600x400/090d1f/E0C600/png?text=CoffeeScript";

  if (!url || url.trim() === "") return placeholder;

  try {
    new URL(url);
    return url;
  } catch {
    return placeholder;
  }
};

const LastPosts: React.FC<LastPostsProps> = ({ posts, loading }) => {
  if (loading && posts.length === 0) {
    return (
      <section className="last-posts py-8">
        <div className="container mx-auto px-4">
          <Skeleton
            height={500}
            baseColor="#1a1f35"
            highlightColor="#252b47"
            className="rounded-xl"
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
          showIndicators={true}
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          transitionTime={500}
          stopOnHover
          swipeable
          emulateTouch
          className="custom-carousel"
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={clickHandler}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2
          w-12 h-12 flex items-center justify-center
          bg-[#E0C600]/80 hover:bg-[#E0C600] rounded-full
          transition-all duration-300 transform-gpu"
                style={{ transform: "translate(0, -50%)" }}
              >
                <span className="sr-only">Anterior</span>
                <span className="text-[#090d1f] text-2xl">←</span>
              </motion.button>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={clickHandler}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2
          w-12 h-12 flex items-center justify-center
          bg-[#E0C600]/80 hover:bg-[#E0C600] rounded-full
          transition-all duration-300 transform-gpu"
                style={{ transform: "translate(0, -50%)" }}
              >
                <span className="sr-only">Siguiente</span>
                <span className="text-[#090d1f] text-2xl">→</span>
              </motion.button>
            )
          }
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="relative h-[500px]">
                <Image
                  src={getValidImageUrl(post.thumbnailUrl)}
                  alt={post.title || "Post thumbnail"}
                  fill
                  className="object-cover rounded-xl"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-[#090d1f]/50 to-transparent rounded-xl" />

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-8"
                >
                  <Link href={`/posts/${post.id}`} className="group">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#E0C600] rounded-full" />
                          {new Date(
                            post.timestamp.seconds * 1000
                          ).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#E0C600] rounded-full" />
                          {post.author}
                        </span>
                      </div>

                      <h2
                        className="text-3xl font-bold text-white group-hover:text-[#E0C600] 
                        transition-colors duration-300"
                      >
                        {post.title}
                      </h2>

                      <p className="text-gray-300 line-clamp-2">
                        {post.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {post.categories?.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#E0C600]/10 text-[#E0C600] 
                              text-sm rounded-full border border-[#E0C600]/20"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default LastPosts;
