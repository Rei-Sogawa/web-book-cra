import { Box } from '@chakra-ui/layout'
import { User } from '@firebase/auth'
import { VFC } from 'react'

import { Book } from '@/model/book'
import { Order } from '@/model/order'

type OrderPageProps = {
  users: User[]
  orders: Order[]
  books: Book[]
}

const AdminOrdersPage: VFC<OrderPageProps> = ({ users, orders, books }) => {
  return <Box></Box>
}
