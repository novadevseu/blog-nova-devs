import { db } from "@/config/firebase-config";
import { UserType } from "@/redux/slices/userSlice";
import { doc, getDoc } from "firebase/firestore"; // Firestore SDK'sı

async function getUserDataByUid(uid: string) {
  console.log("1111");

  try {

    console.log("2222");

    const userDocRef = doc(db, "users", uid);

    console.log("3333");
    const userDoc = await getDoc(userDocRef);

    console.log("12222");

    if (userDoc.exists()) {
        console.log("1111");
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
