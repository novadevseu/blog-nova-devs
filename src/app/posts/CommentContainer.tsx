import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";
import { addCommentHook } from "@/services/comments/addCommentHooks";
import { deleteCommentHook } from "@/services/comments/deleteCommentHook";
import { fetchCommentsHook } from "@/services/comments/fetchCommentsHook";
import { Comment } from "@/types/CommentType";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "@/config/firebase-config";

interface CommentContainerInterface {
  id: string; // Este id corresponde al postId
}

function CommentContainer({ id }: CommentContainerInterface) {
  const [currentUser, setCurrentUser] = useState<null | UserType>(useUser());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [usernames, setUsernames] = useState<{ [uid: string]: string }>({});

  // Efecto para subscribirse a los comentarios.
  useEffect(() => {
    const unsubscribeComments = fetchCommentsHook({ id, setComments });
    return () => unsubscribeComments();
  }, [id]);

  // Efecto para cargar datos del usuario actual.
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role);
      setUserUid(currentUser.uid);
    }
  }, [currentUser]);

  // Efecto para obtener los nombres de usuario antes de renderizar
  useEffect(() => {
    // Extraemos UIDs de comentarios y respuestas.
    const uidSet = new Set<string>();
    comments.forEach((comment) => {
      uidSet.add(comment.userUid);
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => uidSet.add(reply.userUid));
      }
    });
    const uids = Array.from(uidSet);
    if (uids.length === 0) return;

    // Nota: La consulta "in" tiene un límite de 10 elementos.
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "in", uids));
    getDocs(q)
      .then((snapshot) => {
        const fetchedUsernames: { [uid: string]: string } = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          // Suponiendo que el documento tiene los campos "uid" y "username".
          fetchedUsernames[data.uid] = data.username;
        });
        setUsernames(fetchedUsernames);
      })
      .catch((error) => {
        console.error("Error fetching usernames: ", error);
      });
  }, [comments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) {
      alert("You need to log in to comment!");
      return;
    }
    await addCommentHook({
      e,
      id, // postId
      newComment,
      setNewComment,
      userUid,
      selectedCommentId: null,
    });
  };

  const handleReplyComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) {
      alert("You need to log in to comment!");
      return;
    }
    await addCommentHook({
      e,
      id,
      newComment: replyComment,
      selectedCommentId,
      setNewComment,
      userUid,
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentHook(commentId);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <form onSubmit={handleAddComment} className="mb-6">
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

      {comments.map((comment: Comment) => (
        <div key={comment.id} className="border-gray-200 pb-4 mb-4">
          {/* Mostramos el username en lugar del userUid */}
          <p className="text-sm font-medium">
            {usernames[comment.userUid] || comment.userUid}
          </p>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
          </p>
          {selectedCommentId === comment.id && (
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
            {selectedCommentId !== comment.id ? (
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
              {comment.replies.map((innerComment: Comment) => (
                <div
                  key={innerComment.id}
                  className="border-b border-gray-200 pb-4 mt-6 ml-10"
                >
                  <p className="text-sm font-medium">
                    {usernames[innerComment.userUid] || innerComment.userUid}
                  </p>
                  <p className="text-gray-700">{innerComment.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(innerComment.timestamp.seconds * 1000).toLocaleString()}
                  </p>
                  {(userRole === "Admin" ||
                    (userUid && userUid === innerComment.userUid)) && (
                    <button
                      onClick={() => handleDeleteComment(innerComment.id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentContainer;
