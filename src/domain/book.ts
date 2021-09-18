import { serverTimestamp } from '@/lib/date'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

export type BookData = {
  title: string
  authorIds: string[]
  imageUrl: string | null
  price: number
  published: boolean
  releasedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Book = WithId<BookData>

export const getDefaultData = (): TimestampToFieldValue<BookData> => ({
  title: '',
  authorIds: [],
  imageUrl: null,
  price: 0,
  published: false,
  releasedAt: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
