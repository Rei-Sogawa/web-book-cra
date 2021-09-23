import { AuthService } from '@/service/auth'

export const useAdminSignInPageMutation = () => {
  const signIn = AuthService.signIn

  return { signIn }
}
