import { ChapterData, getDefaultData } from '@/domain/chapter'
import { createFirestoreService } from '@/service/firestore'

export const ChapterService = createFirestoreService<ChapterData, { bookId: string }>({
  getCollectionPath: ({ bookId }) => `books/${bookId}/chapters`,
  getDefaultData,
})
