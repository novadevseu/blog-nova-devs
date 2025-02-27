
import CommentContainer from "@/app/posts/CommentContainer";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/redux/slices/userSlice";
import { fetchPostHook } from "@/services/posts/fetchPostsHook";
import { Post } from "@/types/PostType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostContainerInterface {
    id : string,
    setError : React.Dispatch<React.SetStateAction<string>>
}

function PostContainer ({id,setError} : PostContainerInterface) {

    const [post, setPost] = useState<Post | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading,setLoading] = useState(true);
    const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());

    const router = useRouter();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (currentUser) {
              try {
                  setUserRole(currentUser.role);
                  setUserEmail(currentUser.email);
                }
               catch (err) {
                console.error("Error loading user role:", err);
              }
            }
        };
    
        fetchPostHook({id,setError,setLoading,setPost});
        fetchUserRole();
    }, [id]);

    if (loading) 
      return (
        <div className="flex flex-col min-h-screen bg-[#090d1f]">
          <div className="flex items-center justify-center flex-1">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#E0C600] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#E0C600]">Cargando contenido...</p>
            </div>
          </div>
        </div>
      );

  return (
      <article className="p-8 rounded-lg w-full max-w-4xl mx-auto bg-[#090d1f]/50 backdrop-blur-sm 
        shadow-lg border border-[#E0C600]/10 transition-all duration-300">
        {/* Header Info */}
        <div className="mb-8 p-6 bg-[#0c1023] rounded-xl border border-gray-800/50">
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
              <span className="font-medium">Autor:</span>
              <span>{post?.author || "Anónimo"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
              <span className="font-medium">Publicado:</span>
              <span>{new Date((post?.timestamp?.seconds ?? 0) * 1000).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E0C600] rounded-full"></span>
              <span className="font-medium">Categorías:</span>
              <span>{post!.categories?.length > 0 ? post!.categories.join(", ") : "Sin categoría"}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-white relative">
          <span className="relative">
            {post?.title}
            <span className="absolute -bottom-2 left-0 w-1/4 h-1 bg-[#E0C600] rounded-full"></span>
          </span>
        </h1>

        {/* Admin Actions */}
        {userRole === "Admin" && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => router.push(`/update/${id}`)}
              className="px-6 py-3 bg-[#E0C600] text-[#090d1f] rounded-lg
                font-semibold transition-all duration-300
                hover:bg-[#E0C600]/90 hover:scale-105
                shadow-[0_0_15px_rgba(224,198,0,0.3)]
                hover:shadow-[0_0_20px_rgba(224,198,0,0.4)]
                flex items-center gap-2"
            >
              <span>✏️</span>
              Editar Post
            </button>
          </div>
        )}

        {/* Content */}
        <div className="markdown-content mb-8 prose prose-invert prose-yellow 
          max-w-none prose-pre:bg-[#0c1023] prose-pre:border prose-pre:border-gray-800/50
          prose-headings:text-white prose-headings:font-bold
          prose-a:text-[#E0C600] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#E0C600] prose-code:text-[#E0C600]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post?.content || ""}
          </ReactMarkdown>
        </div>

        {/* Comments Section */}
        <div className="mt-4 pt-8 border-t border-gray-800/50">
          <CommentContainer id={id} />
        </div>
      </article>
  );
}

export default PostContainer;
