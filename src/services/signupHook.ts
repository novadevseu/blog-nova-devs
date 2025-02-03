import { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

export const useSignUp = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const signup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create the record in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "Viewer",
        createdAt: new Date(),
      })

      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = err.message || "Bilinmeyen bir hata oluştu"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { signup, error, loading, setError, setLoading }
}
