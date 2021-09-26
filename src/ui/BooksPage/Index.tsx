import { SimpleGrid, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { VFC } from 'react'

import { Book } from '@/model/book'
import { UserPageLayout } from '@/ui/Layout/UserPageLayout'
import { BookTab } from '@/ui/Shared/BookTab'

import { BookItem } from './BookItem'
import { useBooksPageQuery } from './container'

type BooksPageProps = {
  books: Book[]
}

const BooksPage: VFC<BooksPageProps> = ({ books }) => {
  return (
    <VStack alignItems="start" spacing="8">
      <BookTab />

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
