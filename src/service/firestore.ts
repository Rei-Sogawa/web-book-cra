import { BookData, ChapterData, getDefaultBookData, getDefaultChapterData } from '@/domain'
import { createFirestoreService } from '@/service/_firestore'

export { useSubscribeCollection, useSubscribeDoc } from '@/service/_firestore'

export const BookService = createFirestoreService<BookData, void>({
  getDefaultData: getDefaultBookData,
  getCollectionPath: () => 'books',
})

export const ChapterService = createFirestoreService<ChapterData, { bookId: string }>({
  getDefaultData: getDefaultChapterData,
  getCollectionPath: ({ bookId }) => `books/${bookId}/chapters`,
})
