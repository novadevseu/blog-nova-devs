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
    <nav className="py-4 px-6 shadow-lg bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-[#E0C600]/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 group">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300">
            <span className="text-2xl font-bold">
              Coffee<span className="text-[#E0C600]">Script</span>
              <span className="text-gray-400">&</span>
              <span className="text-white">Chill</span>
            </span>
            <Image 
              src="/images/jsfile.png" 
              alt="logo" 
              width={40} 
              height={40} 
              className="group-hover:rotate-12 transition-all duration-300 group-hover:scale-110"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "/profile", label: "Profile" },
            { href: "/about", label: "About" },
            { href: "/archive", label: "Archive" },
          ].map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`
                relative px-2 py-1 text-base font-medium
                ${isActive(link.href) 
                  ? "text-[#E0C600]" 
                  : "text-gray-300 hover:text-white"
                }
                transition-all duration-300 ease-in-out
                hover:scale-105
              `}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#E0C600] rounded-full 
                  animate-pulse shadow-[0_0_5px_#E0C600]" />
              )}
            </Link>
          ))}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4 ml-6 border-l border-gray-700/50 pl-6">
            {!currentUser ? (
              <>
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white 
                    transition-all duration-300 hover:scale-105"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-[#E0C600] text-[#090d1f] rounded-lg
                    hover:bg-[#E0C600]/90 transition-all duration-300
                    shadow-[0_0_15px_rgba(224,198,0,0.3)] hover:shadow-[0_0_20px_rgba(224,198,0,0.4)]
                    font-semibold hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogOut}
                className="px-5 py-2.5 text-gray-300 hover:text-red-500
                  transition-all duration-300 border border-gray-700
                  rounded-lg hover:border-red-500 hover:scale-105
                  hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
