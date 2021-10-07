import {
  addDoc,
  arrayRemove,
  arrayUnion,
  documentId,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { assertIsDefined } from '@/lib/assert'
import { useDocs } from '@/lib/firestore'
import { Book, bookRef, booksRef } from '@/model/book'
import { getDefaultOrderData, ordersRef } from '@/model/order'
import { User, userRef } from '@/model/user'
import { useAuth } from '@/service/auth'

export const useQuery = () => {
  const { user } = useAuth()
  assertIsDefined(user)
  const cart = user.cart || []
  const [_books] = useDocs(cart.length ? query(booksRef(), where(documentId(), 'in', cart)) : null)
  const books = _books || []

  return { user, books }
}

export const useMutation = (user: User, books: Book[]) => {
  const createOrder = async () => {
    await addDoc(ordersRef(), {
      ...getDefaultOrderData(),
      userId: user.id,
      books: books.map((book) => ({ id: book.id, price: book.price })),
    })
    for (const book of books) {
      await updateDoc(bookRef({ bookId: book.id }), { ordererIds: arrayUnion(user.id) })
    }
    await updateDoc(userRef({ userId: user.id }), { cart: [] })
  }

  const removeBookFromCart = async (book: Book) => {
    await updateDoc(userRef({ userId: user.id }), { cart: arrayRemove(book.id) })
  }

  return { createOrder, removeBookFromCart }
}
