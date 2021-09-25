import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { convertor, WithId } from '@/lib/firestore'

import { ChapterData } from './chapter'

// schema
export type PublicChapterData = Pick<ChapterData, 'number' | 'title'>

export type PublicChapter = WithId<PublicChapterData>

// ref
const publicChapterConvertor = convertor<PublicChapterData>()

export const publicChaptersRef = ({ bookId }: { bookId: string }) => {
  return collection(db, `books/${bookId}/publicChapters`).withConverter(publicChapterConvertor)
}
export const publicChapterRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return doc(db, publicChaptersRef({ bookId }).path, chapterId).withConverter(
    publicChapterConvertor
  )
}
