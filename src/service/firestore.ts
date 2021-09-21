import { BookData, ChapterData, getDefaultBookData, getDefaultChapterData } from '@/domain'
import { createFirestoreService } from '@/service/_firestore'

export { useSubscribeCollection, useSubscribeDoc } from '@/service/_firestore'

export const BookService = createFirestoreService<BookData, void>({
  getCollectionPath: () => 'books',
  getDefaultData: getDefaultBookData,
})

export const ChapterService = createFirestoreService<ChapterData, { bookId: string }>({
  getCollectionPath: ({ bookId }) => `books/${bookId}/chapters`,
  getDefaultData: getDefaultChapterData,
})
