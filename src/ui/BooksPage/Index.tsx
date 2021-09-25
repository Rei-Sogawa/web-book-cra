import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { VFC } from 'react'

import { Book } from '@/model/book'
import { UserPageLayout } from '@/ui/Layout/UserPageLayout'

import { BookItem } from './BookItem'
import { useBooksPageQuery } from './container'

type BooksPageProps = {
  books: Book[]
}

const BooksPage: VFC<BooksPageProps> = ({ books }) => {
  return (
    <VStack alignItems="start" px="24">
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          Books
        </Text>
      </Box>

      <Box>
        <SimpleGrid columns={2} spacing="4">
          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  )
}

const BooksPageWithLayout = UserPageLayout(BooksPage)

const Wrapper: VFC = () => {
  const { books } = useBooksPageQuery()

  return <>{every([books], Boolean) && <BooksPageWithLayout books={books} />}</>
}

export default Wrapper
