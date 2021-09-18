import { orderBy, query } from 'firebase/firestore'

import { BookData, getDefaultData } from '@/domain/book'
import { createFirestoreService, useSubscribeCollection } from '@/service/firestore'

export const BookService = createFirestoreService<BookData>({
  getPath: () => 'books',
  getDefaultData,
})

export const useBooks = () => {
  const books = useSubscribeCollection<BookData>({
    query: query(BookService.getCollectionRef()),
  })
  return books
}
