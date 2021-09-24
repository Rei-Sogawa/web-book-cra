import { httpsCallable } from 'firebase/functions'

import { functions } from '@/firebaseApp'

export const signUpAdmin = ({ email, password }: { email: string; password: string }) => {
  return httpsCallable(functions, 'signUpAdmin')({ email, password })
}
