import { Box, Center, SimpleGrid, VStack } from '@chakra-ui/react'
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
    <Center>
      <VStack alignItems="start" spacing="8">
        <BookTab />

        <Box>
          <SimpleGrid columns={2} spacing="4">
            {books.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Center>
  )
}

const BooksPageWithLayout = UserPageLayout(BooksPage)

const Wrapper: VFC = () => {
  const { books } = useBooksPageQuery()

  return <>{every([books], Boolean) && <BooksPageWithLayout books={books} />}</>
}

export default Wrapper
