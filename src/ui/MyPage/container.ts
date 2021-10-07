import { arrayRemove, deleteDoc, query, updateDoc, where } from 'firebase/firestore'

import { assertIsDefined } from '@/lib/assert'
import { useDocs } from '@/lib/firestore'
import { bookRef, booksRef } from '@/model/book'
import { Order, orderRef, ordersRef } from '@/model/order'
import { useAuth } from '@/service/auth'

export const useQuery = () => {
  const { user } = useAuth()
  assertIsDefined(user)

  const [_purchasedBooks] = useDocs(
    query(booksRef(), where('purchaserIds', 'array-contains', user.id))
  )
  const purchasedBooks = _purchasedBooks || []

  const [_orderedBooks] = useDocs(query(booksRef(), where('ordererIds', 'array-contains', user.id)))
  const orderedBooks = _orderedBooks || []

  const books = [...purchasedBooks, ...orderedBooks]

  const [_orders] = useDocs(query(ordersRef(), where('userId', '==', user.id)))
  const orders = _orders || []

  return { books, orders }
}

export const useMutation = () => {
  const { user } = useAuth()
  assertIsDefined(user)

  const cancelOrder = async (order: Order) => {
    await deleteDoc(orderRef({ orderId: order.id }))
    for (const book of order.books) {
      await updateDoc(bookRef({ bookId: book.id }), { ordererIds: arrayRemove(user.id) })
    }
  }

  return { cancelOrder }
}
