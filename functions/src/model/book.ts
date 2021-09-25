import { db } from "../firebaseApp"
import { convertor, Timestamp, WithId } from "../lib/firestore"
import { Chapter } from "./chapter"

// schema
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
  chapters: Pick<Chapter, 'id' | 'number' | 'title'>[]
}

export type Book = WithId<BookData>

// ref
const bookConvertor = convertor<BookData>()

export const booksRef = () => {
  return db.collection("books").withConverter(bookConvertor)
}
export const bookRef = ({bookId}:{bookId: string}) => {
  return booksRef().doc(bookId)
}