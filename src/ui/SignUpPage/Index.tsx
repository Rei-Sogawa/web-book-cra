import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { routeMap } from '@/routes'

import { AppLink } from '../Shared/AppLink'
import { UserRegisterForm } from '../Shared/UserRegisterForm'
import { useSignUpPageMutation } from './container'

const SignUpPage: VFC = () => {
  const { signUp } = useSignUpPageMutation()

  return (
    <Center mt="4">
      <VStack width="480px" spacing="4">
        <Text textAlign="center" fontSize="5xl" fontWeight="extrabold">
          Web Book
        </Text>

        <Box w="full">
          <UserRegisterForm
            submitButtonText="サインアップ"
            onSubmit={async (v) => {
              await signUp(v)
            }}
          />
        </Box>

        <VStack alignSelf="stretch" alignItems="start" spacing="0">
          <AppLink alignSelf="start" color="blue.500" to={routeMap['/sign-in'].path()}>
            ログイン画面へ
          </AppLink>
          <AppLink alignSelf="start" color="blue.500" to={routeMap['/books'].path()}>
            ホームへ
          </AppLink>
        </VStack>
      </VStack>
    </Center>
  )
}

export default SignUpPage
