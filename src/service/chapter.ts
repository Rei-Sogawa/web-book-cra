import { orderBy, query } from 'firebase/firestore'

import { ChapterData, getDefaultData } from '@/domain/chapter'
import { createFirestoreService, useSubscribeCollection } from '@/service/firestore'

export const ChapterService = createFirestoreService<ChapterData, { bookId: string }>({
  getPath: ({ bookId }) => `books/${bookId}/chapters`,
  getDefaultData,
})

export const useChapters = ({ bookId }: { bookId: string }) => {
  const chapters = useSubscribeCollection<ChapterData>({
    query: query(ChapterService.getCollectionRef({ bookId }), orderBy('number')),
  })

  return chapters
}
