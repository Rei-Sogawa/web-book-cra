import { ChapterData, getDefaultData } from '@/domain/chapter'

import { createFirestoreService } from './firestore'

export const ChapterService = createFirestoreService<ChapterData, { bookId: string }>({
  getPath: ({ bookId }) => `books/${bookId}/chapters`,
  getDefaultData,
})
