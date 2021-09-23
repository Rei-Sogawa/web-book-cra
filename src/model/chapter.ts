import { orderBy, query } from 'firebase/firestore'

import { serverTimestamp } from '@/lib/date'
import { createFirestoreService, useSubscribeCollection } from '@/service/firestore'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

// Schema
export type ChapterData = {
  number: number
  title: string
  content: string
  images: { path: string; url: string }[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

export const getDefaultChapterData = (): TimestampToFieldValue<ChapterData> => ({
  number: 0,
  title: '',
  content: '',
  images: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

// Service
export const ChapterService = createFirestoreService(
  getDefaultChapterData,
  ({ bookId }: { bookId: string }) => `books/${bookId}/chapters`
)

// Query
export const useChapters = ({ bookId }: { bookId: string }) => {
  const chapters = useSubscribeCollection<ChapterData>(
    query(ChapterService.getCollectionRef({ bookId }), orderBy('number'))
  )
  return chapters
}
