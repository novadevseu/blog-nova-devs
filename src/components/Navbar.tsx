"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/services/auth/firebaseAuthService";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

const Navbar: React.FC = () => {
  const currentUser = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const result = await logoutUser(dispatch);
      if (result) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const menuItems = (
    <>
      <Link href="/">
        <img src="home.svg" alt="home" className="w-6 hover:opacity-70 transition-opacity duration-300" />
      </Link>
      <Link href="/about">
        <img src="info.svg" alt="about" className="w-6 hover:opacity-70 transition-opacity duration-300" />
      </Link>
      {!currentUser ? (
        <>
          <Link href="/auth/login">
            <span className="cursor-pointer text-gray-800 hover:text-gray-500 transition-colors duration-300">Log In</span>
          </Link>
          <Link href="/auth/signup">
            <span className="cursor-pointer text-gray-800 hover:text-gray-500 transition-colors duration-300">Sign Up</span>
          </Link>
        </>
      ) : (
        <button onClick={handleLogOut} className="cursor-pointer flex items-center">
          <img src="logout.svg" alt="Log Out" className="w-4 hover:opacity-70 transition-opacity duration-300" />
        </button>
      )}
      <Link href="/profile">
        <span className="cursor-pointer flex items-center">
          <img src={currentUser?.img} alt="profile" className="w-8 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-300" />
        </span>
      </Link>
    </>
  );

  return (
    <nav className="py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-xl flex items-center space-x-2 hover:text-gray-500 transition-colors duration-300">
          <Link href="/" className="flex items-center space-x-2">
            <span>
              Coffee<span className="text-yellow-500">Script</span> & Chill
            </span>
            <Image src="/images/jsfile.png" alt="logo" width={50} height={50} className="hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">{menuItems}</div>
      </div>

      {/* Menu in mobile */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"} md:hidden`}>
        <div className="flex flex-row items-center justify-center py-4 gap-6">{menuItems}</div>
      </div>
    </nav>
  );
};

export default Navbar;
