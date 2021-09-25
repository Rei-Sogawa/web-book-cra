import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { useHistory } from 'react-router'

import { Book } from '@/model/book'
import { routeMap } from '@/routes'
import { AppLink } from '@/ui/Shared/AppLink'
import { BookImage } from '@/ui/Shared/BookImage'

export type BookItemProps = {
  book: Book
}

export const BookItem: VFC<BookItemProps> = ({ book }) => {
  // app
  const history = useHistory()

  // handler
  const handleClickBook = () => {
    history.push(routeMap['/books/:bookId'].path({ bookId: book.id }))
  }

  return (
    <Box width="90" p="6" bg="gray.50" borderWidth="1px" borderRadius="md">
      <HStack spacing="4">
        <BookImage
          imageUrl={book.image?.url}
          size="sm"
          flexShrink={0}
          cursor="pointer"
          onClick={handleClickBook}
        />

        <VStack alignSelf="start" alignItems="start">
          <Box alignSelf="start">
            <AppLink
              to={routeMap['/books/:bookId'].path({ bookId: book.id })}
              fontWeight="bold"
              noOfLines={3}
            >
              {book.title}
            </AppLink>

            <Text fontSize="sm" color="gray.500" fontWeight="bold">
              {book.authorNames.join(', ')}
            </Text>
          </Box>

          <Text fontSize="sm" color="blue.500" fontWeight="bold">
            {book.price} 円
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
