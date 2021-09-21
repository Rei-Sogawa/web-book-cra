import { serverTimestamp } from '@/lib/date'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

export type BookData = {
  title: string
  description: string
  authorNames: string[]
  image: { path: string; url: string } | null
  price: number
  published: boolean
  releasedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Book = WithId<BookData>

export const getDefaultBookData = (): TimestampToFieldValue<BookData> => ({
  title: '',
  description: '',
  authorNames: [],
  image: null,
  price: 0,
  published: false,
  releasedAt: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
