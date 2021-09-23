import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { routeMap } from '@/routes'
import { AppLink } from '@/ui/Shared/AppLink'
import { UserRegisterForm } from '@/ui/Shared/UserRegisterForm'

import { useAdminSignUpPageMutation } from './container'

const AdminSignUpPage: VFC = () => {
  const { signUp } = useAdminSignUpPageMutation()

  return (
    <Center mt="4">
      <VStack width="480px" spacing="4">
        <HStack justifyContent="center" alignItems="baseline">
          <Text textAlign="center" fontSize="5xl" fontWeight="extrabold">
            Web Hook
          </Text>

          <Text fontWeight="bold">（管理者）</Text>
        </HStack>

        <Box w="full">
          <UserRegisterForm
            submitButtonText="サインアップ"
            onSubmit={async (v) => {
              await signUp(v)
            }}
          />
        </Box>

        <AppLink alignSelf="start" color="blue.500" to={routeMap['/admin/sign-in'].path()}>
          ログイン画面へ
        </AppLink>
      </VStack>
    </Center>
  )
}

export default AdminSignUpPage
