import { db } from '../firebaseApp'
import { createConvertor, WithId } from '../lib/firestore'
import { Chapter } from './chapter'

// schema
export type chapterSummaryData = Pick<Chapter, 'number' | 'title' | 'wardCount'>
export type chapterSummary = WithId<chapterSummaryData>

// ref
const chapterSummaryConvertor = createConvertor<chapterSummaryData>()

export const chapterSummariesRef = ({ bookId }: { bookId: string }) => {
  return db.collection(`books/${bookId}/chapterSummaries`).withConverter(chapterSummaryConvertor)
}
export const chapterSummaryRef = ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
  return chapterSummariesRef({ bookId }).doc(chapterId)
}
