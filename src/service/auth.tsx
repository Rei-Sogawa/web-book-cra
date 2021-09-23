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
import { Admin, AdminService } from '@/model/admin'

// signUp は functions.https 化した方が処理をまとめることができて扱いやすそう。
// functions.auth.user().onCreate だと auth/user でどう判断するか実装が複雑になりそう。
// adminSignUp と userSignUp ができるイメージ。
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
type AuthState = { uid?: string; admin?: Admin }

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
        const admin = await AdminService.getDoc(uid)
        setState({ uid, admin })
      } else {
        setState({})
      }

      if (!initialized) setInitialized(true)
    })
  })

  const fetchAdmin = async () => {
    if (!state.uid) return
    const admin = await AdminService.getDoc(state.uid)
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
