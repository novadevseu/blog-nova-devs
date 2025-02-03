import { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/userSlice';

interface handleSignUp {
  setLoading : React.Dispatch<React.SetStateAction<boolean>>,
  setError : React.Dispatch<React.SetStateAction<string | null>>,
  email : string,
  password : string,
  dispatch: ReturnType<typeof useDispatch>
}

export const useSignUp = async ({email,password,setError,setLoading,dispatch} : handleSignUp) => {

    setLoading(true)
    setError(null)

    try {
      console.log('naber1')
      const userCredential = await createUserWithEmailAndPassword(auth, email, password) // error here
      const user = userCredential.user

      console.log('naber1',user)

      // Create the record in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "Viewer",
        createdAt: new Date(),
      })

      console.log('naber2',user)

      dispatch(setUser({
        email : user.email!,
        role : "Viewer",
        uid : user.uid
      }));

      console.log(user)

      localStorage.setItem('uid',user.uid);

    } catch (err: any) {
      const errorMessage = err.message || "An unkown error"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  
}
