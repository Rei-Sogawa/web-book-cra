import { AuthService } from '@/service/auth'
import { signUpUser } from '@/service/functions'

export const useSignUpPageMutation = () => {
  const signUp = async ({ email, password }: { email: string; password: string }) => {
    await signUpUser({ email, password })
    await AuthService.signIn({ email, password })
  }

  return { signUp }
}
