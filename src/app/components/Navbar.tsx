"use client";

import React from "react";
import Link from "next/link"; // Para navegar entre rutas en Next.js

const Navbar: React.FC = () => {
  return (
    <nav className="bg-indigo-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/">
            Mi App
          </Link>
        </div>

        {/* Links */}
        <div className="space-x-4">
          <Link href="/">
            Inicio
          </Link>
          <Link href="/profile">
            Perfil
          </Link>
          <Link href="/signup">
            Registrarse
          </Link>
          <Link href="/login">
          Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
