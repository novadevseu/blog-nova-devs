// services/auth/firebaseAuthService.ts
import { auth, db } from "../../config/firebase-config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { UserType } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store"; // import your AppDispatch type
import { setUserNull } from "@/redux/slices/userSlice";

/**
 * Logs in a user with email and password using Firebase Authentication.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The authenticated user.
 */
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logs in a user with Google using a popup.
 * @returns The authenticated user.
 */
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

/**
 * Registers a new user with email and password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The created user.
 */
export const signUpWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Retrieves (or creates if it does not exist) the user document in Firestore.
 * @param user An object containing the user's uid and email.
 * @returns The user's data from Firestore.
 */
export const getOrCreateUserDocument = async (user: { uid: string; email: string | null }): Promise<UserType> => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // If the document does not exist, create it with default role "Viewer".
    const newUser: UserType = {
      uid: user.uid,
      email: user.email || "",
      role: "Viewer",
      fullName : "",
      img : "",
      profile : "",
      username : ""
    };
    await setDoc(userDocRef, {
      ...newUser,
      createdAt: new Date(),
    });
    return newUser;
  } else {
    return userDoc.data() as UserType;
  }
};

export const getUserDocumentByEmail = async (email: string): Promise<UserType | null> => {
  if (!email) return null;

  try {
    const usersQuery = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0]; 
    const userData = userDoc.data()

    return {
      email : userData.email,
      username : userData.username,
      fullName : userData.fullName,
      img : userData.img,
      profile : userData.profile,
      role : userData.role,
      uid : userData.uid
    } as UserType;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

/**
 * Logs out the current user and updates Redux by dispatching setUserNull.
 * @param dispatch Redux dispatch function.
 * @returns A promise that resolves to true once the sign-out is completed.
 */
export const logoutUser = async (dispatch: AppDispatch): Promise<boolean> => {
  await signOut(auth);
  dispatch(setUserNull());
  // Optionally wait a moment if you need to ensure the state has updated
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};
