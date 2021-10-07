import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { useState, VFC } from 'react'
import { useHistory } from 'react-router'

import { Book } from '@/model/book'
import { Order } from '@/model/order'
import { routeMap } from '@/routes'

import { UserPageLayout } from '../Layout/UserPageLayout'
import { AppLink } from '../Shared/AppLink'
import { BookImage } from '../Shared/BookImage'
import { useQuery } from './container'
import { useMutation } from './container'

type BookItemProps = {
  book: Book
}

const BookItem: VFC<BookItemProps> = ({ book }) => {
  const history = useHistory()

  return (
    <Box>
      <HStack justifyContent="space-between">
        <HStack alignItems="stretch" spacing="4">
          <BookImage
            imageUrl={book.image?.url}
            size="sm"
            flexShrink={0}
            cursor="pointer"
            onClick={() => {
              history.push(routeMap['/books/:bookId/viewer'].path({ bookId: book.id }))
            }}
          />

          <VStack alignItems="stretch" spacing="1">
            <AppLink
              to={routeMap['/books/:bookId/viewer'].path({ bookId: book.id })}
              fontWeight="bold"
            >
              {book.title}
            </AppLink>

            <Box>
              <HStack fontSize="xs" color="gray.500">
                <Text>著者</Text>
                <Text fontWeight="bold">{book.authorNames.join(', ')}</Text>
              </HStack>
            </Box>
          </VStack>
        </HStack>
      </HStack>
    </Box>
  )
}

type MyPageProps = {
  books: Book[]
  orders: Order[]
}

const MyPage: VFC<MyPageProps> = ({ books, orders }) => {
  const { cancelOrder } = useMutation()

  const [currentTab, setCurrentTab] = useState(0)

  return (
    <Box>
      <Tabs pb="8" onChange={setCurrentTab}>
        <TabList>
          <Tab fontWeight="bold">マイブック</Tab>
          <Tab fontWeight="bold">注文履歴</Tab>
        </TabList>
      </Tabs>

      {currentTab === 0 &&
        orders.filter((order) => order.status === 'fulfilled').flatMap((order) => order.books)
          .length > 0 && (
          <Container py="4">
            <VStack alignItems="stretch" spacing="4">
              {orders
                .filter((order) => order.status === 'fulfilled')
                .flatMap((order) => order.books)
                .map((book) => {
                  const orderedBook = books.find(({ id }) => id === book.id)

                  return orderedBook ? (
                    <VStack key={book.id} alignItems="stretch" spacing="4">
                      <BookItem book={orderedBook} />
                      <Divider />
                    </VStack>
                  ) : null
                })}
            </VStack>
          </Container>
        )}

      {currentTab === 1 && orders.length > 0 && (
        <Box py="4">
          <Table>
            <Thead>
              <Tr>
                <Th>本</Th>
                <Th>値段</Th>
                <Th>状態</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => {
                const orderedBooks = order.books.map(({ id }) =>
                  books.find((book) => book.id === id)
                )

                return (
                  <Tr key={order.id}>
                    <Td>
                      {orderedBooks.map((book, index) => (
                        <Text key={index} fontSize="sm">
                          {book?.title || ''}
                        </Text>
                      ))}
                    </Td>
                    <Td>{order.books.reduce((prev, curr) => prev + curr.price, 0)} 円</Td>
                    <Td>
                      {order.status === 'pending' && <Badge fontSize="sm">手続き中</Badge>}
                      {order.status === 'fulfilled' && (
                        <Badge colorScheme="blue" fontSize="sm">
                          購入済み
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => {
                            cancelOrder(order)
                          }}
                        >
                          キャンセル
                        </Button>
                      )}
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

const WithLayout = UserPageLayout(MyPage)

const Wrapper: VFC = () => {
  const { books, orders } = useQuery()

  return <WithLayout orders={orders} books={books} />
}

export default Wrapper
