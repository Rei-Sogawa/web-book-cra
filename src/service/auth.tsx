import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createContext, ReactNode, useContext, useEffect, useState, VFC } from 'react'
import { useMount } from 'react-use'

import { auth } from '@/firebaseApp'
import { assertIsDefined } from '@/lib/assert'
import { useDoc } from '@/lib/firestore'
import { Admin, adminRef } from '@/model/admin'
import { User, userRef } from '@/model/user'

const signIn = ({ email, password }: { email: string; password: string }) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const AuthService = {
  signIn,
  signOut: () => signOut(auth),
}

// AuthProvider
type AuthState = { uid?: string; admin?: Admin; user?: User }
type AuthValue = AuthState

const AuthContext = createContext<AuthValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: VFC<AuthProviderProps> = ({ children }) => {
  const [uidInitialized, setUidInitialized] = useState(false)
  const [state, setState] = useState<AuthState>({})

  useMount(() => {
    onAuthStateChanged(auth, (user) => {
      const uid = user?.uid
      setState((prev) => ({ ...prev, uid }))
      if (!uidInitialized) {
        setUidInitialized(true)
      }
    })
  })

  const [admin, adminInitialized] = useDoc(state.uid ? adminRef({ adminId: state.uid }) : null, [
    state.uid,
  ])
  const [user, userInitialized] = useDoc(state.uid ? userRef({ userId: state.uid }) : null, [
    state.uid,
  ])

  useEffect(() => {
    setState((prev) => ({ ...prev, admin }))
  }, [admin])
  useEffect(() => {
    setState((prev) => ({ ...prev, user }))
  }, [user])

  console.log('admin', admin, 'user', user)

  return (
    <AuthContext.Provider value={{ ...state }}>
      {uidInitialized && (state.uid ? adminInitialized && userInitialized && children : children)}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  assertIsDefined(value)
  return value
}
