import { serverTimestamp } from '@/lib/date'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

export type ChapterData = {
  number: number
  heading: string
  content: string
  imageUrls: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

export const getDefaultData = (): TimestampToFieldValue<ChapterData> => ({
  number: 0,
  heading: '',
  content: '',
  imageUrls: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
