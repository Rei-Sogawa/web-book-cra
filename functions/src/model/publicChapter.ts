import { db } from '../firebaseApp'
import { convertor, WithId } from '../lib/firestore'
import { Chapter } from './chapter'

// schema
export type PublicChapterData = Pick<Chapter, 'number' | 'title'>
export type PublicChapter = WithId<PublicChapterData>

// ref
const publicChapterConvertor = convertor<PublicChapterData>()

export const publicChaptersRef = ({ bookId }: { bookId: string }) => {
  return db.collection(`books/${bookId}/publicChapters`).withConverter(publicChapterConvertor)
}
export const publicChapterRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return publicChaptersRef({ bookId }).doc(chapterId)
}
