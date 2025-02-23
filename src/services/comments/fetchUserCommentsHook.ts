import { db } from "@/config/firebase-config";
import { Comment } from "@/types/CommentType";
import { collection, getDocs, query, where, doc, getDoc } from "@firebase/firestore";

export interface FetchUserComments {
  userUid: string;
}

export const fetchUserComments = async ({
  userUid,
}: FetchUserComments): Promise<Comment[]> => {
  const commentsRef = collection(db, "comments");

  const q = query(commentsRef, where("userUid", "==", userUid));

  const querySnapshot = await getDocs(q);

  const commentsList = await Promise.all(
    querySnapshot.docs.map(async (docSnapshot) => {
      const commentData = docSnapshot.data() as Comment;
      const postId = commentData.postId;

      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      const postData = postSnapshot.exists() ? postSnapshot.data() : null;

      const commentWithId = { ...commentData, id: docSnapshot.id };

      if (postData) {
        return { ...commentWithId, post: postData };
      }

      return commentWithId;
    })
  );

  return commentsList;
};
