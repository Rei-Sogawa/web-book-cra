import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'

import { useDocs } from '@/lib/firestore'
import { bookRef, booksRef } from '@/model/book'
import { Order, orderRef, ordersRef } from '@/model/order'
import { usersRef } from '@/model/user'

export const useQuery = () => {
  const [_users] = useDocs(usersRef())
  const [_orders] = useDocs(ordersRef())
  const [_books] = useDocs(booksRef())

  const users = _users || []
  const orders = _orders || []
  const books = _books || []

  return { users, orders, books }
}

export const useMutation = () => {
  const approveOrder = async (order: Order) => {
    await updateDoc(orderRef({ orderId: order.id }), { status: 'fulfilled' })
    for (const book of order.books) {
      await updateDoc(bookRef({ bookId: book.id }), {
        ordererIds: arrayRemove(order.userId),
        purchaserIds: arrayUnion(order.userId),
      })
    }
  }

  return { approveOrder }
}
