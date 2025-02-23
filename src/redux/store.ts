// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer, { setUser, UserType } from "./slices/userSlice";
import { getCookie } from "@/utils/cookies";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      currentUser: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['currentUser.user.createdAt'],
          ignoredActionPaths: ['payload.createdAt'],
        },
      }),
  });

  // Restaurar el estado del usuario desde las cookies.
  // getCookie ya devuelve el valor parseado o null.
  const userCookie = getCookie("user");
  if (userCookie) {
    store.dispatch(setUser(userCookie as UserType));
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
