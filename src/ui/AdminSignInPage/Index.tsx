import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { routeMap } from '@/routes'
import { AppLink } from '@/ui/Shared/AppLink'
import { UserRegisterForm } from '@/ui/Shared/UserRegisterForm'

import { useAdminSignInPageMutation } from './container'

const AdminSignInPage: VFC = () => {
  const { signIn } = useAdminSignInPageMutation()

  return (
    <Center mt="4">
      <VStack width="480px" spacing="4">
        <HStack justifyContent="center" alignItems="baseline">
          <Text textAlign="center" fontSize="5xl" fontWeight="extrabold">
            Web Book
          </Text>

          <Text fontWeight="bold">（管理者）</Text>
        </HStack>

        <Box w="full">
          <UserRegisterForm
            submitButtonText="ログイン"
            onSubmit={async (v) => {
              await signIn(v)
            }}
          />
        </Box>

        <AppLink alignSelf="start" color="blue.500" to={routeMap['/admin/sign-up'].path()}>
          サインアップ画面へ
        </AppLink>
      </VStack>
    </Center>
  )
}

export default AdminSignInPage
