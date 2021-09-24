import { AuthService } from '@/service/auth'
import { signUpAdmin } from '@/service/functions'

export const useAdminSignUpPageMutation = () => {
  const signUp = async ({ email, password }: { email: string; password: string }) => {
    await signUpAdmin({ email, password })
    await AuthService.signIn({ email, password })
  }

  return { signUp }
}
