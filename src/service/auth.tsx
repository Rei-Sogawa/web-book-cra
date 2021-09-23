import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { createContext, ReactNode, useContext, useState, VFC } from 'react'
import { useMount } from 'react-use'

import { auth } from '@/firebaseApp'
import { assertIsDefined } from '@/lib/assert'

const signUp = ({ email, password }: { email: string; password: string }) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

const signIn = ({ email, password }: { email: string; password: string }) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const AuthService = {
  signUp,
  signIn,
  signOut: () => signOut(auth),
}

// AuthProvider
type AuthValue = { uid?: string }

const AuthContext = createContext<AuthValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: VFC<AuthProviderProps> = ({ children }) => {
  // const [initialized, setInitialized] = useState(false)
  const [value, setValue] = useState<AuthValue>({ uid: undefined })

  useMount(() => {
    onAuthStateChanged(auth, (user) => {
      setValue({ uid: user?.uid })
    })
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  assertIsDefined(value)
  return value
}
