// components/Container.tsx
"use client";
import React, {ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ContainerProps {
  children: ReactNode;
}

/**
 * Layout principal que:
 * - Carga los datos del usuario al inicio.
 * - Muestra el Navbar, el contenido y el Footer.
 */
const Container: React.FC<ContainerProps> = ({ children }) => {






  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Container;
