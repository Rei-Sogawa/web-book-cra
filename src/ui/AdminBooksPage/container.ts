import { arrayRemove, arrayUnion, updateDoc } from '@firebase/firestore'

import { useDocs } from '@/lib/firestore'
import { Book, BookModel, bookRef, booksRef } from '@/model/book'
import { Order, orderRef, ordersRef } from '@/model/order'
import { usersRef } from '@/model/user'
import { AuthService } from '@/service/auth'

export const useAdminBooksPageQuery = () => {
  const [_users] = useDocs(usersRef())
  const users = _users || []

  const [_orders] = useDocs(ordersRef())
  const orders = _orders || []

  const [_books] = useDocs(booksRef())
  const books = _books || []

  return { users, orders, books }
}

export const useAdminBooksPageMutation = () => {
  const signOut = AuthService.signOut

  const deleteBook = async (book: Book) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    await BookModel.deleteBook(book)
  }

  const approveOrder = async (order: Order) => {
    await updateDoc(orderRef({ orderId: order.id }), { status: 'fulfilled' })
    for (const book of order.books) {
      await updateDoc(bookRef({ bookId: book.id }), {
        ordererIds: arrayRemove(order.userId),
        purchaserIds: arrayUnion(order.userId),
      })
    }
  }

  const unapproveOrder = async (order: Order) => {
    await updateDoc(orderRef({ orderId: order.id }), { status: 'pending' })
    for (const book of order.books) {
      await updateDoc(bookRef({ bookId: book.id }), {
        ordererIds: arrayUnion(order.userId),
        purchaserIds: arrayRemove(order.userId),
      })
    }
  }

  return { signOut, deleteBook, approveOrder, unapproveOrder }
}
