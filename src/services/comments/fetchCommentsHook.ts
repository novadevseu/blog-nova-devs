import { db } from "@/config/firebase-config";
import { Comment } from "@/types/CommentType";
import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";

export interface FetchComments {
  id: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export const fetchCommentsHook = ({ id, setComments }: FetchComments) => {
  const commentsRef = collection(db, "comments");
  const q = query(commentsRef, where("postId", "==", id), orderBy("timestamp", "desc"));

  return onSnapshot(q, (snapshot) => {
    const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        replies: [] 
    })) as unknown as Comment[];

    const commentMap = new Map<string | null, Comment[]>();

    fetchedComments.forEach((comment) => {
      const parentId = comment.parentCommentId || null;

      if (!commentMap.has(parentId)) {
        commentMap.set(parentId, []);
      }

      commentMap.get(parentId)?.push(comment);
    });

    const nestedComments = (commentMap.get(null) || []).map((parent) => ({
      ...parent,
      replies: commentMap.get(parent.id) || [], 
    }));

    setComments(nestedComments);
  });
};
