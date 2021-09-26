import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { routeMap } from '@/routes'
import { AppLink } from '@/ui/Shared/AppLink'
import { UserRegisterForm } from '@/ui/Shared/UserRegisterForm'

import { useSignInPageMutation } from './container'

const SignInPage: VFC = () => {
  const { signIn } = useSignInPageMutation()

  return (
    <Center mt="4">
      <VStack width="480px" spacing="4">
        <Text textAlign="center" fontSize="5xl" fontWeight="extrabold">
          Web Book
        </Text>

        <Box w="full">
          <UserRegisterForm
            submitButtonText="ログイン"
            onSubmit={async (v) => {
              await signIn(v)
            }}
          />
        </Box>

        <AppLink alignSelf="start" color="blue.500" to={routeMap['/sign-up'].path()}>
          サインアップ画面へ
        </AppLink>
      </VStack>
    </Center>
  )
}

export default SignInPage
