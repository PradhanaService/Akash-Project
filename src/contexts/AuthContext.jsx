import { useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function signup({ name, email, password }) {
    if (!isFirebaseConfigured) {
      throw new Error('Add your Firebase config to .env before signing up.')
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (name) {
      await updateProfile(credential.user, { displayName: name })
    }

    await setDoc(doc(db, 'users', credential.user.uid), {
      name: name || '',
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    setCurrentUser({ ...credential.user, displayName: name || credential.user.displayName })
    return credential.user
  }

  function login(email, password) {
    if (!isFirebaseConfigured) {
      throw new Error('Add your Firebase config to .env before logging in.')
    }

    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    if (!isFirebaseConfigured) {
      return Promise.resolve()
    }

    return signOut(auth)
  }

  const value = useMemo(
    () => ({ currentUser, loading, signup, login, logout, isFirebaseConfigured }),
    [currentUser, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
