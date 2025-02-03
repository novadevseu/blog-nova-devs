import Link from "next/link";
import React from "react";

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
}

const AllPosts: React.FC<PostListProps> = ({ posts }) => {
  return (
    <section className="all-posts py-8 ">
   <h2 className="text-2xl font-bold text-center mb-6">All Posts</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col overflow-hidden">
            {/* Thumbnail Section */}
            <div className="w-full h-48 flex-shrink-0">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span>Image Unavailable</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col justify-between">
              <p className="text-sm text-purple-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Link
                href={`/posts/${post.id}`}
                className="text-xl font-bold hover:text-purple-300 mt-2"
              >
                {post.title}
              </Link>
              <p className="text-gray-300 mt-2">{post.shortDescription || "NA"}</p>
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
              <Link
                href={`/posts/${post.id}`}
                className="text-sm text-purple-400 hover:text-purple-300 mt-4"
              >
                Read more...
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllPosts;
