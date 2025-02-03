import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserType } from "@/redux/slices/userSlice";

export function useUser() : UserType | null {
  return useSelector((state: RootState) => state.currentUser).user;
}

