// components/Container.tsx (Client Component)
"use client";

import { getUserData } from "@/services/getUserHook";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Container({ children }: { children: ReactNode }) {

    const [isReady,setIsReady] = useState(false);
    const dispatch = useDispatch();

    useEffect(()=>{

        ( async () => {
            await getUserData(dispatch);
        } )();

        setIsReady(true);
    },[])

    if(isReady)
  return (
    <div>
        {children}
    </div>
  );
  else return (
    <div>
        Loading...
    </div>
  )
}
