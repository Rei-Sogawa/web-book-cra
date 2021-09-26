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

        <AppLink alignSelf="start" color="blue.500" to={routeMap['/sign-in'].path()}>
          ログイン画面へ
        </AppLink>
      </VStack>
    </Center>
  )
}

export default SignUpPage
