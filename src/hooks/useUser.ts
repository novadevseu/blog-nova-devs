// hooks/useUser.ts
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserType } from "@/redux/slices/userSlice";

/**
 * Custom hook para obtener el usuario actual del estado global (Redux).
 */
export const useUser = (): UserType | null => {
  return useSelector((state: RootState) => state.currentUser.user);
};
