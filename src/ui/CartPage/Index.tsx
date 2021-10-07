import { Box, Button, Container, Divider, HStack, Text, VStack } from '@chakra-ui/react'
import { format } from 'date-fns'
import { VFC } from 'react'

import { Book } from '@/model/book'
import { User } from '@/model/user'

import { UserPageLayout } from '../Layout/UserPageLayout'
import { BookImage } from '../Shared/BookImage'
import { useMutation, useQuery } from './container'

type BookItemProps = {
  book: Book
  onRemove: () => void
}

const BookItem: VFC<BookItemProps> = ({ book, onRemove }) => {
  return (
    <Box>
      <HStack justifyContent="space-between">
        <HStack alignItems="stretch" spacing="4">
          <BookImage imageUrl={book.image?.url} size="sm" flexShrink={0} />

          <VStack alignItems="stretch" spacing="1">
            <Text fontWeight="bold">{book.title}</Text>

            <Box>
              <HStack fontSize="xs" color="gray.500">
                <Text>著者</Text>
                <Text fontWeight="bold">{book.authorNames.join(', ')}</Text>
              </HStack>

              <HStack fontSize="xs" color="gray.500">
                <Text>発売日</Text>
                <Text fontWeight="bold">
                  {book.releasedAt ? format(book.releasedAt.toDate(), 'yyyy-MM-dd') : ''}
                </Text>
              </HStack>

              <HStack fontSize="xs" color="gray.500">
                <Text>価格</Text>
                <Text fontWeight="bold">{book.price} 円</Text>
              </HStack>
            </Box>
          </VStack>
        </HStack>

        <HStack alignSelf="start">
          <Button size="sm" variant="link" onClick={onRemove}>
            削除
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

type CartPageProps = {
  user: User
  books: Book[]
}

const CartPage: VFC<CartPageProps> = ({ user, books }) => {
  const { createOrder, removeBookFromCart } = useMutation(user, books)

  return user.cart.length ? (
    <Container>
      <VStack alignItems="stretch">
        {books.map((book) => (
          <VStack key={book.id} alignItems="stretch">
            <BookItem
              book={book}
              onRemove={async () => {
                await removeBookFromCart(book)
              }}
            />
            <Divider />
          </VStack>
        ))}

        <VStack alignSelf="end" alignItems="end">
          <Text fontWeight="bold">
            合計: {books.reduce((prev, curr) => prev + curr.price, 0)} 円
          </Text>
          <Button size="sm" colorScheme="blue" onClick={createOrder}>
            注文する
          </Button>
        </VStack>
      </VStack>
    </Container>
  ) : (
    <Text fontSize="2xl" fontWeight="bold">
      カートに商品はありません。
    </Text>
  )
}

const WithLayout = UserPageLayout(CartPage)

const Wrapper: VFC = () => {
  const { user, books } = useQuery()
  return <WithLayout user={user} books={books} />
}

export default Wrapper
