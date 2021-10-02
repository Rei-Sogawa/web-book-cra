import { SimpleGrid, Text, VStack } from '@chakra-ui/react'
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
    <VStack alignItems="start" spacing="4">
      <Text fontWeight="bold" fontSize="2xl">
        Books
      </Text>

      <SimpleGrid columns={3} spacing="4">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </SimpleGrid>
    </VStack>
  )
}

const WithLayout = UserPageLayout(BooksPage)

const Wrapper: VFC = () => {
  const { books } = useBooksPageQuery()

  return <>{every([books], Boolean) && <WithLayout books={books!} />}</>
}

export default Wrapper
