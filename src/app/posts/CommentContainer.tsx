import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";
import { addCommentHook } from "@/services/comments/addCommentHooks";
import { deleteCommentHook } from "@/services/comments/deleteCommentHook";
import { fetchCommentsHook } from "@/services/comments/fetchCommentsHook";
import { Comment } from "@/types/CommentType";
import { useEffect, useState } from "react";

interface CommentContainerInterface {
  id: string;
}

function CommentContainer({ id }: CommentContainerInterface) {
  const [currentUser, setCurrentUser] = useState<null | UserType>(useUser());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  useEffect(() => {
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

    const unsubscribeComments = fetchCommentsHook({ id, setComments });
    fetchUserRole();
    return () => unsubscribeComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    if (!userEmail) alert("You need to log in to comment!");
    await addCommentHook({
      e,
      id,
      newComment,
      setNewComment,
      userEmail,
      selectedCommentId: null,
    });
  };

  const handleReplyComment = async (e: React.FormEvent) => {
    if (!userEmail) alert("You need to log in to comment!");
    await addCommentHook({
      e,
      id,
      newComment: replyComment,
      selectedCommentId,
      setNewComment,
      userEmail,
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentHook(commentId);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {
        <form onSubmit={handleAddComment} className="mb-6 ">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 border border-gray-300 rounded-md mb-2"
            style={{ color: "black" }}
            rows={3}
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Comment
          </button>
        </form>
      }

      {comments.map((comment: Comment) => (
        <div key={comment.id} className=" border-gray-200 pb-4 mb-4">
          <p className="text-sm font-medium">{comment.email}</p>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
          </p>
          {selectedCommentId == comment.id && (
            <form>
              <textarea
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-2"
                style={{ color: "black" }}
                rows={3}
              ></textarea>
            </form>
          )}
          <div className="flex items-center gap-5 mt-2 border-b pb-5">
            {selectedCommentId != comment.id ? (
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
            ) : (
              <>
                <button
                  onClick={(e) => {
                    handleReplyComment(e);
                    setReplyComment("");
                  }}
                  className="text-blue-500 text-sm"
                >
                  Submit
                </button>
                {userRole === "Admin" && (
                  <button
                    onClick={() => {
                      setSelectedCommentId(null);
                      setReplyComment("");
                    }}
                    className="text-red-500 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
          {comment.replies && comment.replies.length >= 1 && (
            <div>
              {comment.replies.map((innerComment: Comment) => {
                return (
                  <div
                    key={innerComment.id}
                    className="border-b border-gray-200 pb-4 mt-6 ml-10"
                  >
                    <p className="text-sm font-medium">{innerComment.email}</p>
                    <p className="text-gray-700">{innerComment.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        innerComment.timestamp.seconds * 1000
                      ).toLocaleString()}
                    </p>
                    {(userRole === "Admin" ||
                      (userEmail && userEmail == innerComment.email)) && (
                      <button
                        onClick={() => handleDeleteComment(innerComment.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentContainer;
