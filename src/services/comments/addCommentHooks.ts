import { db } from "@/config/firebase-config";
import { addDoc, collection } from "@firebase/firestore";

interface HandleAddComment {
  newComment: string | null;
  id: string;
  userUid: string | null; // Se reemplaza userEmail por userUid
  selectedCommentId: string | null;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  e: React.FormEvent;
}

export const addCommentHook = async ({
  e,
  id,
  newComment,
  setNewComment,
  userUid, // Se recibe el userUid en lugar de userEmail
  selectedCommentId,
}: HandleAddComment) => {
  e.preventDefault();
  if (!newComment || !id || !userUid) return;

  console.log("helo");

  try {
    await addDoc(collection(db, "comments"), {
      postId: id,
      userUid: userUid, // Se guarda el userUid en la colección
      content: newComment,
      parentCommentId: selectedCommentId,
      timestamp: new Date(),
    });
    setNewComment("");
  } catch (err) {
    console.error("Error adding comment:", err);
  }
};
