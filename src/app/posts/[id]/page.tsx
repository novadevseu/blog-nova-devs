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
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebase-config";
import Navbar from "../../../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged } from "firebase/auth";
import { UserType } from "@/redux/slices/userSlice";
import { useUser } from "@/hooks/useUser";
import CommentComponent from "@/components/CommentSection";
import { Post } from "@/types/PostType";
import { Comment } from "@/types/CommentType";
import { fetchPostHook } from "@/services/posts/fetchPostsHook";
import { fetchCommentsHook } from "@/services/comments/fetchCommentsHook";
import { addCommentHook } from "@/services/comments/addCommentHooks";
import { deleteCommentHook } from "@/services/comments/deleteCommentHook";

const PostPage = () => {
  const params = useParams();
  const id  = Array.isArray(params.id) ? params.id[0] : params.id as string; // Ensure id is a string
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyComment,setReplyComment] = useState("");
  const [selectedCommentId,setSelectedCommentId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());

  useEffect(()=>{
    console.log('naber3',comments)
  },[comments])

  useEffect(() => {
    const fetchUserRole = async () => {
        if (currentUser) {
          try {
              setUserRole(currentUser.role);
              setUserEmail(currentUser.email);
            }
           catch (err) {
            console.error("Error loading user role:", err);
          }
        }
    };

    fetchPostHook({id,setError,setLoading,setPost});
    const unsubscribeComments = fetchCommentsHook({id,setComments});
    fetchUserRole();

    return () => unsubscribeComments();
  }, [id]);

  const handleAddComment = (e : React.FormEvent) => {
    addCommentHook({e,id,newComment,setNewComment,userEmail,selectedCommentId});
  }

  const handleReplyComment = (e : React.FormEvent) => {
    addCommentHook({e,id,newComment : replyComment,selectedCommentId,setNewComment,userEmail})
  }

  const handleDeleteComment = (commentId : string) => {
    deleteCommentHook(commentId);
  }

  if (error) 
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

  if (loading) 
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

  return (
    <div className="flex flex-col min-h-screen">
    
      <div className="flex items-center justify-center flex-1  p-6">
        <div className=" p-8 rounded-lg  w-full max-w-4xl">
          {/* Author, Date, and Categories */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              <strong>Author:</strong> {post?.author || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Published on:</strong> {new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Categories:</strong> {post!.categories?.length > 0 ? post!.categories.join(", ") : "None"}
            </p>
          </div>

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
              <form onSubmit={handleAddComment} className="mb-6 ">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full p-3 border border-gray-300 rounded-md mb-2"
                  style={{ color: 'black' }}
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

            {/* <CommentComponent />  */}

            {comments.map((comment) => (
              <div key={comment.id} className=" border-gray-200 pb-4 mb-4">
                <p className="text-sm font-medium">{comment.email}</p>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                </p>
                {
                  selectedCommentId == comment.id && 
                  <form>
                    <textarea 
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)} 
                      className="w-full p-3 border border-gray-300 rounded-md mb-2"
                      style={{ color: 'black' }}
                      rows={3}
                    ></textarea>
                  </form>
                }
                <div className="flex items-center gap-5 mt-2 border-b pb-5">
                  {selectedCommentId != comment.id ? 
                  <>
                    <button
                      onClick={() => setSelectedCommentId(comment.id)}
                      className="text-blue-500 text-sm"
                    >
                      Reply
                    </button>
                    {userRole === "Admin" && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </> 
                  : 
                  <>
                  <button
                    onClick={(e) => handleReplyComment(e)}
                    className="text-blue-500 text-sm"
                  >
                    Submit
                  </button>
                  {userRole === "Admin" && (
                    <button
                      onClick={() => {
                        setSelectedCommentId(null)
                        setReplyComment("")
                      }}
                      className="text-red-500 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  </> 
                  }
                </div>  
                  {
                    comment.replies && 
                    comment.replies.length > 1 && 
                    <div>
                      {
                        comment.replies.map((innerComment : Comment) => {
                          return (
                            <div key={innerComment.id} className="border-b border-gray-200 pb-4 mt-6 ml-10">
                              <p className="text-sm font-medium">{innerComment.email}</p>
                              <p className="text-gray-700">{innerComment.content}</p>
                              <p className="text-xs text-gray-500">
                              {new Date(innerComment.timestamp.seconds * 1000).toLocaleString()}
                              </p>
                            </div>
                          )
                        } ) 
                      }
                    </div>
                  }  
              </div>
            ))} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
