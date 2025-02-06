import { db } from "@/config/firebase-config";
import { deleteDoc, doc } from "@firebase/firestore";

export const deleteCommentHook = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };