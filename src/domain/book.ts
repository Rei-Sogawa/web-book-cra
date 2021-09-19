import { serverTimestamp } from '@/lib/date'
import { Timestamp, TimestampToFieldValue, WithId } from '@/types'

export type BookData = {
  title: string
  description: string
  authorNames: string[]
  imageUrl: string | null
  imagePath: string | null
  price: number
  published: boolean
  releasedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Book = WithId<BookData>

export const getDefaultData = (): TimestampToFieldValue<BookData> => ({
  title: '',
  description: '',
  authorNames: [],
  imageUrl: null,
  imagePath: null,
  price: 0,
  published: false,
  releasedAt: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
