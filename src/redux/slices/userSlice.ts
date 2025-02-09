// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Define la estructura de los datos del usuario.
 */
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

/**
 * Slice de Redux para gestionar el estado del usuario.
 */
const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    // Establece los datos del usuario
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    // Limpia el estado del usuario (logout)
    setUserNull: (state) => {
      state.user = null;
    },
    // Actualiza parcialmente los datos del usuario
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, setUserNull, updateUser } = userSlice.actions;
export default userSlice.reducer;
