import { db } from "@/config/firebase-config";
import { UserType } from "@/redux/slices/userSlice";
import { doc, getDoc } from "firebase/firestore"; // Firestore SDK'sı

async function getUserDataByUid(uid: string) {
  try {
    const userDocRef = doc(db, "users", uid);

    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserType;
      return userData;
    } else {
      throw new Error("No user found with the provided UID.");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

export default getUserDataByUid;
