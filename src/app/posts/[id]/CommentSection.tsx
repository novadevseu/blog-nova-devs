"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import { useUser } from "@/hooks/useUser";

const CommentComponent: React.FC = () => {
  const router = useRouter();
  const currentUser = useUser(); // Gets the current user from your Redux state

  // Example static data for comments
  const data = [
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      userProfile: "https://www.linkedin.com/in/riya-negi-8879631a9/",
      text: "I think you have a point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
      timestamp: "2024-09-28T12:34:56Z",
      replies: [],
    },
  ];

  return (
    <CommentSection
      // If the user is logged in, pass their details; otherwise, pass null.
      currentUser={
        currentUser
          ? {
              currentUserId: currentUser.uid,
              currentUserImg: currentUser.img || "",
              currentUserProfile: currentUser.profile || "",
              currentUserFullName: currentUser.fullName || currentUser.email,
            }
          : null
      }
      // When not logged in, clicking the login link will redirect to the auth/login page.
      logIn={{
        onLogIn: () => router.push("/auth/login"),
      }}
      commentData={data}
      // Change the placeholder text conditionally
      placeHolder={currentUser ? "Write your comment..." : "Please log in"}
      onSubmitAction={(data) => {
        // If the user is not logged in, redirect to login instead of submitting
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        console.log("Comment submitted: ", data);
      }}
      currentData={(data: any) => {
        console.log("Current data", data);
      }}
    />
  );
};

export default CommentComponent;
