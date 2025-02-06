import { db } from "@/config/firebase-config";
import { Post } from "@/types/PostType";
import { doc, getDoc } from "@firebase/firestore";
import { Unsubscribe } from "firebase/auth";

interface FetchPostHook {
    id : string,
    setError : React.Dispatch<React.SetStateAction<string>>,
    setLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setPost : React.Dispatch<React.SetStateAction<Post | null>>,
}

export const fetchPostHook = async ({id,setError,setLoading,setPost} : FetchPostHook) => {

    if (!id) {
        setError("No valid ID provided.");
        setLoading(false);
        return null;
    }

    try {
      const postRef = doc(db, "posts", id);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        setPost(postDoc.data() as Post);
      } else {
        setError("The post does not exist.");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("There was an error loading the post.");
    } finally {
      setLoading(false);
    }
  };