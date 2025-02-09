// components/Container.tsx
"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { getUserData } from "@/services/auth/getUserHook";
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
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await getUserData(dispatch);
      setIsReady(true);
    })();
  }, [dispatch]);

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Container;
