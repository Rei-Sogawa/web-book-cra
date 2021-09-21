import * as BookDomain from '@/domain/book'
import * as ChapterDomain from '@/domain/chapter'
import { createFirestoreService } from '@/service/_firestore'
export { useSubscribeCollection, useSubscribeDoc } from '@/service/_firestore'

export const BookService = createFirestoreService<BookDomain.BookData, void>({
  getCollectionPath: () => 'books',
  getDefaultData: BookDomain.getDefaultData,
})

export const ChapterService = createFirestoreService<ChapterDomain.ChapterData, { bookId: string }>(
  {
    getCollectionPath: ({ bookId }) => `books/${bookId}/chapters`,
    getDefaultData: ChapterDomain.getDefaultData,
  }
)
