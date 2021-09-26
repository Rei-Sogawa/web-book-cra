import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { createConvertor, WithId } from '@/lib/firestore'

import { ChapterData } from './chapter'

// schema
export type chapterSummaryData = Pick<ChapterData, 'number' | 'title' | 'wardCount'>
export type chapterSummary = WithId<chapterSummaryData>

// ref
const chapterSummaryConvertor = createConvertor<chapterSummaryData>()

export const chapterSummariesRef = ({ bookId }: { bookId: string }) => {
  return collection(db, `books/${bookId}/chapterSummaries`).withConverter(chapterSummaryConvertor)
}
export const chapterSummaryRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return doc(db, chapterSummariesRef({ bookId }).path, chapterId).withConverter(
    chapterSummaryConvertor
  )
}
