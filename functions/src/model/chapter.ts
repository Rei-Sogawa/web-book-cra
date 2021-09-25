import { db } from '../firebaseApp'
import { convertor, Timestamp, WithId } from '../lib/firestore'

// schema
export type ChapterData = {
  number: number
  title: string
  content: string
  images: { path: string; url: string }[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Chapter = WithId<ChapterData>

// ref
const chapterConvertor = convertor<ChapterData>()

export const chapterPathTemplate = "books/{bookId}/chapters/{chapterId}"

export const chaptersRef = ({bookId}: {bookId:string}) => {
  return db.collection("chapters").withConverter(chapterConvertor)
}
export const chapterRef = ({bookId, chapterId}:{bookId: string, chapterId: string}) => {
  return chaptersRef({bookId}).doc(chapterId)
}
