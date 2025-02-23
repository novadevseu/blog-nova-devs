"use client";
import { useUser } from "@/hooks/useUser";
import { deleteCommentHook } from "@/services/comments/deleteCommentHook";
import { fetchUserComments } from "@/services/comments/fetchUserCommentsHook";
import { Comment } from "@/types/CommentType";
import React, { SetStateAction, useEffect, useState } from "react";

interface UserCOmmentsInterface {
  isOpen: boolean;
  onClose: () => void;
}

function UserComments({ isOpen, onClose }: UserCOmmentsInterface) {
  const currentUser = useUser();

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    (async () => {
      const commentsData = await fetchUserComments({
        userUid: currentUser!.uid,
      });
      setComments(commentsData as unknown as SetStateAction<Comment[]>);
    })();
  }, [currentUser]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const handleDeleteComment = async (commentId: string) => {
    console.log(commentId)
    await deleteCommentHook(commentId);
  };

  if (isOpen)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Comments</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Comments List */}
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li
                  key={index}
                  className="flex flex-col justify-between items-start bg-gray-100 p-4 rounded"
                >
                  <span className="text-sm text-gray-700">
                    {comment.content}
                  </span>
                  <p className="mt-1 text-xs text-gray-500">
                    Post Title: {comment.post?.title}
                  </p>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments available</p>
            )}
          </ul>

          {/* Close Button */}
          <div className="mt-4 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
}

export default UserComments;
