"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { UserType } from "@/redux/slices/userSlice";
import { useUser } from "@/hooks/useUser";
import PostContainer from "@/components/PostContainer";

const PostPage = () => {
  const params = useParams();
  const id  = Array.isArray(params.id) ? params.id[0] : params.id as string; // Ensure id is a string
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());

  if (error) 
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-1  p-6">
        <PostContainer {...{id,setError}} />
      </div>
    </div>
  );
};

export default PostPage;
