import { db } from "@/config/firebase-config";
import { doc, getDoc, Timestamp } from "@firebase/firestore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  uid: string;
  email: string;
  role: string;
}

interface UserState {
  user: UserType | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserNull: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, setUserNull, updateUser } = userSlice.actions;
export default userSlice.reducer;
