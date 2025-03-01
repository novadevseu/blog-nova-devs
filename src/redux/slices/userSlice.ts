// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, removeCookie } from "@/utils/cookies"
/**
 * Define la estructura de los datos del usuario.
 */
// TODO Cambiar UserType de archivo
export interface UserType {
  uid: string;
  email: string;
  role: string;
  username: string;
  img: string;
  fullName: string;
  profile: string;
  jobDescription?: string;
  company?: string;
  education?: string;
  skills?: string;
  bio?: string;
  linkedIn?: string;
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
      setCookie("user", JSON.stringify(action.payload), { expires: 7 });
    },
    // Limpia el estado del usuario (logout)
    setUserNull: (state) => {
      state.user = null;
      removeCookie("user");
    },
    // Actualiza parcialmente los datos del usuario
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setCookie("user", JSON.stringify(state.user), { expires: 7 });
      }
    },
  },
});
console.log(userSlice);
export const { setUser, setUserNull, updateUser } = userSlice.actions;
export default userSlice.reducer;