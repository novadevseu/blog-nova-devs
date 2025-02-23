import CommentContainer from "@/app/posts/CommentContainer";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";
import { fetchPostHook } from "@/services/posts/fetchPostsHook";
import { Post } from "@/types/PostType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";

interface PostContainerInterface {
  id: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

function PostContainer({ id, setError }: PostContainerInterface) {
  const [post, setPost] = useState<Post | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // NOTA: Llamar a useUser() directamente en el top-level es correcto
  const currentUser = useUser(); 
  const [authorData, setAuthorData] = useState<{
    username: string;
    uid: string;
    jobDescription?: string;
    company?: string;
    education?: string;
    skills?: string;
    bio?: string;
    linkedIn?: string;
  } | null>(null);

  const router = useRouter();

  // Primer useEffect: cargar post y role del usuario
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

    fetchPostHook({ id, setError, setLoading, setPost });
    fetchUserRole();
  }, [id, currentUser, setError]);

  // Segundo useEffect: obtener datos del autor, siempre se llama (no condicional)
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (post?.authorUid) {
        try {
          const userDoc = await getDoc(doc(db, "users", post.authorUid));
          if (userDoc.exists()) {
            setAuthorData(userDoc.data() as {
              username: string;
              uid: string;
              jobDescription?: string;
              company?: string;
              education?: string;
              skills?: string;
              bio?: string;
              linkedIn?: string;
            });
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
        }
      }
    };

    fetchAuthorData();
  }, [post]);

  // Render condicional basado en loading, pero ya se han llamado todos los hooks
  if (loading)
    return (
      <div className="flex flex-col min-h-screen">
        <header></header>
        <div className="flex items-center justify-center flex-1">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="p-8 rounded-lg w-full max-w-4xl">
      {/* Author, Date, and Categories */}
      <div className="mb-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            <strong>Author:</strong> {authorData?.username || "Unknown"}
          </p>
          {authorData?.jobDescription && (
            <p className="text-sm text-gray-500">
              <strong>Job Description:</strong> {authorData.jobDescription}
            </p>
          )}
          {authorData?.company && (
            <p className="text-sm text-gray-500">
              <strong>Company:</strong> {authorData.company}
            </p>
          )}
          {authorData?.education && (
            <p className="text-sm text-gray-500">
              <strong>Education:</strong> {authorData.education}
            </p>
          )}
          {authorData?.skills && (
            <p className="text-sm text-gray-500">
              <strong>Skills:</strong> {authorData.skills}
            </p>
          )}
          {authorData?.bio && (
            <p className="text-sm text-gray-500">
              <strong>Bio:</strong> {authorData.bio}
            </p>
          )}
          {authorData?.linkedIn && (
            <p className="text-sm text-gray-500">
              <strong>LinkedIn:</strong> {authorData.linkedIn}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500">
          <strong>Published on:</strong>{" "}
          {new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Categories:</strong>{" "}
          {post!.categories?.length > 0 ? post!.categories.join(", ") : "None"}
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>

      {/* Edit button */}
      {userRole === "Admin" && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.push(`/update/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Post
          </button>
        </div>
      )}

      <div className="markdown-content mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post?.content || ""}
        </ReactMarkdown>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Published on:{" "}
        {new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}
      </p>

      {/* Comments section */}
      <CommentContainer id={id} />
    </div>
  );
}

export default PostContainer;
