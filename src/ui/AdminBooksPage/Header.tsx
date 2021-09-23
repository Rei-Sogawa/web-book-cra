import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { VFC } from 'react'
import { useHistory } from 'react-router-dom'

import { routeMap } from '@/routes'

export type HeaderProps = {
  onSignOut: () => Promise<void>
}

export const Header: VFC<HeaderProps> = ({ onSignOut }) => {
  // app
  const history = useHistory()

  // handler
  const handleClickAddBook = () => {
    history.push(routeMap['/admin/books/new'].path())
  }

  return (
    <Box h="14" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack justifyContent="space-between" h="100%">
          <Text fontWeight="bold" fontSize="2xl">
            Web Book
          </Text>

          <HStack spacing="6">
            <Button size="sm" colorScheme="blue" onClick={handleClickAddBook}>
              本を作る
            </Button>
            <Menu placement="bottom-end" autoSelect={false}>
              <MenuButton>
                <Avatar size="sm" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onSignOut}>サインアウト</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
