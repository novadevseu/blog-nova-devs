"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserType } from "@/redux/slices/userSlice";
import { useUser } from "@/hooks/useUser";
import { Comment } from "@/types/CommentType";
import PostContainer from "../PostContainer";

const PostPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");

  // Get the current user from Redux via your hook
  const currentUser: UserType | null = useUser();

  // Log comments on change (for debugging)
  useEffect(() => {
    console.log(comments);
  }, [comments]);

 /*  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          setUserRole(currentUser.role);
          setUserEmail(currentUser.email);
        } catch (err) {
          console.error("Error loading user role:", err);
        }
      }
    };

    fetchPostHook({ id, setError, setLoading, setPost });
    const unsubscribeComments = fetchCommentsHook({ id, setComments });
    fetchUserRole();

    return () => unsubscribeComments();
  }, [id, currentUser]); 
                                                                                                          // can be putted in comment Container
  // Updated: Remove redirection; the form will be disabled if not logged in.
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // This function should only fire when the user is logged in
    await addCommentHook({
      e,
      id,
      newComment,
      setNewComment,
      userEmail,
      selectedCommentId: null,
    });
  };

  // Updated: Remove redirection; simply call addCommentHook if user is logged in.
  const handleReplyComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCommentHook({
      e,
      id,
      newComment: replyComment,
      selectedCommentId,
      setNewComment,
      userEmail,
    });
    setReplyComment("");
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentHook(commentId);
  }; */

  return (
    <div className="flex flex-col min-h-screen">
      <div className="  flex items-center justify-center flex-1 p-6">
        <PostContainer setError={setError} id={id} />
      </div>
    </div>
  );
};

export default PostPage;
