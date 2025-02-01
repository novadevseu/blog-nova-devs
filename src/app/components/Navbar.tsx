"use client";

import React from "react";
import Link from "next/link"; // For navigating between routes in Next.js

const Navbar: React.FC = () => {
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
          <Link href="/signup">
            Sign Up
          </Link>
          <Link href="/login">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
