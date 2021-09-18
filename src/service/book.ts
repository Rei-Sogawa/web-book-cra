import { addDoc, collection, doc, getDoc } from 'firebase/firestore'

import { Book, BookData, getDefaultData } from '@/domain/book'
import { db } from '@/firebaseApp'

const booksPath = () => 'books'

const booksCollectionRef = () => collection(db, booksPath())

const bookDocRef = ({ bookId }: { bookId: string }) => doc(db, booksPath(), bookId)

export const createBook = ({ newData }: { newData: Partial<BookData> }) => {
  return addDoc(booksCollectionRef(), { ...getDefaultData(), ...newData })
}

export const getBook = async ({ bookId }: { bookId: string }) => {
  const docSnap = await getDoc(bookDocRef({ bookId }))
  return { id: docSnap.id, ...docSnap.data() } as Book
}
