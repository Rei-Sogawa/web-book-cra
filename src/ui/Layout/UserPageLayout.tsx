import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { ComponentType, VFC } from 'react'
import { BiCart } from 'react-icons/bi'
import { useHistory } from 'react-router'

import { routeMap } from '@/routes'
import { AuthService, useAuth } from '@/service/auth'
import { AppLink } from '@/ui/Shared/AppLink'
import { HeaderWrapper } from '@/ui/Shared/HeaderWrapper'

const Header: VFC = () => {
  // app
  const history = useHistory()
  const { user } = useAuth()

  return (
    <HeaderWrapper>
      <HStack h="full" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => {
            history.push(routeMap['/books'].path())
          }}
        >
          Web Book
        </Text>

        {user ? (
          <HStack spacing="4">
            <Button size="sm">
              <Icon as={BiCart} h="6" w="6" />
              <Text ml="1" fontSize="md" fontWeight="bold">
                {user.cart.length}
              </Text>
            </Button>

            <Box>
              <Menu placement="bottom-end" autoSelect={false}>
                <MenuButton>
                  <Avatar size="sm" />
                </MenuButton>
                <MenuList>
                  <MenuItem>マイページ</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => AuthService.signOut()}>サインアウト</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        ) : (
          <HStack>
            <AppLink color="gray.500" fontWeight="bold" to={routeMap['/sign-in'].path()}>
              サインイン
            </AppLink>
          </HStack>
        )}
      </HStack>
    </HeaderWrapper>
  )
}

export const UserPageLayout =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return (
      <Box minH="100vh">
        <Header />
        <Container maxW="container.lg" py="8">
          <Component {...props} />
        </Container>
      </Box>
    )
  }
