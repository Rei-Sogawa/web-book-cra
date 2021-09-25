import { orderBy, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { useDoc, useDocs } from '@/lib/firestore'
import { bookRef } from '@/model/book'
import { publicChaptersRef } from '@/model/publicChapter'

export const useBookShowPageQuery = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [book] = useDoc(bookRef({ bookId }))
  const [_publicChapters] = useDocs(query(publicChaptersRef({ bookId }), orderBy('number')))
  const publicChapters = _publicChapters || []

  return { book, publicChapters }
}
