import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
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
import { every } from 'lodash-es'
import { useState, VFC } from 'react'

import { Book } from '@/model/book'
import { Order } from '@/model/order'
import { User } from '@/model/user'

import { BookItem } from './BookItem'
import { useAdminBooksPageMutation, useAdminBooksPageQuery } from './container'
import { Header } from './Header'

type BooksPageProps = {
  books: Book[]
  orders: Order[]
  users: User[]
}

const BooksPage: VFC<BooksPageProps> = ({ books, orders, users }) => {
  // container
  const { signOut, deleteBook, approveOrder, unapproveOrder } = useAdminBooksPageMutation()

  const [currentTab, setCurrentTab] = useState(0)

  return (
    <VStack alignItems="stretch" spacing="8">
      <Box alignSelf="stretch">
        <Header onSignOut={signOut} />
      </Box>

      <Box>
        <Container maxW="container.lg">
          <Tabs pb="8" onChange={setCurrentTab}>
            <TabList>
              <Tab fontWeight="bold">ブック</Tab>
              <Tab fontWeight="bold">注文</Tab>
            </TabList>
          </Tabs>

          {currentTab === 0 && books.length > 0 && (
            <Container maxW="container.md">
              <VStack spacing="4" alignItems="stretch">
                <Text fontWeight="bold" fontSize="2xl">
                  Books
                </Text>

                <VStack alignItems="stretch" spacing="4">
                  {books.map((book) => (
                    <VStack key={book.id} alignItems="stretch" spacing="4">
                      <BookItem book={book} onDeleteBook={deleteBook} />
                      <Divider />
                    </VStack>
                  ))}
                </VStack>
              </VStack>
            </Container>
          )}

          {currentTab === 1 && orders.length > 0 && (
            <Table>
              <Thead>
                <Tr>
                  <Th>ユーザー</Th>
                  <Th>本</Th>
                  <Th>値段</Th>
                  <Th>状態</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => {
                  const user = users.find(({ id }) => id === order.userId)

                  const orderedBooks = books.filter((book) =>
                    order.books.find(({ id }) => id === book.id)
                  )

                  return (
                    <Tr>
                      <Td>{user?.email || '削除されたユーザーです'}</Td>
                      <Td>
                        {orderedBooks.map((book) => (
                          <Text fontSize="sm">{book.title}</Text>
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
                            onClick={async () => {
                              await approveOrder(order)
                            }}
                          >
                            承認
                          </Button>
                        )}
                        {order.status === 'fulfilled' && (
                          <Button
                            size="sm"
                            variant="link"
                            onClick={async () => {
                              await unapproveOrder(order)
                            }}
                          >
                            戻す
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          )}
        </Container>
      </Box>
    </VStack>
  )
}

const Wrapper: VFC = () => {
  const { books, users, orders } = useAdminBooksPageQuery()

  return (
    <>{every([books], Boolean) && <BooksPage books={books!} users={users} orders={orders} />}</>
  )
}

export default Wrapper
