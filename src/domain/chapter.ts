import { serverTimestamp } from '@/lib/date'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

export type ChapterData = {
  number: number
  title: string
  content: string
  images: { path: string; url: string }[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

export const getDefaultData = (): TimestampToFieldValue<ChapterData> => ({
  number: 0,
  title: '',
  content: '',
  images: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
