import { db } from '../firebaseApp'
import { createConvertor, Timestamp, WithId } from '../lib/firestore'

// schema
export type ChapterData = {
  number: number
  title: string
  content: string
  wardCount: number
  images: { path: string; url: string }[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

// ref
const chapterConvertor = createConvertor<ChapterData>()

export const chaptersRef = ({ bookId }: { bookId: string }) => {
  return db.collection(`books/${bookId}/chapters`).withConverter(chapterConvertor)
}
export const chapterRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return chaptersRef({ bookId }).doc(chapterId)
}
