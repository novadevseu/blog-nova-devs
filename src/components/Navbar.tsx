"use client";

import React, { MouseEventHandler, useState } from "react";
import Link from "next/link"; // For navigating between routes in Next.js
import { UserType } from "@/redux/slices/userSlice";
import { useUser } from "@/hooks/useUser";

const Navbar: React.FC = () => {

  const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());

  const handleLogOut = () => {
    localStorage.removeItem('uid');
    window.location.reload();
  }

  return (
    <nav className="bg-indigo-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/">
            My App
          </Link>
        </div>

        {/* Links */}
        <div className="space-x-4">
          <Link href="/">
            Home
          </Link>
          <Link href="/profile">
            Profile
          </Link>
          { 
            !currentUser ? (
              <>
                <Link href="/auth/login">
                  Log In
                </Link>
                <Link href="/auth/signup">
                  Sign Up
                </Link>
              </>
          )
          : 
            <>
              <button onClick={handleLogOut} >
                Log Out
              </button>
            </>
        }

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
