"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c122a] text-white">
   
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-6">About Nova Deps Blog</h1>
        <section className="mb-8">
          <p className="text-lg">
            Nova Deps Blog is an open-source project dedicated to sharing the latest
            news and insights on technology, programming, and global events. In addition,
            it serves as a portfolio showcasing various features and best practices using modern
            web technologies.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-6">
            {/* Next.js Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/next-js.svg"
                alt="Next.js"
                className="w-16 h-16"
              />
              <span className="mt-2">Next.js</span>
            </div>
            {/* JavaScript Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/javascript-1.svg"
                alt="JavaScript"
                className="w-16 h-16"
              />
              <span className="mt-2">JavaScript</span>
            </div>
            {/* Tailwind CSS Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg"
                alt="Tailwind CSS"
                className="w-16 h-16"
              />
              <span className="mt-2">Tailwind CSS</span>
            </div>
            {/* Firebase Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/firebase-1.svg"
                alt="Firebase"
                className="w-16 h-16"
              />
              <span className="mt-2">Firebase</span>
            </div>
            {/* React Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.worldvectorlogo.com/logos/react-2.svg"
                alt="React"
                className="w-16 h-16"
              />
              <span className="mt-2">React</span>
            </div>
          </div>
        </section>
        <section>
          <Link href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
              View on GitHub
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
