"use client";

import React, { MouseEventHandler, useEffect, useState } from "react";
import Link from "next/link"; // For navigating between routes in Next.js
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { UserType } from "@/types/UserType";

const Navbar: React.FC = () => {

  const [currentUser,setCurrentUser] = useState<null | UserType>(useUser());

  useEffect(()=>{
    console.log(currentUser)
  },[currentUser])

  const handleLogOut = () => {
    localStorage.removeItem('uid');
    window.location.reload();
  }

  return (
    <nav className="  py-4">
      <div className=" mx-auto flex justify-between items-center ">
        {/* Logo */}
        <div className="text-xl flex items-center space-x-2 hover:text-gray-500">
          <Link href="/">
            Coffee<span style={{ color: "#E0C600" }}>Script</span> & Chill
          </Link>
          <Link href="/">
            <Image src="/images/jsfile.png" alt="logo" width={60} height={60} />{" "}
          </Link>
        </div>

        {/* Links */}
        <div className="space-x-4">
          <Link href="/">
            Home
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
              <Link href="/profile">
                Profile
              </Link>
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
