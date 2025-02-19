// components/Container.tsx
"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getUserSession } from "@/services/auth/sessions";
import { useDispatch } from "react-redux";
import { setUser, UserType } from "@/redux/slices/userSlice";
import getUserDataByUid from "@/hooks/getUserByUID";
import { usePathname } from "next/navigation";

interface ContainerProps {
  children: ReactNode;
}

/**
 * Layout principal que:
 * - Carga los datos del usuario al inicio.
 * - Muestra el Navbar, el contenido y el Footer.
 */
const Container: React.FC<ContainerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isReady,setIsReady] = useState(false);

  const handleFetchUserData = async () => {
    const uid = (await getUserSession()) as string;
    const userData = (await getUserDataByUid(uid)) as UserType;
    dispatch(setUser(userData));
  };

  useEffect(() => {
    (async () => {
      await handleFetchUserData();
    })();
    setIsReady(true);
  }, [pathname]);

  if (!isReady)
    return (<div>Loading...</div>)
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Container;
