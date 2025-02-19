// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
// TODO Cambiar UserType de archivo
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
          // Ignore these paths where non-serializable data (like Date or Firestore Timestamp) might appear
          ignoredPaths: ['currentUser.user.createdAt'],
          ignoredActionPaths: ['payload.createdAt'],
        },
      }),
  });

  // Restaurar el estado del usuario desde las cookies
  const userCookie = getCookie("user");
  if (userCookie) {
    store.dispatch(setUser(JSON.parse(userCookie) as UserType));
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
