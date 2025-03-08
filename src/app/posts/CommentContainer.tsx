import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";
import { addCommentHook } from "@/services/comments/addCommentHooks";
import { deleteCommentHook } from "@/services/comments/deleteCommentHook";
import { fetchCommentsHook } from "@/services/comments/fetchCommentsHook";
import { Comment } from "@/types/CommentType";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";

interface CommentContainerInterface {
  id: string;
}

function CommentContainer({ id }: CommentContainerInterface) {
  const [currentUser, setCurrentUser] = useState<null | UserType>(useUser());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  // Estado para almacenar el mapping: uid -> username
  const [usernameMapping, setUsernameMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          setUserRole(currentUser.role);
          setUserUid(currentUser.uid);
        } catch (err) {
          console.error("Error loading user role:", err);
        }
      }
    };

    const unsubscribeComments = fetchCommentsHook({ id, setComments });
    fetchUserRole();
    return () => unsubscribeComments();
  }, [id]);

  // Cada vez que cambien los comentarios, se recogen los uids que aún no se tienen mapeados y se buscan en Firestore
  useEffect(() => {
    const fetchUsernames = async () => {
      const uidsToFetch: Set<string> = new Set();
      comments.forEach((comment) => {
        if (comment.userUid && !usernameMapping[comment.userUid]) {
          uidsToFetch.add(comment.userUid);
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            if (reply.userUid && !usernameMapping[reply.userUid]) {
              uidsToFetch.add(reply.userUid);
            }
          });
        }
      });

      if (uidsToFetch.size > 0) {
        const newMapping: Record<string, string> = {};
        for (const uid of Array.from(uidsToFetch)) {
          try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              newMapping[uid] = data.username || "Unknown";
            } else {
              newMapping[uid] = "Unknown";
            }
          } catch (err) {
            console.error("Error fetching username for uid:", uid, err);
            newMapping[uid] = "Unknown";
          }
        }
        setUsernameMapping((prev) => ({ ...prev, ...newMapping }));
      }
    };

    fetchUsernames();
  }, [comments, usernameMapping]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) {
      alert("You need to log in to comment!");
      return;
    }
    await addCommentHook({ e, id, newComment, setNewComment, userUid, selectedCommentId: null });
  };

  const handleReplyComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) {
      alert("You need to log in to comment!");
      return;
    }
    await addCommentHook({ e, id, newComment: replyComment, selectedCommentId, setNewComment, userUid });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentHook(commentId);
  };

  return (
    <div className="mt-6 space-y-8">
      <div className="bg-[#0c1023] rounded-xl p-6 border border-gray-800/50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-[#E0C600]"></span>
          Comentarios
          <span className="text-sm text-gray-400">({comments.length})</span>
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full p-4 bg-[#090d1f] border border-gray-800/50 rounded-lg
                      text-gray-300 placeholder-gray-500 focus:border-[#E0C600]/50
                      focus:outline-none focus:ring-1 focus:ring-[#E0C600]/30
                      transition-all duration-300"
            rows={3}
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#E0C600] text-[#090d1f] rounded-lg
                      font-semibold transition-all duration-300
                      hover:bg-[#E0C600]/90 hover:scale-105
                      shadow-[0_0_15px_rgba(224,198,0,0.2)]
                      hover:shadow-[0_0_20px_rgba(224,198,0,0.3)]
                      disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!userUid}
          >
            {userUid ? "Comentar" : "Inicia sesión para comentar"}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment: Comment) => (
          <div
            key={comment.id}
            className="bg-[#0c1023] rounded-xl p-6 border border-gray-800/50
                      transition-all duration-300 hover:border-gray-700/50"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="font-medium text-[#E0C600]">
                {usernameMapping[comment.userUid] || comment.userUid}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </div>
            <p className="text-gray-300 mb-4">{comment.content}</p>

            {/* Reply Form */}
            {selectedCommentId === comment.id && (
              <form className="mt-4 space-y-4" onSubmit={handleReplyComment}>
                <textarea
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  className="w-full p-4 bg-[#090d1f] border border-gray-800/50 rounded-lg
                              text-gray-300 placeholder-gray-500 focus:border-[#E0C600]/50
                              focus:outline-none focus:ring-1 focus:ring-[#E0C600]/30
                              transition-all duration-300"
                  placeholder="Escribe tu respuesta..."
                  rows={2}
                />
              </form>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-4">
              {selectedCommentId !== comment.id ? (
                <>
                  <button
                    onClick={() => setSelectedCommentId(comment.id)}
                    className="text-sm text-[#E0C600] hover:text-[#E0C600]/80
                              transition-colors duration-300"
                  >
                    Responder
                  </button>
                  {userRole === "Admin" && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-500 hover:text-red-400
                              transition-colors duration-300"
                    >
                      Eliminar
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
                    className="text-sm text-[#E0C600] hover:text-[#E0C600]/80
                              transition-colors duration-300"
                  >
                    Enviar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCommentId(null);
                      setReplyComment("");
                    }}
                    className="text-sm text-red-500 hover:text-red-400
                              transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-6 space-y-4 pl-6 border-l-2 border-gray-800/50">
                {comment.replies.map((reply: Comment) => (
                  <div
                    key={reply.id}
                    className="bg-[#090d1f] rounded-lg p-4 border border-gray-800/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-[#E0C600]">
                        {usernameMapping[reply.userUid] || reply.userUid}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.timestamp.seconds * 1000).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-300">{reply.content}</p>
                    {((userRole === "Admin") || (userUid && userUid === reply.userUid)) && (
                      <button
                        onClick={() => handleDeleteComment(reply.id)}
                        className="mt-2 text-sm text-red-500 hover:text-red-400
                                  transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentContainer;
