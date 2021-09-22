import { Box, Container, Text, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { VFC } from 'react'

import { Book } from '@/domain'

import { useAdminBooksPageMutation, useAdminBooksPageQuery } from './application'
import { BookItem } from './BookItem'
import { Header } from './Header'

type BooksPageProps = {
  books: Book[]
}

const BooksPage: VFC<BooksPageProps> = ({ books }) => {
  const { deleteBook } = useAdminBooksPageMutation()

  return (
    <VStack spacing="8">
      <Box alignSelf="stretch">
        <Header />
      </Box>

      <Container maxW="container.md" pb="8">
        <VStack spacing="4" alignItems="stretch">
          <Text fontWeight="bold" fontSize="2xl">
            Books
          </Text>

          <VStack alignItems="stretch" spacing="4">
            {books.map((book) => (
              <VStack alignItems="stretch" spacing="4">
                <BookItem key={book.id} book={book} onDeleteBook={deleteBook} />
                <Box borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm" />
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </VStack>
  )
}

const Wrapper: VFC = () => {
  const { books } = useAdminBooksPageQuery()

  return <>{every([books], Boolean) && <BooksPage books={books!} />}</>
}

export default Wrapper
