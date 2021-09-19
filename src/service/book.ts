import { BookData, getDefaultData } from '@/domain/book'
import { createFirestoreService } from '@/service/firestore'

export const BookService = createFirestoreService<BookData, void>({
  getCollectionPath: () => 'books',
  getDefaultData,
})
