import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { useDoc, useDocs } from '@/lib/firestore'
import { bookRef } from '@/model/book'
import { chapterSummariesRef } from '@/model/chapterSummary'

export const useBookShowPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [_chapterSummaries] = useDocs(query(chapterSummariesRef({ bookId }), orderBy('number')))
  const chapterSummaries = _chapterSummaries || []

  return { book, chapterSummaries }
}
