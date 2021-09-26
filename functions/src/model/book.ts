import { db } from "../firebaseApp"
import { createConvertor, Timestamp, WithId } from "../lib/firestore"

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
}

export type Book = WithId<BookData>

// ref
const bookConvertor = createConvertor<BookData>()

export const booksRef = () => {
  return db.collection("books").withConverter(bookConvertor)
}
export const bookRef = ({bookId}:{bookId: string}) => {
  return booksRef().doc(bookId)
}
