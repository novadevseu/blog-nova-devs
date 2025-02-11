"use client";

import React, { useEffect } from "react";
import Link from "next/link"; // For navigation between routes in Next.js
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/services/auth/firebaseAuthService";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

const Navbar: React.FC = () => {
  const currentUser = useUser();
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleLogOut = async () => {
    try {
      const result = await logoutUser(dispatch);
      if (result) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally, display an error message to the user.
    }
  };

  // Helper function to check if a link is active.
  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <nav className="py-4">
      <div className="mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl flex items-center space-x-2 hover:text-gray-500">
          <Link href="/">
            Coffee<span style={{ color: "#E0C600" }}>Script</span> & Chill
          </Link>
          <Link href="/">
            <Image src="/images/jsfile.png" alt="logo" width={60} height={60} />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link href="/">
            <span className={`cursor-pointer ${isActive("/") ? "underline" : ""}`}>Home</span>
          </Link>
          <Link href="/profile">
            <span className={`cursor-pointer ${isActive("/profile") ? "underline" : ""}`}>Profile</span>
          </Link>
          <Link href="/about">
            <span className={`cursor-pointer ${isActive("/about") ? "underline" : ""}`}>About</span>
          </Link>
          <Link href="/archive">
            <span className={`cursor-pointer ${isActive("/archive") ? "underline" : ""}`}>Archive</span>
          </Link>
          {!currentUser ? (
            <>
              <Link href="/auth/login">
                <span className={`cursor-pointer ${isActive("/auth/login") ? "underline" : ""}`}>Log In</span>
              </Link>
              <Link href="/auth/signup">
                <span className={`cursor-pointer ${isActive("/auth/signup") ? "underline" : ""}`}>Sign Up</span>
              </Link>
            </>
          ) : (
            <button onClick={handleLogOut}>Log Out</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
