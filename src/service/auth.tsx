import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createContext, ReactNode, useContext, useState, VFC } from 'react'
import { useMount } from 'react-use'

import { auth } from '@/firebaseApp'
import { assertIsDefined } from '@/lib/assert'
import { fetchDoc } from '@/lib/firestore'
import { Admin, adminRef } from '@/model/admin'

const signIn = ({ email, password }: { email: string; password: string }) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const AuthService = {
  signIn,
  signOut: () => signOut(auth),
}

// AuthProvider
type AuthState = { uid?: string; currentAdmin?: Admin }

type AuthValue = AuthState & { fetchAdmin: () => Promise<void> }

const AuthContext = createContext<AuthValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: VFC<AuthProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false)
  const [state, setState] = useState<AuthState>({})

  useMount(() => {
    onAuthStateChanged(auth, async (user) => {
      const uid = user?.uid
      if (uid) {
        const admin = await fetchDoc(adminRef({ adminId: uid }))
        setState({ uid, currentAdmin: admin })
      } else {
        setState({})
      }

      if (!initialized) setInitialized(true)
    })
  })

  const fetchAdmin = async () => {
    if (!state.uid) return
    const admin = await fetchDoc(adminRef({ adminId: state.uid }))
    setState((prev) => ({ ...prev, admin }))
  }

  return (
    <AuthContext.Provider value={{ ...state, fetchAdmin }}>
      {initialized && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  assertIsDefined(value)
  return value
}
