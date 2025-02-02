"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebase-config";
import Navbar from "../../../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged } from "firebase/auth";

interface Post {
  title: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

interface Comment {
  id: string;
  email: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}

const PostPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("No valid ID provided.");
        setLoading(false);
        return;
      }

      try {
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          setPost(postDoc.data() as Post);
        } else {
          setError("The post does not exist.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("There was an error loading the post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = () => {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("postId", "==", id),
        orderBy("timestamp", "desc")
      );

      return onSnapshot(q, (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setComments(fetchedComments);
      });
    };

    const fetchUserRole = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.role as string);
              setUserEmail(currentUser.email);
            }
          } catch (err) {
            console.error("Error loading user role:", err);
          }
        }
      });
    };

    fetchPost();
    const unsubscribeComments = fetchComments();
    fetchUserRole();

    return () => unsubscribeComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !id || !userEmail) return;

    try {
      await addDoc(collection(db, "comments"), {
        postId: id,
        email: userEmail,
        content: newComment,
        timestamp: new Date(),
      });
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <div className="flex items-center justify-center flex-1">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <div className="flex items-center justify-center flex-1 bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>

          {/* Edit button */}
          {userRole === "Admin" && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => router.push(`/update/${id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Post
              </button>
            </div>
          )}

          <div className="markdown-content mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post?.content || ""}
            </ReactMarkdown>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Published on: {new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}
          </p>

          {/* Comments section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            {userEmail && (
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full p-3 border border-gray-300 rounded-md mb-2"
                  rows={3}
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                >
                  Comment
                </button>
              </form>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm font-medium">{comment.email}</p>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                </p>
                {userRole === "Admin" && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
