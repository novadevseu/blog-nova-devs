import { db } from "@/config/firebase-config";
import { addDoc, collection } from "@firebase/firestore";

interface HandleAddComment {
    newComment : string | null,
    id : string,
    userEmail : string | null,
    selectedCommentId : string | null,
    setNewComment : React.Dispatch<React.SetStateAction<string>>
    e : React.FormEvent
}

export const addCommentHook = async ({e,id,newComment,setNewComment,userEmail,selectedCommentId} : HandleAddComment) => {
    e.preventDefault();
    if (!newComment || !id || !userEmail) return;

    console.log('helo')

    try {
      await addDoc(collection(db, "comments"), {
        postId: id,
        email: userEmail,
        content: newComment,
        parentCommentId : selectedCommentId,
        timestamp: new Date(),
      });
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  }; 