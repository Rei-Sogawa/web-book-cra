import {
  Avatar,
  Box,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { ComponentType, VFC } from 'react'
import { useHistory } from 'react-router'

import { routeMap } from '@/routes'

import { HeaderWrapper } from '../Shared/HeaderWrapper'

const Header: VFC = () => {
  // app
  const history = useHistory()

  // handler
  const handleClickHome = () => {
    history.push(routeMap['/books'].path())
  }

  return (
    <HeaderWrapper>
      <HStack h="full" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" cursor="pointer" onClick={handleClickHome}>
          Web Book
        </Text>

        <Box>
          <Menu placement="bottom-end" autoSelect={false}>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>サインアウト</MenuItem>
            </MenuList>
          </Menu>
        </Box>
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
