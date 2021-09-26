import { AuthService } from '@/service/auth'

export const useSignInPageMutation = () => {
  const signIn = AuthService.signIn

  return { signIn }
}
