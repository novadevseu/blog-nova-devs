// components/StoreProvider.tsx
"use client";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Proveedor que inicializa el store de Redux una única vez.
 */
const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
