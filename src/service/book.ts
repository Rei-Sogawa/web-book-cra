import { orderBy, query } from 'firebase/firestore'

import { BookData, getDefaultData } from '@/domain/book'
import { createFirestoreService, useSubscribeCollection } from '@/service/firestore'

export const BookService = createFirestoreService<BookData, void>({
  getPath: () => 'books',
  getDefaultData,
})

export const useBooks = () => {
  const books = useSubscribeCollection({
    query: query(BookService.getCollectionRef(), orderBy('number')),
  })
  return books
}
