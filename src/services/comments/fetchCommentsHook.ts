import { db } from "@/config/firebase-config";
import { Comment } from "@/types/CommentType";
import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { Unsubscribe } from "firebase/auth";

export interface FecthComments {
    id : string,
    setComments : React.Dispatch<React.SetStateAction<Comment[]>>
}

export const fetchCommentsHook = ({id, setComments} : FecthComments) => {

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("postId", "==", id),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(fetchedComments);
    });
};