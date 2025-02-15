// components/Container.tsx
"use client";
import React, {ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getUserSession } from "@/services/auth/sessions";
import { useDispatch } from "react-redux";
import { setUser, UserType } from "@/redux/slices/userSlice";
import getUserDataByUid from "@/hooks/getUserByUID";

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

  const handleFetchUserData =  async () => {
    console.log('naber1');
    const { uid } = await getUserSession() as unknown as {uid : string};
    console.log('naber2');
    const userData = await getUserDataByUid(uid) as UserType;
    console.log('naber3');
    dispatch(setUser(userData));
  }

  useEffect(()=>{
    console.log('hello');
    ( async () => {
      await handleFetchUserData();
    } )();
  },[])

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Container;
