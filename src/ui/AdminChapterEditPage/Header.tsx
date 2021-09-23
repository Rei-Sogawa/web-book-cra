import { Box, Button, Container, HStack, Icon, Link, Text } from '@chakra-ui/react'
import { VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link as ReactRouterLink } from 'react-router-dom'

import { Book } from '@/model/book'
import { routeMap } from '@/routes'

export type HeaderProps = {
  book: Book
  onSaveChapter: () => Promise<void>
  changed: boolean
}

export const Header: VFC<HeaderProps> = ({ book, onSaveChapter, changed }) => {
  return (
    <Box h="14" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack spacing="4" alignItems="center">
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
            >
              <Icon as={FaArrowLeft} h="4" w="4" color="gray.500" />
            </Link>
            <Text fontWeight="bold" fontSize="lg">
              {book.title}
            </Text>
          </HStack>

          <Button size="sm" colorScheme="blue" onClick={onSaveChapter} disabled={!changed}>
            保存する
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}
