import { AuthService } from '@/service/auth'

export const useAdminSignUpPageMutation = () => {
  const signUp = AuthService.signUp

  return { signUp }
}
