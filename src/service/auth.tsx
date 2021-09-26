import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createContext, ReactNode, useContext, useEffect, useState, VFC } from 'react'
import { useMount } from 'react-use'

import { auth } from '@/firebaseApp'
import { assertIsDefined } from '@/lib/assert'
import { useDoc } from '@/lib/firestore'
import { Admin, adminRef } from '@/model/admin'
import { UserPrivate, userPrivateRef } from '@/model/userPrivate'

const signIn = ({ email, password }: { email: string; password: string }) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const AuthService = {
  signIn,
  signOut: () => signOut(auth),
}

// AuthProvider
type AuthState = { uid?: string; admin?: Admin; userPrivate?: UserPrivate }
type AuthValue = AuthState

const AuthContext = createContext<AuthValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: VFC<AuthProviderProps> = ({ children }) => {
  const [uidInitialized, setUidInitialized] = useState(false)
  const [state, setState] = useState<AuthState>({})

  useMount(() => {
    onAuthStateChanged(auth, (userPrivate) => {
      const uid = userPrivate?.uid
      setState((prev) => ({ ...prev, uid }))
      if (!uidInitialized) {
        setUidInitialized(true)
      }
    })
  })

  const [admin, adminInitialized] = useDoc(state.uid ? adminRef({ adminId: state.uid }) : null, [
    state.uid,
  ])
  const [userPrivate, userPrivateInitialized] = useDoc(
    state.uid ? userPrivateRef({ userId: state.uid }) : null,
    [state.uid]
  )

  useEffect(() => {
    setState((prev) => ({ ...prev, admin }))
  }, [admin])
  useEffect(() => {
    setState((prev) => ({ ...prev, userPrivate }))
  }, [userPrivate])

  return (
    <AuthContext.Provider value={{ ...state }}>
      {uidInitialized &&
        (state.uid ? adminInitialized && userPrivateInitialized && children : children)}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  assertIsDefined(value)
  return value
}
