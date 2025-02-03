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
    <section className="all-posts py-8">
      
      <div className="container mx-auto px-4 grid gap-6"><h2 className="text-2xl font-bold text-start mb-6">Last Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="bg-transparent rounded overflow-hidden">
            {/* Imagen grande en la parte superior */}
            <div className="w-full h-80">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span className="text-white">Imagen no disponible</span>
                </div>
              )}
            </div>
            {/* Contenido debajo de la imagen */}
            <div className="p-4">
              <p className="text-sm text-purple-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Link href={`/posts/${post.id}`}>
                <span className="block text-2xl font-bold mt-2 cursor-pointer">
                  {post.title}
                </span>
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
              <Link href={`/posts/${post.id}`}>
                <span className="text-sm text-purple-400 mt-4 cursor-pointer">
                  Read more...
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllPosts;
