import { Avatar, Box, Button, Container, HStack, Text } from '@chakra-ui/react'
import { VFC } from 'react'
import { useHistory } from 'react-router-dom'

import { routeMap } from '@/routes'

export const Header: VFC = () => {
  const history = useHistory()

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
            <Avatar size="sm" />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
